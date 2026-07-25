import { BaseModelConnector } from '../../src/harness/connectors/base';
import { PromptPayload, ModelCompletionResponse } from '../../src/harness/types';

/**
 * Marcador de adaptador para un worker de Antigravity con credenciales y
 * capacidades explícitamente provistas por ese entorno. No asume variables de
 * entorno ni IPC que no hayan sido documentados y verificados.
 */
export class NativeAntigravityAdapter extends BaseModelConnector {
  public async executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse> {
    return {
      provider: 'native_antigravity',
      modelUsed: 'Antigravity worker not configured',
      outputArtifacts: [],
      notes: 'Adaptador declarado, no conectado.',
      rawTextResponse: 'Se requiere un worker autorizado y una integración documentada por Antigravity antes de ejecutar este proveedor.',
      timestamp: new Date().toISOString(),
      executionTimeMs: 0,
      isSimulated: true,
    };
  }
}
