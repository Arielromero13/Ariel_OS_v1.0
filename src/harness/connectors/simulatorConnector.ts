import { BaseModelConnector } from './base';
import { PromptPayload, ModelCompletionResponse } from '../types';

export class LocalSimulatorConnector extends BaseModelConnector {
  public async executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse> {
    const startTime = Date.now();

    return {
      provider: 'simulator',
      modelUsed: 'Local Ariel Agent OS Engine (Deterministic Harness)',
      outputArtifacts: [`local_sim_${payload.stageId}.json`],
      notes: `[Simulador Local] Verificados contratos y schema para etapa '${payload.stageId}'.`,
      rawTextResponse: `[SIMULACIÓN LOCAL] Rol '${payload.role}' procesó el mandato del orquestador. Todos los esquemas de evidencia coinciden.`,
      timestamp: new Date().toISOString(),
      executionTimeMs: Date.now() - startTime + 30,
    };
  }
}
