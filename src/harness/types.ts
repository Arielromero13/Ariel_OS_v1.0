// Ariel Agent OS Harness & Model Connectors Specification

import { WorkItem, RoleId, HandoffRecord, GateStatus } from '../types';

export type ModelProvider =
  | 'native_antigravity'
  | 'native_claude_code'
  | 'native_codex_cli'
  | 'gemini'
  | 'openai'
  | 'claude'
  | 'simulator';

export type ExecutionMode = 'browser_simulation' | 'server_worker';

export interface ModelConfig {
  provider: ModelProvider;
  modelName: string;
  executionMode: ExecutionMode;
  temperature?: number;
  maxTokens?: number;
}

export interface PromptPayload {
  role: RoleId;
  stageId: string;
  systemInstruction: string;
  workItem: WorkItem;
  inputArtifacts: string[];
  specificRequest: string;
}

export interface StructuredOutput {
  contractType: 'handoff' | 'evidence' | 'finding' | 'review' | 'audit_decision' | 'report_manifest';
  validationStatus: 'valid' | 'invalid' | 'not_attempted';
  recordIds: string[];
  errors: string[];
}

export interface ModelCompletionResponse {
  provider: ModelProvider;
  modelUsed: string;
  outputArtifacts: string[];
  notes: string;
  rawTextResponse: string;
  timestamp: string;
  executionTimeMs: number;
  isSimulated: boolean;
  structuredOutput?: StructuredOutput;
  requestedCorrection?: {
    type: 'patch' | 'partial_rework' | 'full_rework' | 'user_clarification';
    reason: string;
  };
}

export interface HarnessExecutionResult {
  success: boolean;
  stageId: string;
  roleId: RoleId;
  updatedWorkItem: WorkItem;
  handoffRecord?: HandoffRecord;
  modelResponse: ModelCompletionResponse;
  blockingReasons: string[];
}
