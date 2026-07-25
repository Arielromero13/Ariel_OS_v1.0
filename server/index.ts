import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import crypto from 'node:crypto';
import { assertProductionConfiguration, assertSafeId, config } from './config.js';
import { ingestArtifact } from './artifact-worker.js';
import { executeStage } from './orchestrator.js';
import { getCase, getWorkItem, initializeStorage, saveCase, saveWorkItem } from './storage.js';
import type { ArtifactRole, Provider, StoredCase, StoredWorkItem } from './types.js';

assertProductionConfiguration();
await initializeStorage();

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024, files: 1 } });
app.use(cors({ origin: config.clientOrigin, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '2mb' }));

function authorize(request: Request, response: Response, next: NextFunction): void {
  if (!config.apiToken) { next(); return; }
  if (request.header('authorization') === 'Bearer ' + config.apiToken) { next(); return; }
  response.status(401).json({ error: 'Unauthorized' });
}
function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(field + ' is required.');
  return value.trim();
}
function errorResponse(response: Response, error: unknown): void {
  const message = (error as Error).message || 'Request failed.';
  const status = /not found/.test(message) ? 404 : /required|invalid|Unsupported/.test(message) ? 400 : 500;
  response.status(status).json({ error: message });
}

app.get('/health', (_request, response) => response.json({ status: 'ok', mode: config.nodeEnv, secrets_exposed_to_client: false }));
app.use('/api', authorize);

app.post('/api/cases', async (request, response) => {
  try {
    const caseId = assertSafeId(requiredString(request.body.case_id, 'case_id'), 'case_id');
    if (await getCase(caseId)) throw new Error('case already exists');
    const now = new Date().toISOString();
    const value: StoredCase = { case_id: caseId, created_at: now, updated_at: now, artifacts: [], metadata: request.body.metadata || {} };
    await saveCase(value); response.status(201).json(value);
  } catch (error) { errorResponse(response, error); }
});
app.get('/api/cases/:caseId', async (request, response) => {
  try { const value = await getCase(request.params.caseId); if (!value) throw new Error('case not found'); response.json(value); } catch (error) { errorResponse(response, error); }
});

app.post('/api/work-items', async (request, response) => {
  try {
    const taskId = assertSafeId(requiredString(request.body.task_id, 'task_id'), 'task_id');
    const caseId = assertSafeId(requiredString(request.body.case_id, 'case_id'), 'case_id');
    if (!await getCase(caseId)) throw new Error('case not found');
    if (await getWorkItem(taskId)) throw new Error('work item already exists');
    const value: StoredWorkItem = { task_id: taskId, case_id: caseId, workflow_id: request.body.workflow_id, definition_of_done: request.body.definition_of_done, input_manifest: request.body.input_manifest, lifecycle: { status: 'draft', correction_cycle: 0 }, execution_records: [], metadata: request.body.metadata || {} };
    await saveWorkItem(value); response.status(201).json(value);
  } catch (error) { errorResponse(response, error); }
});
app.get('/api/work-items/:taskId', async (request, response) => {
  try { const value = await getWorkItem(request.params.taskId); if (!value) throw new Error('work item not found'); response.json(value); } catch (error) { errorResponse(response, error); }
});

app.post('/api/artifacts', upload.single('file'), async (request, response) => {
  try {
    if (!request.file) throw new Error('file is required');
    const caseId = assertSafeId(requiredString(request.body.case_id, 'case_id'), 'case_id');
    const role = requiredString(request.body.role, 'role') as ArtifactRole;
    const allowed: ArtifactRole[] = ['current_evidence', 'historical_reference', 'normative_source', 'contextual_reference', 'template'];
    if (!allowed.includes(role)) throw new Error('role is invalid');
    const caseRecord = await getCase(caseId); if (!caseRecord) throw new Error('case not found');
    const artifact = await ingestArtifact({ caseId, role, file: request.file });
    if (!caseRecord.artifacts.some((item) => item.sha256 === artifact.sha256)) caseRecord.artifacts.push(artifact);
    caseRecord.updated_at = new Date().toISOString(); await saveCase(caseRecord);
    response.status(201).json(artifact);
  } catch (error) { errorResponse(response, error); }
});

app.post('/api/execute-stage', async (request, response) => {
  try {
    const taskId = assertSafeId(requiredString(request.body.task_id, 'task_id'), 'task_id');
    const stageId = assertSafeId(requiredString(request.body.stage_id, 'stage_id'), 'stage_id');
    const provider = requiredString(request.body.provider, 'provider') as Provider;
    if (!(['gemini', 'openai', 'claude'] as Provider[]).includes(provider)) throw new Error('provider is invalid');
    const model = requiredString(request.body.model, 'model');
    const record = await executeStage({ taskId, stageId, provider, model });
    response.status(record.status === 'blocked' ? 409 : 200).json(record);
  } catch (error) { errorResponse(response, error); }
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const message = (error as Error).message || 'Unexpected request error.';
  response.status(400).json({ error: message });
});

app.listen(config.port, () => {
  console.log('Ariel OS orchestration API listening on port ' + config.port + '.');
});
