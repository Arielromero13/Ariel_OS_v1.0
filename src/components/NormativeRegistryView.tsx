import React from 'react';
import { WorkItem } from '../types';
import { BookOpen, AlertTriangle, ShieldCheck } from 'lucide-react';

interface NormativeRegistryViewProps {
  workItem: WorkItem;
  onUpdateWorkItem: (updated: WorkItem) => void;
}

export const NormativeRegistryView: React.FC<NormativeRegistryViewProps> = ({ workItem }) => {
  const pending = workItem.normative_criteria.filter((criterion) => criterion.applicability !== 'verified').length;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">Registro de Criterios & Normativa Técnica</h2>
          <p className="text-xs text-slate-400 mt-1">Las fuentes se registran, pero solo el investigador normativo puede verificarlas mediante evidencia trazable.</p>
        </div>
        <div className="bg-amber-950/40 border border-amber-800 px-3 py-2 rounded-lg text-xs text-amber-200">{pending} criterio(s) pendiente(s) de verificación</div>
      </div>

      <div className="flex gap-3 p-4 rounded-xl border border-amber-700/70 bg-amber-950/30 text-amber-100 text-xs">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
        <p>Un valor medido no se compara con un umbral genérico. Para asignar Conforme o No conforme se requiere fuente, edición, cláusula y aplicabilidad verificables para el caso.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {workItem.normative_criteria.map((criterion) => (
            <div key={criterion.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{criterion.standard_name}</h3>
                  <span className="text-xs text-sky-400 font-mono">Edición: {criterion.edition} · Cláusula: {criterion.clause}</span>
                </div>
                <span className={criterion.applicability === 'verified' ? 'px-2.5 py-1 rounded text-xs font-mono font-bold border bg-emerald-950 text-emerald-300 border-emerald-800' : 'px-2.5 py-1 rounded text-xs font-mono font-bold border bg-amber-950 text-amber-300 border-amber-800'}>
                  {criterion.applicability === 'verified' ? 'Verificada' : 'Pendiente de verificación'}
                </span>
              </div>
              <div className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">{criterion.requirement_summary}</div>
              <div className="text-xs text-slate-400">Notas: {criterion.verification_notes}</div>
            </div>
          ))}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" />Política de atribución</h3>
          <p className="text-xs text-slate-300 leading-relaxed">La interfaz es de lectura y control. La verificación no se cambia con un botón: debe provenir de un registro normativo estructurado y revisado.</p>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pt-3"><BookOpen className="w-4 h-4 text-indigo-400" />Fuentes del expediente</h3>
          <p className="text-xs text-slate-400">Las fuentes disponibles se leen desde el manifest del caso; su disponibilidad no equivale a aplicabilidad confirmada.</p>
        </div>
      </div>
    </div>
  );
};

export default NormativeRegistryView;
