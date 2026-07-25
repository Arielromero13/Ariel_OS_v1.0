export type Provider = 'gemini' | 'openai' | 'claude';
export type ArtifactRole = 'current_evidence' | 'historical_reference' | 'normative_source' | 'contextual_reference' | 'template';

export interface StoredArtifact {
  artifact_id: string;
  case_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  sha256: string;
  storage_path: string;
  uploaded_at: string;
  role: ArtifactRole;
  extraction: Record<string, unknown>;
}

export interface StoredCase {
  case_id: string;
  created_at: string;
  updated_at: string;
  artifacts: StoredArtifact[];
  metadata: Record<string, unknown>;
}

export interface ExecutionRecord {
  execution_id: string;
  stage_id: string;
  provider: Provider;
  model: string;
  expected_record_type: string;
  status: 'record_validated' | 'correction_required' | 'blocked';
  created_at: string;
  validation_errors: string[];
  record?: unknown;
  context_manifest: Record<string, unknown>;
}

export interface StoredWorkItem {
  task_id: string;
  case_id: string;
  workflow_id?: string;
  definition_of_done?: unknown;
  input_manifest?: unknown;
  lifecycle: { status: string; correction_cycle: number };
  execution_records: ExecutionRecord[];
  metadata: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
