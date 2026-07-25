import { BaseModelConnector } from './base';
import { PromptPayload, ModelCompletionResponse } from '../types';

export class LocalSimulatorConnector extends BaseModelConnector {
  public async executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse> {
    return {
      provider: 'simulator',
      modelUsed: 'Ariel OS Browser Simulation',
      outputArtifacts: [],
      notes: 'Simulación visual completada. No se crearon artefactos ni se modificaron compuertas.',
      rawTextResponse: 'SIMULACIÓN: el rol ' + payload.role + ' revisaría la etapa ' + payload.stageId + ' cuando exista un worker autorizado.',
      timestamp: new Date().toISOString(),
      executionTimeMs: 0,
      isSimulated: true,
      structuredOutput: {
        contractType: 'handoff',
        validationStatus: 'not_attempted',
        recordIds: [],
        errors: ['simulation_has_no_authority'],
      },
    };
  }
}
