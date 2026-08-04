import { BaseModelConnector } from './base';
import { PromptPayload, ModelCompletionResponse } from '../types';

/**
 * Conector de Claude vía la API de Anthropic.
 *
 * Nunca llama a api.anthropic.com directamente desde el navegador — este
 * proyecto es una SPA de Vite sin backend propio, así que una llamada
 * directa expondría cualquier API key introducida en el cliente. En su
 * lugar, llama al endpoint same-origin /api/claude (función serverless de
 * Vercel, ver api/claude.ts), que guarda la credencial del lado del
 * servidor en la variable de entorno ANTHROPIC_API_KEY.
 *
 * Si el endpoint no responde (ej. corriendo en `vite dev` sin Vercel, o la
 * función serverless falla), cae a modo simulación — mismo comportamiento
 * que los demás conectores de este repositorio.
 */
export class ClaudeModelConnector extends BaseModelConnector {
  public async executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: payload.systemInstruction,
          specificRequest: payload.specificRequest,
          modelName: this.config.modelName,
          maxTokens: this.config.maxTokens,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        return {
          provider: 'claude',
          modelUsed: json.modelUsed || this.config.modelName || 'claude-sonnet-4-6',
          outputArtifacts: [`claude_result_${payload.stageId}.json`],
          notes: 'Respuesta procesada exitosamente vía /api/claude (función serverless).',
          rawTextResponse: json.rawTextResponse || 'Claude no devolvió texto.',
          timestamp: new Date().toISOString(),
          executionTimeMs: Date.now() - startTime,
        };
      }

      console.warn(`Claude API proxy respondió ${response.status}, cayendo a simulación.`);
    } catch (err) {
      console.warn('No se pudo alcanzar /api/claude, cayendo a simulación:', err);
    }

    return {
      provider: 'claude',
      modelUsed: `${this.config.modelName || 'claude-sonnet-4-6'} (simulado — /api/claude no disponible)`,
      outputArtifacts: [`claude_artifact_${payload.stageId}.json`],
      notes: `[Claude Adapter — simulación] Rol '${payload.role}' habría ejecutado la etapa '${payload.stageId}' vía la API de Claude. En 'vite dev' local, /api/claude solo responde bajo 'vercel dev' o desplegado en Vercel.`,
      rawTextResponse: `[SIMULACIÓN CLAUDE] Tarea del rol '${payload.role}' preparada para la etapa '${payload.stageId}'.`,
      timestamp: new Date().toISOString(),
      executionTimeMs: Date.now() - startTime + 150,
    };
  }
}
