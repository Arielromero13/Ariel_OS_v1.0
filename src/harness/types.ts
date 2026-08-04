// Ariel Agent OS Harness & Model Connectors Specification

import { WorkItem, RoleId, HandoffRecord, GateStatus } from '../types';

export type ModelProvider = 
  | 'native_antigravity' 
  | 'native_claude_code' 
  | 'native_codex_cli' 
  | 'native_codex_cloud'
  | 'gemini' 
  | 'openai' 
  | 'claude' 
  | 'simulator';

export interface ModelConfig {
  provider: ModelProvider;
  modelName: string;
  apiKey?: string;
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

export interface ModelCompletionResponse {
  provider: ModelProvider;
  modelUsed: string;
  outputArtifacts: string[];
  notes: string;
  requestedCorrection?: {
    type: 'patch' | 'partial_rework' | 'full_rework' | 'user_clarification';
    reason: string;
  };
  rawTextResponse: string;
  timestamp: string;
  executionTimeMs: number;
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
