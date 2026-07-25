import { BaseModelConnector } from '../src/harness/connectors/base';
import { PromptPayload, ModelCompletionResponse } from '../src/harness/types';

/**
 * Marcador de adaptador para un worker local con Codex CLI instalado y autenticado.
 * No ejecuta Codex desde el navegador ni asume que una suscripción se puede usar
 * como API. La integración real vive en un worker autorizado.
 */
export class NativeCodexCliAdapter extends BaseModelConnector {
  public async executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse> {
    return {
      provider: 'native_codex_cli',
      modelUsed: 'Codex CLI worker not configured',
      outputArtifacts: [],
      notes: 'Adaptador declarado, no conectado.',
      rawTextResponse: 'Se requiere un worker local autorizado con Codex CLI, expediente aislado y protocolo de salida estructurada.',
      timestamp: new Date().toISOString(),
      executionTimeMs: 0,
      isSimulated: true,
    };
  }
}
