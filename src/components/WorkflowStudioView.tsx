import React, { useState } from 'react';
import { WorkItem, StageState, HandoffRecord, RoleId, CorrectionType } from '../types';
import { Play, CheckCircle2, AlertTriangle, ArrowRight, UserCheck, RefreshCw, Lock, ShieldAlert, FileText, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';

interface WorkflowStudioViewProps {
  workItem: WorkItem;
  onUpdateWorkItem: (updated: WorkItem) => void;
}

const ROLE_LABELS: Record<RoleId, string> = {
  orchestrator: 'Orquestador (Orchestrator)',
  domain_specialist: 'Especialista de Dominio (P.A.T.)',
  normative_researcher: 'Investigador Normativo (IEEE/AEA)',
  technical_reviewer: 'Revisor Técnico (Technical Reviewer)',
  integrator: 'Integrador (Integrator)',
  visual_reviewer: 'Revisor Visual (Visual QA)',
  auditor: 'Auditor de Sistema (Auditor)',
};

export const WorkflowStudioView: React.FC<WorkflowStudioViewProps> = ({ workItem, onUpdateWorkItem }) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('technical_review');
  const [selectedCorrectionType, setSelectedCorrectionType] = useState<CorrectionType>('patch');
  const [correctionNote, setCorrectionNote] = useState<string>('');

  const currentStage = workItem.stages.find((s) => s.id === selectedStageId) || workItem.stages[0];

  // Advance pipeline by one stage
  const advancePipeline = () => {
    const stageIndex = workItem.stages.findIndex((s) => s.status === 'in_progress' || s.status === 'pending');
    if (stageIndex === -1) return;

    const updatedStages = workItem.stages.map((st, idx) => {
      if (idx === stageIndex) {
        return { ...st, status: 'passed' as const };
      }
      if (idx === stageIndex + 1) {
        return { ...st, status: 'in_progress' as const };
      }
      return st;
    });

    const isLastStagePassed = stageIndex === workItem.stages.length - 1;
    let newStatus = workItem.lifecycle.status;

    if (isLastStagePassed) {
      if (workItem.human_approval_received) {
        newStatus = 'ready_for_emission';
      } else {
        newStatus = 'under_review';
      }
    } else {
      newStatus = 'in_progress';
    }

    onUpdateWorkItem({
      ...workItem,
      stages: updatedStages,
      lifecycle: {
        ...workItem.lifecycle,
        status: newStatus,
        readiness: {
          ...workItem.lifecycle.readiness,
          emission_gate: isLastStagePassed && workItem.human_approval_received ? 'passed' : 'not_evaluated',
        }
      }
    });
  };

  // Trigger Review Correction Request (Loop 1/3, 2/3, 3/3 -> Blocked)
  const handleTriggerCorrection = () => {
    const currentCount = workItem.lifecycle.iteration_count;
    const newCount = currentCount + 1;

    if (newCount >= 3) {
      // CIRCUIT BREAKER TRIGGERED
      const updatedStages = workItem.stages.map((st) =>
        st.id === 'decision_audit' ? { ...st, status: 'failed' as const, notes: 'Presupuesto de correcciones agotado (3/3 ciclos). Sistema Bloqueado.' } : st
      );

      onUpdateWorkItem({
        ...workItem,
        stages: updatedStages,
        lifecycle: {
          ...workItem.lifecycle,
          status: 'blocked',
          iteration_count: 3,
          readiness: {
            ...workItem.lifecycle.readiness,
            emission_gate: 'failed',
            blocking_reasons: [
              'Presupuesto de correcciones agotado (3/3 ciclos sin entregable válido).',
              'Emitido reporte de bloqueo automático por el Auditor de Sistema.'
            ]
          }
        }
      });
      return;
    }

    // Normal correction loop -> Rollback to technical_analysis or evidence_control
    const updatedStages = workItem.stages.map((st) => {
      if (st.id === 'technical_review') return { ...st, status: 'in_progress' as const, notes: `Solicitado ${selectedCorrectionType}: ${correctionNote || 'Corrección técnica requerida.'}` };
      if (st.id === 'report_integration' || st.id === 'visual_evidence_qa') return { ...st, status: 'pending' as const };
      return st;
    });

    onUpdateWorkItem({
      ...workItem,
      stages: updatedStages,
      lifecycle: {
        ...workItem.lifecycle,
        status: 'under_review',
        iteration_count: newCount,
      },
      open_decisions: [
        ...workItem.open_decisions,
        `[Ciclo ${newCount}/3] ${selectedCorrectionType.toUpperCase()}: ${correctionNote || 'Se solicitó revisión técnica adicional.'}`
      ]
    });

    setCorrectionNote('');
  };

  // Toggle Human Approval
  const toggleHumanApproval = () => {
    const newApproval = !workItem.human_approval_received;
    const allStagesPassed = workItem.stages.every((s) => s.status === 'passed');

    let newStatus = workItem.lifecycle.status;
    let emissionGate = workItem.lifecycle.readiness.emission_gate;

    if (allStagesPassed && newApproval) {
      newStatus = 'ready_for_emission';
      emissionGate = 'passed';
    } else if (allStagesPassed && !newApproval) {
      newStatus = 'under_review';
      emissionGate = 'not_evaluated';
    }

    onUpdateWorkItem({
      ...workItem,
      human_approval_received: newApproval,
      lifecycle: {
        ...workItem.lifecycle,
        status: newStatus,
        readiness: {
          ...workItem.lifecycle.readiness,
          emission_gate: emissionGate
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Workflow Controller Banner */}
      <div className="bg-ink-900 border border-ink-700 rounded-xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Workflow: Informe de Verificación P.A.T.</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-signal-950 text-signal-400 border border-signal-800 font-mono">v0.1.0</span>
          </div>
          <p className="text-xs text-ink-300 mt-1">
            Orquestación de 9 etapas con compuertas de calidad, handoffs trazables y auditoría no negociable.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={advancePipeline}
            disabled={workItem.lifecycle.status === 'blocked' || workItem.stages.every(s => s.status === 'passed')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-signal-600 hover:bg-signal-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Avanzar Siguiente Etapa</span>
          </button>

          <button
            onClick={toggleHumanApproval}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              workItem.human_approval_received
                ? 'bg-pass-950/80 text-pass-300 border-pass-700 '
                : 'bg-ink-800 hover:bg-ink-700 text-ink-200 border-ink-600'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Aprobación Humana: {workItem.human_approval_received ? 'OTORGADA' : 'PENDIENTE'}</span>
          </button>
        </div>
      </div>

      {/* 9 Stages Interactive Pipeline Visualizer */}
      <div className="bg-ink-900 border border-ink-700 rounded-xl p-5 shadow-md space-y-4">
        <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider">Secuencia de Etapas del Workflow</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {workItem.stages.map((st, index) => {
            const isSelected = st.id === selectedStageId;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStageId(st.id)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                  isSelected
                    ? 'bg-signal-950/60 border-signal-500 text-white ring-1 ring-signal-500 shadow-lg'
                    : st.status === 'passed'
                    ? 'bg-pass-950/20 border-pass-800/60 text-ink-200 hover:bg-pass-950/40'
                    : st.status === 'in_progress'
                    ? 'bg-pending-950/30 border-pending-500/80 text-pending-300 animate-pulse'
                    : st.status === 'failed'
                    ? 'bg-fail-950/30 border-fail-800 text-fail-300'
                    : 'bg-ink-950/60 border-ink-700/80 text-ink-300 hover:bg-ink-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span>0{index + 1}</span>
                  {st.status === 'passed' && <CheckCircle2 className="w-3.5 h-3.5 text-pass-400" />}
                  {st.status === 'in_progress' && <RefreshCw className="w-3.5 h-3.5 text-pending-400 animate-spin" />}
                  {st.status === 'failed' && <ShieldAlert className="w-3.5 h-3.5 text-fail-400" />}
                </div>

                <div className="text-[11px] font-semibold leading-tight mt-1 line-clamp-2">
                  {st.name}
                </div>

                <div className="text-[9px] font-mono text-ink-300 truncate mt-1">
                  {ROLE_LABELS[st.owner].split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail & Handoff Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stage Inspection Details */}
        <div className="lg:col-span-2 bg-ink-900 border border-ink-700 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-ink-700 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-ink-800 text-signal-400">
                Rol Propietario: {ROLE_LABELS[currentStage.owner]}
              </span>
              <h3 className="text-base font-bold text-white mt-1">{currentStage.name}</h3>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
              currentStage.status === 'passed' ? 'bg-pass-950 text-pass-400 border border-pass-800' :
              currentStage.status === 'in_progress' ? 'bg-pending-950 text-pending-300 border border-pending-800' :
              currentStage.status === 'failed' ? 'bg-fail-950 text-fail-400 border border-fail-800' :
              'bg-ink-800 text-ink-300'
            }`}>
              {currentStage.status}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-ink-300 uppercase">Skill Aplicable:</h4>
              <p className="text-xs font-mono text-signal-300 mt-0.5">{currentStage.skill || 'Análisis Nativo de Rol'}</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-ink-300 uppercase">Artefactos Producidos:</h4>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {currentStage.outputsProduced.length > 0 ? (
                  currentStage.outputsProduced.map((out, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-ink-950 border border-ink-700 text-ink-100">
                      {out}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-ink-400 italic">Ningún artefacto emitido aún en esta etapa.</span>
                )}
              </div>
            </div>

            <div className="bg-ink-950 p-3 rounded-lg border border-ink-700 space-y-1">
              <h4 className="text-xs font-semibold text-ink-200">Notas de Registro / Log de Ejecución:</h4>
              <p className="text-xs text-ink-200 font-sans italic">{currentStage.notes || 'Etapa en espera.'}</p>
            </div>
          </div>

          {/* Handoff Records for this stage */}
          <div className="border-t border-ink-700 pt-4 space-y-3">
            <h4 className="text-xs font-bold text-ink-200 uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-signal-400" />
              Handoff de Entrada / Salida entre Agentes
            </h4>

            {workItem.handoffs.length > 0 ? (
              workItem.handoffs.map((ho) => (
                <div key={ho.id} className="bg-ink-950 p-3.5 rounded-lg border border-ink-700/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-signal-400 font-semibold">{ho.id}</span>
                    <span className="text-[11px] text-ink-400">{new Date(ho.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-ink-200 font-medium">
                    <span className="px-2 py-0.5 rounded bg-ink-900 border border-ink-700">{ROLE_LABELS[ho.fromRole]}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-ink-400" />
                    <span className="px-2 py-0.5 rounded bg-ink-900 border border-ink-700">{ROLE_LABELS[ho.toRole]}</span>
                  </div>

                  <div className="text-ink-200">
                    <strong className="text-ink-300">Solicitud Concreta:</strong> {ho.specificRequest}
                  </div>

                  {ho.limitations.length > 0 && (
                    <div className="text-pending-400/90 text-[11px]">
                      <strong>Limitaciones declaradas:</strong> {ho.limitations.join(', ')}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-ink-400 italic">No hay registros de handoffs previos.</p>
            )}
          </div>
        </div>

        {/* Correction Loop Simulator & Budget Safeguard */}
        <div className="bg-ink-900 border border-ink-700 rounded-xl p-5 shadow-md space-y-4">
          <div>
            <h3 className="text-sm font-bold text-pending-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Simulador de Bucle de Corrección
            </h3>
            <p className="text-xs text-ink-300 mt-0.5">
              Solicitudes de corrección por Revisor Técnico o Visual. Límite máximo: 3 ciclos.
            </p>
          </div>

          <div className="bg-ink-950 p-3.5 rounded-lg border border-ink-700 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-ink-300">Presupuesto de Ciclos:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${
                workItem.lifecycle.iteration_count >= 3 ? 'bg-fail-950 text-fail-400 border border-fail-800' : 'bg-ink-900 text-pending-400'
              }`}>
                {workItem.lifecycle.iteration_count} / 3 consumidos
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink-200 block">Tipo de Corrección Requerido:</label>
              <select
                value={selectedCorrectionType}
                onChange={(e) => setSelectedCorrectionType(e.target.value as CorrectionType)}
                className="w-full bg-ink-900 border border-ink-700 rounded p-2 text-xs text-white focus:outline-none focus:border-signal-500"
              >
                <option value="patch">patch - Corrección local y aislada</option>
                <option value="partial_rework">partial_rework - Rehacer sección y dependencias directas</option>
                <option value="full_rework">full_rework - Invalidez de premisa base (rehacer enfoque)</option>
                <option value="user_clarification">user_clarification - Falta información crítica</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink-200 block">Motivo / Detalle de la Corrección:</label>
              <textarea
                value={correctionNote}
                onChange={(e) => setCorrectionNote(e.target.value)}
                placeholder="Describa el motivo por el cual el revisor solicita corrección..."
                className="w-full bg-ink-900 border border-ink-700 rounded p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-signal-500 h-20 resize-none"
              />
            </div>

            <button
              onClick={handleTriggerCorrection}
              disabled={workItem.lifecycle.status === 'blocked'}
              className="w-full py-2 px-3 rounded-lg bg-pending-600 hover:bg-pending-500 disabled:opacity-50 text-ink-950 font-bold text-xs transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Solicitar Corrección (Consumir Ciclo)</span>
            </button>
          </div>

          {/* Circuit Breaker Warning */}
          {workItem.lifecycle.iteration_count >= 3 && (
            <div className="bg-fail-950/40 border border-fail-800 p-3.5 rounded-lg text-xs space-y-1 text-fail-200">
              <div className="flex items-center gap-1.5 font-bold text-fail-400">
                <Lock className="w-4 h-4" />
                <span>CIRCUIT BREAKER ACTIVADO</span>
              </div>
              <p>
                Se han agotado los 3 ciclos de corrección permitidos. El expediente queda bloqueado automáticamente con estado <strong className="font-mono">NO EMITIR / BLOCKED</strong> según la norma no negociable.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
