import { BaseModelConnector } from '../src/harness/connectors/base';
import { PromptPayload, ModelCompletionResponse } from '../src/harness/types';

/**
 * Marcador de adaptador para un worker local con Claude Code instalado y autenticado.
 * No ejecuta subprocesses desde el navegador.
 */
export class NativeClaudeCodeAdapter extends BaseModelConnector {
  public async executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse> {
    return {
      provider: 'native_claude_code',
      modelUsed: 'Claude Code worker not configured',
      outputArtifacts: [],
      notes: 'Adaptador declarado, no conectado.',
      rawTextResponse: 'Se requiere un worker local autorizado con Claude Code, expediente aislado y protocolo de salida estructurada.',
      timestamp: new Date().toISOString(),
      executionTimeMs: 0,
      isSimulated: true,
    };
  }
}
