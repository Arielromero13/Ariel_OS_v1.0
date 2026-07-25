import React from 'react';
import { WorkItem, NormativeCriterion } from '../types';
import { BookOpen, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Check, Plus, ExternalLink } from 'lucide-react';

interface NormativeRegistryViewProps {
  workItem: WorkItem;
  onUpdateWorkItem: (updated: WorkItem) => void;
}

export const NormativeRegistryView: React.FC<NormativeRegistryViewProps> = ({ workItem, onUpdateWorkItem }) => {
  const maxMeasuredResistance = Math.max(...workItem.measurements.map((m) => m.measured_resistance_ohm), 0);

  const toggleApplicability = (id: string) => {
    const updatedCrit = workItem.normative_criteria.map((c) => {
      if (c.id !== id) return c;
      const nextApp = c.applicability === 'verified' ? 'unverified' : 'verified';
      return { ...c, applicability: nextApp as any };
    });
    onUpdateWorkItem({ ...workItem, normative_criteria: updatedCrit });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Registro de Criterios & Normativa Técnica
            <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
              Skill: research-normative-criterion
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Validación de fuentes, ediciones, cláusulas y aplicabilidad técnica (IEEE 80, IEEE 81, AEA 90364, NFPA 70).
          </p>
        </div>

        <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
          <span className="text-slate-400">Máxima Resistencia Medida:</span>
          <span className={`font-mono font-bold text-sm ${maxMeasuredResistance > 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {maxMeasuredResistance} Ω
          </span>
        </div>
      </div>

      {/* Normative Rules List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rules Cards */}
        <div className="lg:col-span-2 space-y-4">
          {workItem.normative_criteria.map((crit) => {
            const isCompliant = !crit.max_resistance_threshold_ohm || maxMeasuredResistance <= crit.max_resistance_threshold_ohm;
            return (
              <div key={crit.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{crit.standard_name}</h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Edición {crit.edition}
                      </span>
                    </div>
                    <span className="text-xs text-sky-400 font-mono font-medium">{crit.clause}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleApplicability(crit.id)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                        crit.applicability === 'verified'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {crit.applicability === 'verified' ? 'Aplicabilidad Verificada' : 'Por Verificar'}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <strong className="text-slate-400 block mb-1">Resumen del Requisito Técnico:</strong>
                  {crit.requirement_summary}
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 gap-2">
                  <div>
                    <span>Umbral Máximo de Resistencia: </span>
                    <strong className="font-mono text-sky-300">
                      {crit.max_resistance_threshold_ohm ? `${crit.max_resistance_threshold_ohm} Ω` : 'N/A'}
                    </strong>
                  </div>

                  <div className="text-slate-400 italic">
                    Notas: {crit.verification_notes}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Normative Compliance Summary & Rule Policy */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Política de Atribución Normativa
            </h3>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              <p>
                <strong className="text-amber-400">Regla No Negociable:</strong> No atribuir ningún límite de resistencia a IEEE, AEA, IEC o NFPA sin documento, edición, cláusula y aplicabilidad verificables.
              </p>
              <p>
                Los informes históricos sirven de contexto, pero no constituyen evidencia técnica para la revisión actual.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Fuentes Bibliográficas del Expediente
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 font-mono">
              <li className="bg-slate-950 p-2 rounded border border-slate-800">
                • IEEE Std 80-2013: IEEE Guide for Safety in AC Substation Grounding.
              </li>
              <li className="bg-slate-950 p-2 rounded border border-slate-800">
                • IEEE Std 81-2012: IEEE Guide for Measuring Earth Resistivity and Ground Impedance.
              </li>
              <li className="bg-slate-950 p-2 rounded border border-slate-800">
                • Reglamentación AEA 90364-7-710 (2015): Instalaciones en Inmuebles.
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
