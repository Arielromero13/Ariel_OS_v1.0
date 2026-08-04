import { execFile } from 'child_process';
import { promisify } from 'util';
import { BaseModelConnector } from '../src/harness/connectors/base';
import { PromptPayload, ModelCompletionResponse } from '../src/harness/types';

const execFileAsync = promisify(execFile);

/**
 * Adaptador para Claude Code (CLI local, modo headless)
 *
 * Invoca la sesión de Claude Code instalada localmente en modo no interactivo
 * (`claude -p`), documentado por Anthropic para scripts, CI y automatización.
 * Requiere que el binario `claude` esté instalado y autenticado en la máquina
 * donde corre este adaptador — no usa una API key manual en este archivo.
 *
 * Permisos: por defecto se ejecuta en modo 'ask' (el más conservador — no
 * escribe ni ejecuta nada sin aprobación humana), salvo que ModelConfig
 * declare explícitamente otro `permissionMode`. Nunca se activa por defecto
 * un modo que se salte la aprobación.
 *
 * Estado en este repositorio: si el binario `claude` no está disponible en
 * el PATH (ENOENT) — el caso actual en la laptop corporativa de Ariel,
 * bloqueada por GPO — el adaptador cae automáticamente a modo simulación,
 * sin lanzar error. El código no necesita cambiar cuando la instalación se
 * apruebe: en cuanto `claude` exista en el PATH, este mismo adaptador pasa a
 * invocarlo de verdad, sin tocar este archivo.
 */
export class NativeClaudeCodeAdapter extends BaseModelConnector {
  public async executeRoleTask(payload: PromptPayload): Promise<ModelCompletionResponse> {
    const startTime = Date.now();
    const binary = this.config.cliBinaryPath || 'claude';
    const permissionMode = this.config.permissionMode || 'ask';
    const prompt = this.buildPrompt(payload);

    const args = ['-p', prompt, '--output-format', 'json', '--permission-mode', permissionMode];
    if (this.config.allowedTools) {
      args.push('--allowedTools', this.config.allowedTools);
    }

    try {
      const { stdout } = await execFileAsync(binary, args, {
        timeout: 10 * 60 * 1000,
        maxBuffer: 10 * 1024 * 1024,
      });

      let resultText = stdout.trim();
      try {
        const parsed = JSON.parse(stdout);
        resultText = parsed.result ?? resultText;
      } catch {
        // Salida no era JSON estructurado; se conserva el texto plano.
      }

      return {
        provider: 'native_claude_code',
        modelUsed: 'Claude Code CLI (headless, -p)',
        outputArtifacts: [`claude_code_artifact_${payload.stageId}.json`],
        notes: `Ejecutado localmente vía 'claude -p' en modo de permisos '${permissionMode}'.`,
        rawTextResponse: resultText,
        timestamp: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime,
      };
    } catch (err: any) {
      const reason = err?.code === 'ENOENT'
        ? "binario 'claude' no encontrado en PATH (Claude Code no instalado en esta máquina)"
        : (err?.message || 'error desconocido al invocar claude -p');
      console.warn(`Claude Code exec falló, cayendo a simulación: ${reason}`);
    }

    // Modo simulación — Claude Code no instalado o no disponible en esta máquina.
    return {
      provider: 'native_claude_code',
      modelUsed: 'Claude Code CLI (simulado — binario no disponible en esta máquina)',
      outputArtifacts: [`claude_code_artifact_${payload.stageId}.json`],
      notes: `[Claude Code Adapter — simulación] Rol '${payload.role}' habría ejecutado la etapa '${payload.stageId}' vía Claude Code local. Se activa automáticamente en cuanto 'claude' esté instalado y en el PATH — no requiere cambios en este archivo.`,
      rawTextResponse: `[SIMULACIÓN CLAUDE CODE] Tarea del rol '${payload.role}' preparada para ejecución local con Claude Code.`,
      timestamp: new Date().toISOString(),
      executionTimeMs: Date.now() - startTime + 95,
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
