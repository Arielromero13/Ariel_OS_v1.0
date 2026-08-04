import { BaseModelConnector } from '../src/harness/connectors/base';
import { PromptPayload, ModelCompletionResponse } from '../src/harness/types';

// 'child_process' se importa de forma dinámica DENTRO de la función, nunca
// como import estático de nivel superior: Rollup valida en tiempo de build
// los exports nombrados de un import estático, y el shim de navegador de
// Vite para módulos de Node no expone ninguno — eso rompía `npm run build`
// aunque este archivo completo ya se carga bajo demanda (ver adapters/index.ts).
// Con import() dinámico, Rollup no valida el export en build; el fallo (si
// ocurre) pasa a tiempo de ejecución y ya está cubierto por el try/catch.
async function execFileAsync(
  file: string,
  args: string[],
  options: { timeout: number; maxBuffer: number }
): Promise<{ stdout: string }> {
  const cp = await import('child_process');
  return new Promise((resolve, reject) => {
    cp.execFile(file, args, options, (err, stdout) => {
      if (err) reject(err);
      else resolve({ stdout: stdout.toString() });
    });
  });
}

/**
 * NOTA: este adaptador depende de Node.js (child_process) y del binario
 * `codex` instalado localmente — no aplica al despliegue web en Vercel.
 * Se carga de forma dinámica desde adapters/index.ts precisamente para no
 * romper el build del navegador; usarlo requiere una terminal local, no el
 * sitio desplegado.
 *
 * Adaptador para OpenAI Codex Cloud
 *
 * A diferencia de codexCliAdapter.ts (sesión local ambiental), este adaptador
 * delega la tarea a un contenedor aislado en la infraestructura de OpenAI —
 * no toca el sistema de archivos local ni requiere acceso de red saliente
 * propio del proceso, más allá de invocar el binario `codex` para el submit.
 *
 * Camino real usado: `codex cloud exec --env <environmentId> "<prompt>"`,
 * el subcomando scriptable documentado por OpenAI para despachar tareas a un
 * entorno de Codex Cloud ya configurado (repo + branch + dependencias).
 * La salida de Codex Cloud es siempre un diff/PR — nunca una edición directa
 * del working tree local, consistente con la regla de aprobación humana de
 * este repositorio (docs/governance.md).
 *
 * Requisito previo (fuera de este adaptador): crear el entorno una vez desde
 * la web (chatgpt.com/codex) o `codex cloud env create --repo <owner/repo>
 * --branch main`, y configurar `cloudEnvironmentId` en el ModelConfig.
 *
 * Si el binario `codex` no está disponible (ENOENT) o el entorno no está
 * configurado, cae a modo simulación — mismo comportamiento que los demás
 * conectores de este repo (ver openaiConnector.ts, claudeConnector.ts).
 *
 * Nota: `codex cloud exec` es superficie beta y puede cambiar de flags entre
 * versiones del CLI. Verificar `codex cloud exec --help` contra la versión
 * instalada antes de depender de este adaptador en producción.
 */
export class NativeCodexCloudAdapter extends BaseModelConnector {
  public async executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse> {
    const startTime = Date.now();
    const envId = this.config.cloudEnvironmentId;
    const binary = this.config.cliBinaryPath || 'codex';

    const prompt = this.buildPrompt(payload);

    if (envId) {
      try {
        const { stdout } = await execFileAsync(
          binary,
          ['cloud', 'exec', '--env', envId, prompt],
          { timeout: 10 * 60 * 1000, maxBuffer: 10 * 1024 * 1024 }
        );

        return {
          provider: 'native_codex_cloud',
          modelUsed: `Codex Cloud (env: ${envId})`,
          outputArtifacts: [`codex_cloud_${payload.stageId}.diff`],
          notes: `Tarea despachada a un contenedor aislado de Codex Cloud. El resultado es un PR/diff pendiente de revisión — no se aplicó ningún cambio directo al working tree local.`,
          rawTextResponse: stdout.trim() || 'Codex Cloud no devolvió texto en stdout; revisar el PR generado en GitHub.',
          timestamp: new Date().toISOString(),
          executionTimeMs: Date.now() - startTime,
        };
      } catch (err: any) {
        const reason = err?.code === 'ENOENT'
          ? 'binario codex no encontrado en PATH'
          : (err?.message || 'error desconocido al invocar codex cloud exec');
        console.warn(`Codex Cloud exec falló, cayendo a simulación: ${reason}`);
      }
    }

    // Modo simulación — sin entorno configurado o binario no disponible.
    return {
      provider: 'native_codex_cloud',
      modelUsed: 'Codex Cloud (simulado — sin cloudEnvironmentId configurado o CLI no disponible)',
      outputArtifacts: [`codex_cloud_artifact_${payload.stageId}.json`],
      notes: `[Codex Cloud Adapter — simulación] Rol '${payload.role}' habría ejecutado la etapa '${payload.stageId}' en un entorno de Codex Cloud. Configura 'cloudEnvironmentId' en el ModelConfig para invocación real.`,
      rawTextResponse: `[SIMULACIÓN CODEX CLOUD] Tarea del rol '${payload.role}' preparada para el entorno de Codex Cloud vinculado al repositorio.`,
      timestamp: new Date().toISOString(),
      executionTimeMs: Date.now() - startTime + 90,
    };
  }

  private buildPrompt(payload: PromptPayload): string {
    return [
      `ROL: ${payload.role}`,
      `ETAPA: ${payload.stageId}`,
      `INSTRUCCIÓN DE SISTEMA: ${payload.systemInstruction}`,
      `SOLICITUD ESPECÍFICA: ${payload.specificRequest}`,
      `EXPEDIENTE: ${payload.workItem.case.case_id} / revisión ${payload.workItem.case.revision_id}`,
      `ARTEFACTOS DE ENTRADA: ${payload.inputArtifacts.join(', ') || 'ninguno declarado'}`,
    ].join('\n');
  }
}
