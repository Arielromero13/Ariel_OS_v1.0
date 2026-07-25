import crypto from 'node:crypto';
import { buildContextBundle, expectedRecordType } from './context-bundle.js';
import { runModel, extractJson } from './model-runner.js';
import { validateRecord } from './schema-validator.js';
import { getCase, getWorkItem, saveWorkItem } from './storage.js';
import type { ExecutionRecord, Provider, StoredWorkItem } from './types.js';

function correction(workItem: StoredWorkItem, stageId: string, provider: Provider, model: string, expected: string, context: Record<string, unknown>, errors: string[]): ExecutionRecord {
  const nextCycle = workItem.lifecycle.correction_cycle + 1;
  workItem.lifecycle.correction_cycle = nextCycle;
  const status = nextCycle >= 3 ? 'blocked' : 'correction_required';
  if (status === 'blocked') workItem.lifecycle.status = 'blocked';
  return { execution_id: 'exe-' + crypto.randomUUID(), stage_id: stageId, provider, model, expected_record_type: expected, status, created_at: new Date().toISOString(), validation_errors: errors, context_manifest: context };
}
function promptFor(expected: string, context: Record<string, unknown>): string {
  return 'You are a controlled Ariel Agent OS worker. Return only a JSON object with exactly two top-level keys: record_type and record. record_type must be ' + JSON.stringify(expected) + '. record must fully satisfy its repository JSON Schema. Do not invent evidence, dates, norms, thresholds or approvals. If evidence is insufficient, create the schema-valid record that declares the limitation and uses pending/non-conclusive paths when the schema permits. Context: ' + JSON.stringify(context);
}

export async function executeStage(input: { taskId: string; stageId: string; provider: Provider; model: string }): Promise<ExecutionRecord> {
  const workItem = await getWorkItem(input.taskId); if (!workItem) throw new Error('work item not found');
  const caseRecord = await getCase(workItem.case_id); if (!caseRecord) throw new Error('case not found');
  const expected = expectedRecordType(input.stageId);
  const context = buildContextBundle(workItem, caseRecord, input.stageId);
  try {
    const raw = await runModel(input.provider, input.model, promptFor(expected, context));
    const envelope = extractJson(raw) as { record_type?: string; record?: unknown };
    if (envelope.record_type !== expected) throw new Error('Expected record_type ' + expected + '.');
    const validation = await validateRecord(expected, envelope.record);
    if (!validation.valid) {
      const record = correction(workItem, input.stageId, input.provider, input.model, expected, context, validation.errors);
      workItem.execution_records.push(record); await saveWorkItem(workItem); return record;
    }
    const record: ExecutionRecord = { execution_id: 'exe-' + crypto.randomUUID(), stage_id: input.stageId, provider: input.provider, model: input.model, expected_record_type: expected, status: 'record_validated', created_at: new Date().toISOString(), validation_errors: [], record: envelope.record, context_manifest: context };
    workItem.execution_records.push(record);
    workItem.lifecycle.status = 'under_review';
    await saveWorkItem(workItem);
    return record;
  } catch (error) {
    const record = correction(workItem, input.stageId, input.provider, input.model, expected, context, [(error as Error).message]);
    workItem.execution_records.push(record); await saveWorkItem(workItem); return record;
  }
}
