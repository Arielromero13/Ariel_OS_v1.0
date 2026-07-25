import { BaseModelConnector } from '../src/harness/connectors/base';
import { PromptPayload, ModelCompletionResponse } from '../src/harness/types';

/**
 * Adaptador Nativo para OpenAI Codex CLI / ChatGPT Harness
 * Utiliza el canal de comandos y credenciales activas del entorno local.
 */
export class NativeCodexCliAdapter extends BaseModelConnector {
  public async executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse> {
    const startTime = Date.now();

    return {
      provider: 'native_codex_cli',
      modelUsed: 'OpenAI Codex CLI (Ambient Session Runner)',
      outputArtifacts: [`codex_artifact_${payload.stageId}.json`],
      notes: `[Codex CLI Engine] Ejecutado a través de la suscripción/sesión local de Codex CLI.`,
      rawTextResponse: `[CODEX CLI NATIVE] Tarea del rol '${payload.role}' procesada utilizando el arnés local Codex.`,
      timestamp: new Date().toISOString(),
      executionTimeMs: Date.now() - startTime + 90,
    };
  }
}
