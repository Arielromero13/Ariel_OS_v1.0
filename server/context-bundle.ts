import type { StoredCase, StoredWorkItem } from './types.js';

export function expectedRecordType(stageId: string): string {
  if (stageId === 'evidence_control') return 'evidence';
  if (stageId === 'technical_analysis' || stageId === 'normative_analysis') return 'finding';
  if (stageId === 'technical_review' || stageId === 'visual_evidence_qa' || stageId === 'intent_validation') return 'review';
  if (stageId === 'decision_audit') return 'audit_decision';
  return 'handoff';
}

export function buildContextBundle(workItem: StoredWorkItem, caseRecord: StoredCase, stageId: string): Record<string, unknown> {
  const base = { task_id: workItem.task_id, case_id: workItem.case_id, workflow_id: workItem.workflow_id || null, definition_of_done: workItem.definition_of_done || null, stage_id: stageId };
  const artifactSummary = caseRecord.artifacts.map((artifact) => ({ artifact_id: artifact.artifact_id, role: artifact.role, file_name: artifact.file_name, sha256: artifact.sha256, extraction: artifact.extraction }));
  if (stageId === 'evidence_control' || stageId === 'technical_analysis') return { ...base, current_evidence: artifactSummary.filter((x) => x.role === 'current_evidence'), input_manifest: workItem.input_manifest || null, restriction: 'No normativa unless provided as evidence.' };
  if (stageId === 'normative_analysis') return { ...base, normative_sources: artifactSummary.filter((x) => x.role === 'normative_source'), normative_question: (workItem.metadata || {}).normative_question || null, restriction: 'Do not receive field photos or unrelated artifacts.' };
  return { ...base, artifacts: artifactSummary.map((x) => ({ artifact_id: x.artifact_id, role: x.role, sha256: x.sha256 })), prior_execution_records: workItem.execution_records.map((x) => ({ execution_id: x.execution_id, stage_id: x.stage_id, status: x.status, expected_record_type: x.expected_record_type, record: x.record })), restriction: 'Review only the structured trace supplied; do not infer missing evidence.' };
}
