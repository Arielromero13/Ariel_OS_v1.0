import { WorkItem, RoleId, HandoffRecord, GateStatus } from '../../types';
import { ModelConfig, HarnessExecutionResult } from '../types';
import { createModelConnector } from '../../../adapters';

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
    const connector = createModelConnector(this.config);

    // Check circuit breaker first
    if (workItem.lifecycle.iteration_count >= 3) {
      return {
        success: false,
        stageId: 'circuit_breaker',
        roleId: 'auditor',
        updatedWorkItem: {
          ...workItem,
          lifecycle: {
            ...workItem.lifecycle,
            status: 'blocked',
            readiness: {
              ...workItem.lifecycle.readiness,
              emission_gate: 'failed',
              blocking_reasons: [
                'Presupuesto de correcciones agotado (3/3 ciclos sin entregable válido).',
                'Emitido reporte de bloqueo automático por el Auditor de Sistema.',
              ],
            },
          },
        },
        modelResponse: {
          provider: this.config.provider,
          modelUsed: this.config.modelName,
          outputArtifacts: ['blocking_report.json'],
          notes: 'Circuito bloqueado por el Arnés del Sistema (3 ciclos consumidos).',
          rawTextResponse: 'CIRCUT BREAKER: Límite de 3 ciclos consumido sin aprobación técnica.',
          timestamp: new Date().toISOString(),
          executionTimeMs: 10,
        },
        blockingReasons: ['Presupuesto de 3 ciclos agotado.'],
      };
    }

    // Find current active stage or next pending stage
    const currentStageIndex = workItem.stages.findIndex((s) => s.status === 'in_progress' || s.status === 'pending');
    const targetStageIndex = currentStageIndex === -1 ? workItem.stages.length - 1 : currentStageIndex;
    const stageToExecute = workItem.stages[targetStageIndex];

    // Prepare prompt payload for connector
    const promptPayload = {
      role: stageToExecute.owner,
      stageId: stageToExecute.id,
      systemInstruction: `Eres el agente '${stageToExecute.owner}' de Ariel Agent OS. Debes cumplir estrictamente las reglas no negociables de AGENTS.md y los contratos del expediente.`,
      workItem: workItem,
      inputArtifacts: stageToExecute.outputsProduced,
      specificRequest: `Procesar etapa ${stageToExecute.name} para la planta ${workItem.case.plant_name}.`,
    };

    // Execute via chosen connector
    const modelResponse = await connector.executeRoleTask(promptPayload);

    // Update stages
    const nextStageIndex = targetStageIndex + 1;
    const updatedStages = workItem.stages.map((st, idx) => {
      if (idx === targetStageIndex) {
        return {
          ...st,
          status: 'passed' as const,
          notes: modelResponse.notes,
          outputsProduced: [...st.outputsProduced, ...modelResponse.outputArtifacts],
        };
      }
      if (idx === nextStageIndex) {
        return {
          ...st,
          status: 'in_progress' as const,
        };
      }
      return st;
    });

    // Record handoff if transitioning between roles
    let newHandoff: HandoffRecord | undefined;
    if (nextStageIndex < workItem.stages.length) {
      const nextStage = workItem.stages[nextStageIndex];
      newHandoff = {
        id: `HO-AUTO-0${workItem.handoffs.length + 1}`,
        fromRole: stageToExecute.owner,
        toRole: nextStage.owner,
        stageId: nextStage.id,
        timestamp: new Date().toISOString(),
        artifactsLinked: modelResponse.outputArtifacts,
        limitations: workItem.request.scope_out,
        openDecisions: workItem.open_decisions,
        specificRequest: `Handoff automatizado por el Arnés (${this.config.provider}): Continuar con la etapa '${nextStage.name}'.`,
      };
    }

    const allPassed = updatedStages.every((s) => s.status === 'passed');

    // Evaluate Gates
    let emissionGateStatus: GateStatus = 'not_evaluated';
    const blockingReasons: string[] = [];

    if (!workItem.human_approval_received) {
      blockingReasons.push('Falta aprobación humana explícita registrada.');
    }

    const hasCriticalNonCompliance = workItem.findings.some((f) => f.severity === 'critical');
    if (hasCriticalNonCompliance) {
      blockingReasons.push('Existen no conformidades críticas no resueltas (NO EMITIR).');
    }

    if (allPassed && workItem.human_approval_received && !hasCriticalNonCompliance) {
      emissionGateStatus = 'passed';
    } else if (allPassed) {
      emissionGateStatus = 'failed';
    }

    const updatedStatus = emissionGateStatus === 'passed' ? 'ready_for_emission' : 'under_review';

    const updatedWorkItem: WorkItem = {
      ...workItem,
      stages: updatedStages,
      handoffs: newHandoff ? [...workItem.handoffs, newHandoff] : workItem.handoffs,
      lifecycle: {
        ...workItem.lifecycle,
        status: updatedStatus,
        readiness: {
          execution_gate: 'passed',
          emission_gate: emissionGateStatus,
          blocking_reasons: blockingReasons,
        },
      },
    };

    return {
      success: true,
      stageId: stageToExecute.id,
      roleId: stageToExecute.owner,
      updatedWorkItem,
      handoffRecord: newHandoff,
      modelResponse,
      blockingReasons,
    };
  }
}
