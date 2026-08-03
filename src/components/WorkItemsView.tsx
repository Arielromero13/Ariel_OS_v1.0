import React from 'react';
import { WorkItem, DefinitionOfDoneItem, InputManifestItem } from '../types';
import { CheckSquare, Square, FileText, AlertCircle, Plus, ShieldAlert, ArrowRight, BookOpen, Clock, MapPin } from 'lucide-react';

interface WorkItemsViewProps {
  workItem: WorkItem;
  onUpdateWorkItem: (updated: WorkItem) => void;
}

export const WorkItemsView: React.FC<WorkItemsViewProps> = ({ workItem, onUpdateWorkItem }) => {
  const toggleDod = (id: string) => {
    const updatedDod = workItem.definition_of_done.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateWorkItem({ ...workItem, definition_of_done: updatedDod });
  };

  return (
    <div className="space-y-6">
      
      {/* Case Header Banner */}
      <div className="bg-ink-900 border border-ink-700 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-700 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-signal-950 text-signal-400 border border-signal-800">
                {workItem.case.case_id}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-ink-800 text-ink-200">
                Revisión {workItem.case.revision_id}
              </span>
              {workItem.case.based_on_revision && (
                <span className="text-xs text-ink-300">
                  (Basado en {workItem.case.based_on_revision})
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-white">{workItem.case.plant_name}</h2>
            <p className="text-xs text-ink-300 flex items-center gap-1 mt-0.5">
              <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />Ubicación:</span> {workItem.case.location}
            </p>
          </div>

          <div className="bg-ink-950 p-3 rounded-lg border border-ink-700 text-xs space-y-1 min-w-[240px]">
            <div className="text-ink-300 font-medium">Motivo de Revisión:</div>
            <div className="text-ink-100 font-sans italic">{workItem.case.revision_reason}</div>
          </div>
        </div>

        {/* Objective & Requester */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1">
            <h3 className="text-xs font-semibold text-ink-300 uppercase tracking-wider">Objetivo del Solicitante</h3>
            <p className="text-sm text-ink-100">{workItem.request.objective}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-ink-300 uppercase tracking-wider">Solicitante / Contexto</h3>
            <p className="text-xs text-ink-200 font-medium">{workItem.request.requester}</p>
            <p className="text-xs text-ink-300">{workItem.request.context}</p>
          </div>
        </div>
      </div>

      {/* Scope Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scope IN */}
        <div className="bg-ink-900 border border-ink-700 rounded-xl p-5 shadow-md">
          <h3 className="text-sm font-semibold text-pass-400 flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-pass-500"></span>
            Alcance Incluido (Scope IN)
          </h3>
          <ul className="space-y-2 text-xs text-ink-200">
            {workItem.request.scope_in.map((item, i) => (
              <li key={i} className="flex items-start gap-2 bg-ink-950/60 p-2 rounded border border-ink-700/80">
                <span className="text-pass-400 font-semibold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scope OUT */}
        <div className="bg-ink-900 border border-ink-700 rounded-xl p-5 shadow-md">
          <h3 className="text-sm font-semibold text-pending-400 flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-pending-500"></span>
            Alcance Excluido (Scope OUT)
          </h3>
          <ul className="space-y-2 text-xs text-ink-300">
            {workItem.request.scope_out.map((item, i) => (
              <li key={i} className="flex items-start gap-2 bg-ink-950/60 p-2 rounded border border-ink-700/80">
                <span className="text-pending-500 font-semibold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Definition of Done & Input Manifest */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Definition of Done Checklist */}
        <div className="bg-ink-900 border border-ink-700 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-ink-700 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-signal-400" />
                Definition of Done (DoD Criterios Cierre)
              </h3>
              <p className="text-xs text-ink-300">Requisitos obligatorios antes de la emisión final</p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-signal-950 text-signal-400 border border-signal-800">
              {workItem.definition_of_done.filter(d => d.completed).length} / {workItem.definition_of_done.length}
            </span>
          </div>

          <div className="space-y-2">
            {workItem.definition_of_done.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleDod(item.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                  item.completed
                    ? 'bg-pass-950/20 border-pass-800/50 text-ink-100'
                    : 'bg-ink-950/60 border-ink-700 hover:border-ink-600 text-ink-200'
                }`}
              >
                <div className="mt-0.5">
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-pass-400" />
                  ) : (
                    <Square className="w-4 h-4 text-ink-400" />
                  )}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="text-xs font-medium flex items-center justify-between">
                    <span>{item.criterion}</span>
                    {item.mandatory && (
                      <span className="text-[10px] font-mono uppercase font-semibold text-fail-400 px-1.5 py-0.2 rounded bg-fail-950 border border-fail-800 ml-2">
                        Obligatorio
                      </span>
                    )}
                  </div>
                  {item.verification_method && (
                    <div className="text-[11px] text-ink-300 italic">
                      Verificación: {item.verification_method}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Manifest (Inventario de Archivos) */}
        <div className="bg-ink-900 border border-ink-700 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-ink-700 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-signal-400" />
                Input Manifest (Inventario de Fuentes)
              </h3>
              <p className="text-xs text-ink-300">Archivos y evidencias asociadas al expediente</p>
            </div>
            <span className="text-xs font-mono text-ink-300">
              {workItem.input_manifest.length} artefactos
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {workItem.input_manifest.map((art) => (
              <div key={art.artifact_id} className="bg-ink-950 p-3 rounded-lg border border-ink-700 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink-100 font-mono">{art.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                    art.status === 'available' ? 'bg-pass-950 text-pass-400 border border-pass-800' : 'bg-fail-950 text-fail-400 border border-fail-800'
                  }`}>
                    {art.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-300">
                  <span>Rol: <strong className="text-signal-300 font-normal">{art.role}</strong></span>
                  <span className="font-mono text-ink-400">{art.artifact_id}</span>
                </div>
                {art.authority_note && (
                  <p className="text-[11px] text-ink-300 italic border-t border-ink-700/80 pt-1 mt-1">
                    {art.authority_note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Open Decisions & Blocking Reasons */}
      <div className="bg-ink-900 border border-ink-700 rounded-xl p-5 shadow-md space-y-3">
        <h3 className="text-sm font-semibold text-pending-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Decisiones Abiertas & Razones de Bloqueo para Emisión
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-ink-950 p-3.5 rounded-lg border border-ink-700 space-y-2">
            <h4 className="text-xs font-semibold text-ink-200">Decisiones Pendientes de Aclaración:</h4>
            <ul className="space-y-1.5 text-xs text-ink-300">
              {workItem.open_decisions.map((dec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-pending-400 font-semibold">•</span>
                  <span>{dec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-ink-950 p-3.5 rounded-lg border border-ink-700 space-y-2">
            <h4 className="text-xs font-semibold text-ink-200">Bloqueos Registrados (Gate de Emisión):</h4>
            <ul className="space-y-1.5 text-xs text-fail-300/90">
              {workItem.lifecycle.readiness.blocking_reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-fail-400 font-semibold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};
