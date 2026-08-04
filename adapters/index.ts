// Ariel Agent OS Model Harness Adapters
import { ModelConfig } from '../src/harness/types';
import { BaseModelConnector } from '../src/harness/connectors/base';
import { GeminiModelConnector } from '../src/harness/connectors/geminiConnector';
import { OpenAIModelConnector } from '../src/harness/connectors/openaiConnector';
import { ClaudeModelConnector } from '../src/harness/connectors/claudeConnector';
import { LocalSimulatorConnector } from '../src/harness/connectors/simulatorConnector';
import { NativeAntigravityAdapter } from './antigravity/antigravityAdapter';
import { NativeClaudeCodeAdapter } from './claudeCodeAdapter';
import { NativeCodexCliAdapter } from './codexCliAdapter';
import { NativeCodexCloudAdapter } from './codexCloudAdapter';

export function createModelConnector(config: ModelConfig): BaseModelConnector {
  switch (config.provider) {
    case 'native_antigravity':
      return new NativeAntigravityAdapter(config);
    case 'native_claude_code':
      return new NativeClaudeCodeAdapter(config);
    case 'native_codex_cli':
      return new NativeCodexCliAdapter(config);
    case 'native_codex_cloud':
      return new NativeCodexCloudAdapter(config);
    case 'gemini':
      return new GeminiModelConnector(config);
    case 'openai':
      return new OpenAIModelConnector(config);
    case 'claude':
      return new ClaudeModelConnector(config);
    case 'simulator':
    default:
      return new LocalSimulatorConnector(config);
  }
}

export {
  BaseModelConnector,
  GeminiModelConnector,
  OpenAIModelConnector,
  ClaudeModelConnector,
  LocalSimulatorConnector,
  NativeAntigravityAdapter,
  NativeClaudeCodeAdapter,
  NativeCodexCliAdapter,
  NativeCodexCloudAdapter,
};
