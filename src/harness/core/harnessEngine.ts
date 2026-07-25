import { WorkItem, RoleId } from '../../types';
import { ModelConfig, HarnessExecutionResult, ModelCompletionResponse } from '../types';
import { createModelConnector } from '../../../adapters';

function blockedResult(
  workItem: WorkItem,
  config: ModelConfig,
  stageId: string,
  roleId: RoleId,
  reason: string,
  response?: ModelCompletionResponse,
): HarnessExecutionResult {
  const modelResponse = response ?? {
    provider: config.provider,
    modelUsed: config.modelName,
    outputArtifacts: [],
    notes: reason,
    rawTextResponse: reason,
    timestamp: new Date().toISOString(),
    executionTimeMs: 0,
    isSimulated: config.executionMode === 'browser_simulation',
  };

  return {
    success: false,
    stageId,
    roleId,
    updatedWorkItem: workItem,
    modelResponse,
    blockingReasons: [reason],
  };
}

export class ArielHarnessEngine {
  private config: ModelConfig;

  constructor(config: ModelConfig) {
    this.config = config;
  }

  public setModelConfig(config: ModelConfig) {
    this.config = config;
  }

  public getModelConfig(): ModelConfig {
    return this.config;
  }

  public async executeNextStage(workItem: WorkItem): Promise<HarnessExecutionResult> {
    const stage = workItem.stages.find((item) => item.status === 'in_progress' || item.status === 'pending');

    if (!stage) {
      return blockedResult(workItem, this.config, 'no_pending_stage', 'auditor', 'No existe una etapa pendiente para ejecutar.');
    }

    if (workItem.lifecycle.iteration_count >= 3) {
      return blockedResult(
        workItem,
        this.config,
        stage.id,
        stage.owner,
        'Presupuesto de correcciones agotado. Solo un auditor y una decisión humana pueden cerrar el bloqueo.',
      );
    }

    if (this.config.executionMode !== 'server_worker') {
      return blockedResult(
        workItem,
        this.config,
        stage.id,
        stage.owner,
        'Modo simulación de navegador: no se ejecutan modelos, CLIs ni transiciones de compuerta. Use un worker autorizado.',
      );
    }

    const connector = createModelConnector(this.config);
    const response = await connector.executeRoleTask({
      role: stage.owner,
      stageId: stage.id,
      systemInstruction: 'Cumple AGENTS.md, el workflow aplicable y los contratos. Devuelve únicamente registros estructurados verificables; no apruebes tu propio trabajo.',
      workItem,
      inputArtifacts: workItem.input_manifest.map((artifact) => artifact.artifact_id),
      specificRequest: 'Procesa solo la etapa asignada y declara evidencia, limitaciones y decisiones abiertas.',
    });

    if (response.isSimulated) {
      return blockedResult(
        workItem,
        this.config,
        stage.id,
        stage.owner,
        'El adaptador respondió en simulación. Una simulación nunca puede cambiar estados ni generar handoffs válidos.',
        response,
      );
    }

    if (!response.structuredOutput || response.structuredOutput.validationStatus !== 'valid') {
      return blockedResult(
        workItem,
        this.config,
        stage.id,
        stage.owner,
        'La respuesta no produjo un registro estructurado validado contra el contrato requerido.',
        response,
      );
    }

    return blockedResult(
      workItem,
      this.config,
      stage.id,
      stage.owner,
      'El backend todavía debe implementar persistencia inmutable y reglas de compuerta antes de permitir transiciones de etapa.',
      response,
    );
  }
}
