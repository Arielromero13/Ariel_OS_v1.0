import React, { useState } from 'react';
import { WorkItem } from '../types';
import { X, FileText, Download, Copy, Check, ShieldCheck, AlertTriangle, Printer } from 'lucide-react';

interface ReportManifestModalProps {
  workItem: WorkItem;
  onClose: () => void;
}

export const ReportManifestModal: React.FC<ReportManifestModalProps> = ({ workItem, onClose }) => {
  const [activeTab, setActiveTab] = useState<'manifest' | 'document'>('document');
  const [copied, setCopied] = useState(false);

  const manifestData = {
    manifest_version: '0.1.0',
    generated_at: new Date().toISOString(),
    task_id: workItem.task_id,
    case: workItem.case,
    lifecycle_status: workItem.lifecycle.status,
    emission_gate_status: workItem.lifecycle.readiness.emission_gate,
    human_approval_received: workItem.human_approval_received,
    summary: {
      total_measurements: workItem.measurements.length,
      compliant_points: workItem.measurements.filter((m) => m.status === 'Conforme').length,
      non_compliant_points: workItem.measurements.filter((m) => m.status === 'No conforme').length,
      max_measured_ohm: Math.max(...workItem.measurements.map((m) => m.measured_resistance_ohm), 0),
    },
    findings: workItem.findings,
    definition_of_done: workItem.definition_of_done,
    input_manifest: workItem.input_manifest,
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(manifestData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-ink-900 border border-ink-700 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-ink-700 flex items-center justify-between bg-ink-950">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-signal-400" />
            <h2 className="text-base font-semibold text-white">
              Entregable de Reporte P.A.T. & Manifest
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex items-center bg-ink-900 p-1 rounded-lg border border-ink-700">
              <button
                onClick={() => setActiveTab('document')}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                  activeTab === 'document' ? 'bg-signal-600 text-white' : 'text-ink-300 hover:text-white'
                }`}
              >
                Documento Renderizado
              </button>
              <button
                onClick={() => setActiveTab('manifest')}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                  activeTab === 'manifest' ? 'bg-signal-600 text-white' : 'text-ink-300 hover:text-white'
                }`}
              >
                Manifest JSON
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-300 hover:text-white hover:bg-ink-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'document' ? (
            /* Printable / Rendered Document Preview */
            <div className="bg-ink-950 border border-ink-700 rounded-lg p-8 space-y-6 text-ink-100 font-sans shadow-inner">
              
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-700 pb-6">
                <div>
                  <h1 className="text-xl font-semibold text-white tracking-tight uppercase">
                    Informe Técnico de Verificación de Puesta a Tierra (P.A.T.)
                  </h1>
                  <p className="text-xs text-ink-300 mt-1">
                    Ariel Agent OS — Expediente: <span className="font-mono text-signal-400">{workItem.case.case_id}</span> | Revisión: <span className="font-mono text-signal-400">{workItem.case.revision_id}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-ink-300">Fecha: {new Date().toLocaleDateString()}</div>
                  <div className={`mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                    workItem.lifecycle.status === 'ready_for_emission'
                      ? 'bg-pass-950 text-pass-400 border-pass-800'
                      : 'bg-fail-950 text-fail-400 border-fail-800'
                  }`}>
                    {workItem.lifecycle.status === 'ready_for_emission' ? 'EMISIÓN AUTORIZADA' : 'BORRADOR - NO EMITIR'}
                  </div>
                </div>
              </div>

              {/* Plant Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-ink-900/60 p-4 rounded-lg border border-ink-700">
                <div>
                  <span className="text-ink-300 block font-semibold">Planta / Instalación:</span>
                  <span className="font-semibold text-white text-sm">{workItem.case.plant_name}</span>
                </div>
                <div>
                  <span className="text-ink-300 block font-semibold">Ubicación Especifica:</span>
                  <span className="font-semibold text-white text-sm">{workItem.case.location}</span>
                </div>
              </div>

              {/* Summary Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-ink-200 uppercase tracking-wider">
                  Resumen de Mediciones de Puesta a Tierra (Resistencia R en Ohmios)
                </h3>
                <table className="w-full text-xs border-collapse text-left border border-ink-700">
                  <thead>
                    <tr className="bg-ink-900 text-ink-300 font-mono uppercase text-[11px]">
                      <th className="p-2.5 border border-ink-700">Punto</th>
                      <th className="p-2.5 border border-ink-700">Ubicación</th>
                      <th className="p-2.5 border border-ink-700 text-center">Medido (Ω)</th>
                      <th className="p-2.5 border border-ink-700 text-center">Máximo (Ω)</th>
                      <th className="p-2.5 border border-ink-700 text-center">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-ink-200">
                    {workItem.measurements.map((m) => (
                      <tr key={m.id} className="hover:bg-ink-900/40 font-mono">
                        <td className="p-2.5 border border-ink-700 font-semibold text-signal-300">{m.point_code}</td>
                        <td className="p-2.5 border border-ink-700 font-sans">{m.location_description}</td>
                        <td className="p-2.5 border border-ink-700 text-center font-semibold">{m.measured_resistance_ohm} Ω</td>
                        <td className="p-2.5 border border-ink-700 text-center text-ink-300">{m.max_allowed_ohm} Ω</td>
                        <td className="p-2.5 border border-ink-700 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            m.status === 'Conforme' ? 'bg-pass-950 text-pass-400' : 'bg-fail-950 text-fail-400'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Findings */}
              {workItem.findings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-fail-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    No Conformidades y Recomendaciones Registradas
                  </h3>
                  <div className="space-y-2">
                    {workItem.findings.map((f) => (
                      <div key={f.id} className="bg-fail-950/20 border border-fail-900/60 p-3 rounded-lg text-xs space-y-1">
                        <div className="font-semibold text-fail-300">{f.title}</div>
                        <p className="text-ink-200">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Signatures & Controls */}
              <div className="pt-6 border-t border-ink-700 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="border-t border-ink-600 pt-2 text-ink-300">
                  <span className="block font-semibold text-ink-100">Revisión Técnica & Visual</span>
                  <span className="text-[11px]">Ariel OS Agent Framework</span>
                </div>
                <div className="border-t border-ink-600 pt-2 text-ink-300">
                  <span className="block font-semibold text-ink-100">Aprobación de Emisión Humana</span>
                  <span className="text-[11px] font-mono text-signal-400">
                    {workItem.human_approval_received ? 'FIRMADO DIGITALMENTE' : 'PENDIENTE DE FIRMA'}
                  </span>
                </div>
              </div>

            </div>
          ) : (
            /* Manifest JSON View */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-300 font-mono">contracts/report-manifest.schema.json</span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-ink-800 hover:bg-ink-700 text-xs font-semibold text-white transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-pass-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar JSON'}</span>
                </button>
              </div>

              <pre className="bg-ink-950 p-4 rounded-lg border border-ink-700 text-xs font-mono text-signal-300 overflow-x-auto max-h-[480px]">
                {JSON.stringify(manifestData, null, 2)}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
