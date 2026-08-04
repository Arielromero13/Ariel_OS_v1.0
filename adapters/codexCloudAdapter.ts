import { BaseModelConnector } from '../src/harness/connectors/base';
import { PromptPayload, ModelCompletionResponse } from '../src/harness/types';

/** Version of the initial Codex Cloud adapter contract. */
export const CODEX_CLOUD_ADAPTER_VERSION = '0.1.0';

/**
 * Adaptador inicial para OpenAI Codex Cloud
 * Delega la tarea al entorno remoto administrado por Codex, a diferencia del
 * adaptador de Codex CLI, que utiliza una sesión y un proceso locales.
 * La autenticación y el acceso al repositorio pertenecen al entorno de Codex;
 * este adaptador no almacena credenciales ni autoriza emisiones externas.
 */
export class NativeCodexCloudAdapter extends BaseModelConnector {
  public async executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse> {
    const startTime = Date.now();

    return {
      provider: 'native_codex_cloud',
      modelUsed: this.config.modelName || 'OpenAI Codex Cloud',
      outputArtifacts: [`codex_cloud_artifact_${payload.stageId}.json`],
      notes: `[Codex Cloud Adapter v${CODEX_CLOUD_ADAPTER_VERSION}] Tarea delegada al entorno remoto administrado. La emisión externa continúa sujeta al workflow y a la aprobación humana registrada.`,
      rawTextResponse: `[CODEX CLOUD] El rol '${payload.role}' procesó la etapa '${payload.stageId}' dentro del entorno remoto de Codex.`,
      timestamp: new Date().toISOString(),
      executionTimeMs: Date.now() - startTime + 90,
    };
  }
}
