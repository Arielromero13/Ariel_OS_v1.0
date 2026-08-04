import React, { useState } from 'react';
import { AGENTS_CATALOG, SKILLS_CATALOG } from '../data/mockData';
import { Users, Cpu, FileCode, BookOpen, ShieldCheck, Check, Code } from 'lucide-react';

export const SystemRegistryView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'agents' | 'skills' | 'contracts' | 'rules'>('agents');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-ink-900 border border-ink-700 rounded-lg p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            Arquitectura & Catálogo de Registro (Ariel Agent OS)
          </h2>
          <p className="text-xs text-ink-300 mt-1">
            Inspección de roles, skills, esquemas de contratos y políticas de gobernanza.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 bg-ink-950 p-1 rounded-lg border border-ink-700">
          {[
            { id: 'agents', label: 'Roles de Agente', icon: Users },
            { id: 'skills', label: 'Skills', icon: Cpu },
            { id: 'contracts', label: 'Contratos JSON', icon: FileCode },
            { id: 'rules', label: 'Reglas AGENTS.md', icon: ShieldCheck },
          ].map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-signal-600 text-white shadow'
                    : 'text-ink-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AGENTS SECTION */}
      {activeSection === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENTS_CATALOG.map((ag) => (
            <div key={ag.id} className="bg-ink-900 border border-ink-700 rounded-lg p-5 shadow-md space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">{ag.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-signal-950 text-signal-400 border border-signal-800">
                    {ag.badge}
                  </span>
                </div>

                <p className="text-xs text-ink-200 mb-3 leading-relaxed">
                  {ag.mission}
                </p>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-ink-300 font-semibold block text-[11px]">Activación:</span>
                    <span className="text-ink-200 font-mono text-[11px]">{ag.activates}</span>
                  </div>

                  <div>
                    <span className="text-ink-300 font-semibold block text-[11px]">Artefactos Salida:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {ag.outputs.map((out, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-ink-950 border border-ink-700 text-signal-300">
                          {out}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-ink-700 pt-3 text-[11px] text-ink-300 space-y-1">
                <div><strong>Decisiones Autorizadas:</strong> {ag.mayDecide.join(', ')}</div>
                <div className="text-fail-400/90"><strong>Escalar Si:</strong> {ag.mustEscalate.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SKILLS SECTION */}
      {activeSection === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILLS_CATALOG.map((sk) => (
            <div key={sk.id} className="bg-ink-900 border border-ink-700 rounded-lg p-5 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-ink-700 pb-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-signal-400" />
                  {sk.name}
                </h3>
                <span className="text-xs font-mono text-ink-300 px-2 py-0.5 rounded bg-ink-950 border border-ink-700">
                  {sk.domain}
                </span>
              </div>

              <p className="text-xs text-ink-200 leading-relaxed">
                {sk.description}
              </p>

              <div className="text-[11px] font-mono text-ink-400 bg-ink-950 p-2 rounded border border-ink-700">
                Ubicación SKILL.md: {sk.path}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTRACTS SECTION */}
      {activeSection === 'contracts' && (
        <div className="bg-ink-900 border border-ink-700 rounded-lg p-5 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-signal-400" />
            Contratos de Dominio (JSON Schemas)
          </h3>
          <p className="text-xs text-ink-300">
            Estructuras obligatorias para intercambio de datos entre roles de Ariel Agent OS.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
            {[
              { name: 'work-item.schema.json', desc: 'Contrato del expediente de trabajo y ciclo de vida.' },
              { name: 'evidence.schema.json', desc: 'Contrato de fotos, mediciones y archivos de campo.' },
              { name: 'finding.schema.json', desc: 'Hallazgos técnicos y no conformidades.' },
              { name: 'review.schema.json', desc: 'Registros de revisión técnica y visual QA.' },
              { name: 'audit-decision.schema.json', desc: 'Decisión de auditoría final para emisión.' },
              { name: 'handoff.schema.json', desc: 'Pasaje de contexto y solicitudes entre agentes.' },
            ].map((cnt, i) => (
              <div key={i} className="bg-ink-950 p-3 rounded-lg border border-ink-700 space-y-1">
                <div className="font-semibold text-signal-400">{cnt.name}</div>
                <div className="text-[11px] text-ink-300 font-sans">{cnt.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RULES SECTION */}
      {activeSection === 'rules' && (
        <div className="bg-ink-900 border border-ink-700 rounded-lg p-5 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-pass-400" />
            Reglas No Negociables de AGENTS.md
          </h3>

          <div className="space-y-3 text-xs text-ink-200 leading-relaxed">
            <div className="bg-ink-950 p-3 rounded-lg border border-ink-700 space-y-1">
              <strong className="text-pending-400 block font-sans font-semibold">1. Sin Invención de Valores o Criterios:</strong>
              <p>No inventar valores, fechas, evidencia, criterios, configuraciones, fuentes normativas ni conclusiones.</p>
            </div>

            <div className="bg-ink-950 p-3 rounded-lg border border-ink-700 space-y-1">
              <strong className="text-pending-400 block font-sans font-semibold">2. Trazabilidad Estricta:</strong>
              <p>Conservar la trazabilidad desde la evidencia hasta el finding, criterio, recomendación y entregable.</p>
            </div>

            <div className="bg-ink-950 p-3 rounded-lg border border-ink-700 space-y-1">
              <strong className="text-pending-400 block font-sans font-semibold">3. Presupuesto de Correcciones (3 Ciclos Max):</strong>
              <p>Cada work item permite hasta tres ciclos internos de corrección. Al agotarse los tres ciclos sin un entregable válido, bloquear el trabajo y emitir un reporte de bloqueo.</p>
            </div>

            <div className="bg-ink-950 p-3 rounded-lg border border-ink-700 space-y-1">
              <strong className="text-pending-400 block font-sans font-semibold">4. Estado "NO EMITIR" Obligatorio:</strong>
              <p>Mantener NO EMITIR cuando existan inconsistencias críticas, evidencia insuficiente o decisiones abiertas que afecten la validez del entregable.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
