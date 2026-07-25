import { BaseModelConnector } from './base';
import { PromptPayload, ModelCompletionResponse } from '../types';

export class ClaudeModelConnector extends BaseModelConnector {
  public async executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse> {
    return {
      provider: 'claude',
      modelUsed: this.config.modelName,
      outputArtifacts: [],
      notes: 'Conector de navegador bloqueado. Claude debe ejecutarse desde un worker autorizado.',
      rawTextResponse: 'No se envió el expediente ni una API key desde el navegador. Configure un backend autorizado.',
      timestamp: new Date().toISOString(),
      executionTimeMs: 0,
      isSimulated: true,
      structuredOutput: {
        contractType: 'handoff',
        validationStatus: 'not_attempted',
        recordIds: [],
        errors: ['browser_connector_disabled'],
      },
    };
  }
}
