import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config, assertSafeId } from './config.js';
import type { StoredCase, StoredWorkItem } from './types.js';

async function ensureRoot(): Promise<void> {
  await mkdir(config.dataRoot, { recursive: true });
  await mkdir(path.join(config.dataRoot, 'cases'), { recursive: true });
  await mkdir(path.join(config.dataRoot, 'work-items'), { recursive: true });
}

async function readJson<T>(target: string): Promise<T | null> {
  try { return JSON.parse(await readFile(target, 'utf8')) as T; } catch (error: unknown) {
    if ((error as { code?: string }).code === 'ENOENT') return null;
    throw error;
  }
}

async function writeJson(target: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(target), { recursive: true });
  const temporary = target + '.tmp';
  await writeFile(temporary, JSON.stringify(value, null, 2) + '\n', 'utf8');
  await rename(temporary, target);
}

function casePath(caseId: string): string {
  return path.join(config.dataRoot, 'cases', assertSafeId(caseId, 'case_id'), 'case.json');
}
function workItemPath(taskId: string): string {
  return path.join(config.dataRoot, 'work-items', assertSafeId(taskId, 'task_id') + '.json');
}

export async function getCase(caseId: string): Promise<StoredCase | null> {
  await ensureRoot(); return readJson<StoredCase>(casePath(caseId));
}
export async function saveCase(value: StoredCase): Promise<void> {
  await ensureRoot(); await writeJson(casePath(value.case_id), value);
}
export async function getWorkItem(taskId: string): Promise<StoredWorkItem | null> {
  await ensureRoot(); return readJson<StoredWorkItem>(workItemPath(taskId));
}
export async function saveWorkItem(value: StoredWorkItem): Promise<void> {
  await ensureRoot(); await writeJson(workItemPath(value.task_id), value);
}
export async function initializeStorage(): Promise<void> { await ensureRoot(); }
