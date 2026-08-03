import React, { useState } from 'react';
import { WorkItem, ReportTemplateInfo, ReportTemplateType } from '../types';
import { AVAILABLE_TEMPLATES } from '../data/mockData';
import { FileText, Upload, Sparkles, Check, ArrowRight, ShieldCheck, Layers, X, Plus, AlertCircle } from 'lucide-react';

interface TemplateIntakeWizardModalProps {
  onComplete: (newWorkItem: WorkItem) => void;
  onClose: () => void;
}

export const TemplateIntakeWizardModal: React.FC<TemplateIntakeWizardModalProps> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplateInfo>(AVAILABLE_TEMPLATES[0]);
  
  // Form fields
  const [plantName, setPlantName] = useState<string>('Planta Central Bio-Energía');
  const [location, setLocation] = useState<string>('Nave de Proceso 2 & Subestación de Entrada');
  const [objective, setObjective] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; role: string }[]>([
    { name: 'Planilla_Campo_Mediciones_2026.xlsx', size: '240 KB', role: 'current_evidence' },
    { name: 'Fotos_Equipos_Inspeccion.zip', size: '12.4 MB', role: 'current_evidence' },
  ]);

  const [customFileName, setCustomFileName] = useState<string>('');

  const handleTemplateSelect = (tpl: ReportTemplateInfo) => {
    setSelectedTemplate(tpl);
    if (!objective) {
      setObjective(`Verificación y elaboración de informe técnico según plantilla "${tpl.title}".`);
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomFileName(file.name);
      const isPPTX = file.name.endsWith('.pptx') || file.name.endsWith('.ppt');
      setSelectedTemplate({
        id: `TPL-CUSTOM-${Date.now()}`,
        type: isPPTX ? 'custom_pptx' : 'custom_docx',
        title: `Plantilla Personalizada (${isPPTX ? 'PowerPoint' : 'Word'}): ${file.name}`,
        version: 'v1.0 (Usuario)',
        fileName: file.name,
        description: `Plantilla ${isPPTX ? '.pptx' : '.docx'} subida por el usuario con marcadores corporativos y diapositivas de referencia.`,
        requiredEvidences: ['Evidencia de campo en Excel/PDF', 'Fotografías/Datos del reporte'],
        applicableStandards: ['Normativa aplicable según expediente'],
      });
    }
  };

  const handleAddEvidenceFile = () => {
    const fakeName = `Evidencia_Adjunta_${uploadedFiles.length + 1}.pdf`;
    setUploadedFiles((prev) => [...prev, { name: fakeName, size: '1.2 MB', role: 'current_evidence' }]);
  };

  const handleFinishWizard = () => {
    const timestamp = Date.now();
    const taskId = `TASK-${selectedTemplate.type.toUpperCase()}-${timestamp.toString().slice(-4)}`;
    
    const newWorkItem: WorkItem = {
      task_id: taskId,
      template_config: selectedTemplate,
      case: {
        case_id: `CASE-${selectedTemplate.type.toUpperCase()}-${timestamp.toString().slice(-4)}`,
        revision_id: 'R0',
        based_on_revision: null,
        revision_reason: `Inicio de expediente utilizando la plantilla "${selectedTemplate.title}".`,
        plant_name: plantName,
        location: location,
      },
      request: {
        objective: objective || `Elaboración de informe trazable según ${selectedTemplate.title}.`,
        requester: 'Gerencia de Operaciones',
        context: `Generado mediante asistente de intake para plantilla ${selectedTemplate.fileName}.`,
        scope_in: [
          `Verificación técnica bajo ${selectedTemplate.applicableStandards.join(', ')}`,
          'Control de evidencias 1:1',
          'Emisión de borrador conforme a plantilla maestra',
        ],
        scope_out: ['Auditorías de terceros fuera de alcance especificado'],
      },
      definition_of_done: [
        {
          id: 'DOD-101',
          criterion: `Campos de la plantilla ${selectedTemplate.fileName} completamente completados.`,
          mandatory: true,
          completed: false,
        },
        {
          id: 'DOD-102',
          criterion: 'Verificación de trazabilidad por Revisor Técnico.',
          mandatory: true,
          completed: false,
        },
        {
          id: 'DOD-103',
          criterion: 'Aprobación humana registrada en expediente.',
          mandatory: true,
          completed: false,
        },
      ],
      input_manifest: [
        {
          artifact_id: 'ART-TPL-01',
          name: selectedTemplate.fileName,
          role: 'template',
          status: 'available',
          authority_note: 'Plantilla oficial seleccionada para la maquetación del reporte.',
        },
        ...uploadedFiles.map((f, idx) => ({
          artifact_id: `ART-UP-${idx + 1}`,
          name: f.name,
          role: f.role as any,
          status: 'available' as const,
          authority_note: 'Evidencia adjunta en el intake inicial.',
        })),
      ],
      measurements: selectedTemplate.type === 'grounding_pat' ? [
        {
          id: 'M-101',
          point_code: 'PAT-INT-01',
          location_description: `${plantName} - Jabalina Principal 1`,
          measured_resistance_ohm: 3.40,
          max_allowed_ohm: 5.0,
          method: '3_point_fall_of_potential',
          photo_rotation_deg: 0,
          photo_legible: true,
          status: 'Conforme',
          notes: 'Medición registrada en intake inicial.',
        },
      ] : [],
      normative_criteria: selectedTemplate.applicableStandards.map((std, idx) => ({
        id: `CRIT-NEW-${idx}`,
        standard_name: std,
        edition: '2024 / Vigente',
        clause: 'Sección Principal',
        requirement_summary: `Cumplimiento de estándares de seguridad y tolerancias para ${selectedTemplate.title}.`,
        applicability: 'verified',
        verification_notes: 'Verificado automáticamente por la plantilla.',
      })),
      findings: [],
      stages: [
        {
          id: 'intake_and_plan',
          name: '1. Intake & Configuración de Plantilla',
          owner: 'orchestrator',
          status: 'passed',
          outputsProduced: ['template_bound_brief', 'initial_manifest'],
          notes: `Plantilla ${selectedTemplate.title} configurada exitosamente.`,
        },
        {
          id: 'evidence_control',
          name: '2. Carga y Control de Evidencias',
          owner: 'domain_specialist',
          status: 'in_progress',
          outputsProduced: [],
          notes: 'Esperando procesamiento de archivos adjuntos por la cuadrilla de agentes.',
        },
        {
          id: 'technical_analysis',
          name: '3. Análisis de Datos & Mediciones',
          owner: 'domain_specialist',
          status: 'pending',
          outputsProduced: [],
        },
        {
          id: 'normative_analysis',
          name: '4. Validación de Normativa',
          owner: 'normative_researcher',
          status: 'pending',
          outputsProduced: [],
        },
        {
          id: 'technical_review',
          name: '5. Revisión Técnica',
          owner: 'technical_reviewer',
          status: 'pending',
          outputsProduced: [],
        },
        {
          id: 'report_integration',
          name: '6. Llenado e Integración de Plantilla',
          owner: 'integrator',
          status: 'pending',
          outputsProduced: [],
        },
        {
          id: 'visual_evidence_qa',
          name: '7. QA Visual & Maquetación .DOCX',
          owner: 'visual_reviewer',
          status: 'pending',
          outputsProduced: [],
        },
        {
          id: 'decision_audit',
          name: '8. Auditoría y Emisión',
          owner: 'auditor',
          status: 'pending',
          outputsProduced: [],
        },
      ],
      handoffs: [],
      chat_history: [
        {
          id: `MSG-INIT-${timestamp}`,
          senderRole: 'orchestrator',
          senderName: 'Orquestador ChatDev',
          recipientRole: 'all',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          content: `¡Nuevo Expediente Creado! Se ha seleccionado la plantilla "${selectedTemplate.title}". Equipo de agentes activado para procesar las evidencias de la planta "${plantName}".`,
          stageId: 'intake_and_plan',
          artifactsLinked: ['template_bound_brief'],
          messageType: 'discussion',
        },
      ],
      lifecycle: {
        status: 'ready',
        iteration_count: 0,
        readiness: {
          execution_gate: 'passed',
          emission_gate: 'not_evaluated',
          blocking_reasons: ['En espera de procesamiento de la plantilla por el equipo de agentes.'],
        },
      },
      open_decisions: ['Verificar compatibilidad de campos con plantilla Word.'],
      human_approval_received: false,
    };

    onComplete(newWorkItem);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-ink-900 border border-ink-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-ink-700 bg-ink-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-signal-500/20 text-signal-400 border border-signal-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Asistente de Intake & Selección de Plantilla (.DOCX)
              </h2>
              <p className="text-xs text-ink-300">
                Define el espíritu y tipo de reporte antes de activar el equipo de agentes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-300 hover:text-white hover:bg-ink-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Indicators */}
        <div className="bg-ink-950/60 px-6 py-3 border-b border-ink-700 flex items-center justify-between text-xs font-semibold">
          {[
            { num: 1, title: '1. Plantilla Maestra' },
            { num: 2, title: '2. Datos de la Planta' },
            { num: 3, title: '3. Evidencias & Archivos' },
            { num: 4, title: '4. Confirmar & Lanzar ChatDev' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-2 cursor-pointer transition ${
                step === s.num
                  ? 'text-signal-400 font-bold'
                  : step > s.num
                  ? 'text-pass-400'
                  : 'text-ink-400'
              }`}
              onClick={() => setStep(s.num)}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono ${
                  step === s.num
                    ? 'bg-signal-600 text-white font-bold ring-2 ring-signal-400'
                    : step > s.num
                    ? 'bg-pass-950 text-pass-400 border border-pass-700'
                    : 'bg-ink-800 text-ink-300'
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className="hidden sm:inline">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Wizard Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Step 1: Select or Upload Template */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Paso 1: ¿De qué tratará el reporte técnico?</h3>
                <p className="text-xs text-ink-300">
                  Selecciona una plantilla estandarizada o sube tu propia plantilla en formato Microsoft Word (.docx).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AVAILABLE_TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplate.id === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleTemplateSelect(tpl)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-signal-950/40 border-signal-500 ring-2 ring-signal-500/50 shadow-lg'
                          : 'bg-ink-950/60 border-ink-700 hover:border-ink-600 hover:bg-ink-800/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-signal-500/10 text-signal-400 border border-signal-500/20">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ink-900 border border-ink-700 text-ink-200 font-bold">
                          {tpl.version}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white mb-1">{tpl.title}</h4>
                        <p className="text-[11px] text-ink-300 leading-relaxed">{tpl.description}</p>
                      </div>

                      <div className="pt-2 border-t border-ink-700/80 text-[10px] text-ink-300 space-y-1">
                        <div>
                          <strong className="text-ink-200">Evidencias requeridas:</strong>{' '}
                          {tpl.requiredEvidences.join(', ')}
                        </div>
                        <div>
                          <strong className="text-ink-200">Normas aplicables:</strong>{' '}
                          {tpl.applicableStandards.join(', ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Upload Card */}
              <div className="p-4 rounded-xl border border-dashed border-signal-500/40 bg-signal-950/10 hover:bg-signal-950/20 transition flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-signal-500/20 text-signal-300">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">¿Tienes tu propia plantilla .DOCX o .PPTX?</h4>
                    <p className="text-[11px] text-ink-300">
                      {customFileName ? `Archivo cargado: ${customFileName}` : 'Subir archivo Microsoft Word (.docx) o PowerPoint (.pptx) con tus patrones de diseño corporativos.'}
                    </p>
                  </div>
                </div>

                <label className="px-4 py-2 rounded-lg bg-signal-600 hover:bg-signal-500 text-white text-xs font-bold cursor-pointer transition">
                  <span>Buscar Archivo</span>
                  <input
                    type="file"
                    accept=".docx,.doc,.pptx,.ppt"
                    className="hidden"
                    onChange={handleCustomFileUpload}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Plant & Case Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Paso 2: Datos de la Planta y Alcance</h3>
                <p className="text-xs text-ink-300">
                  Especifica los datos generales de la instalación para personalizar la carátula y el expediente.
                </p>
              </div>

              <div className="bg-ink-950 p-4 rounded-xl border border-ink-700 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-ink-200 block mb-1">Nombre de la Planta / Instalación:</label>
                  <input
                    type="text"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    className="w-full bg-ink-900 border border-ink-700 rounded p-2.5 text-xs text-white focus:outline-none focus:border-signal-500 font-sans"
                  />
                </div>

                <div>
                  <label className="font-semibold text-ink-200 block mb-1">Ubicación / Sector Interno:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-ink-900 border border-ink-700 rounded p-2.5 text-xs text-white focus:outline-none focus:border-signal-500 font-sans"
                  />
                </div>

                <div>
                  <label className="font-semibold text-ink-200 block mb-1">Objetivo del Reporte:</label>
                  <textarea
                    rows={3}
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="Ej: Verificación periódica anual para cumplimiento de auditoría técnica..."
                    className="w-full bg-ink-900 border border-ink-700 rounded p-2.5 text-xs text-white focus:outline-none focus:border-signal-500 font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Evidences & Field Files */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Paso 3: Carga de Archivos y Evidencias de Campo</h3>
                <p className="text-xs text-ink-300">
                  Adjunta las planillas Excel con mediciones, fotos o certificados para que los agentes extraigan los datos.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-200 uppercase tracking-wider">
                    Evidencias Adjuntas ({uploadedFiles.length})
                  </span>

                  <button
                    onClick={handleAddEvidenceFile}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-ink-800 hover:bg-ink-700 text-signal-400 text-xs font-semibold cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Archivo Simulado</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-ink-950 rounded-xl border border-ink-700 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-signal-400" />
                        <div>
                          <div className="font-semibold text-white">{file.name}</div>
                          <div className="text-[10px] text-ink-400 font-mono">{file.size}</div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded bg-signal-950 text-signal-300 border border-signal-800 text-[10px] font-mono">
                        {file.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Summary & Confirm */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Paso 4: Resumen & Confirmación de Equipo ChatDev</h3>
                <p className="text-xs text-ink-300">
                  Revisa los datos antes de desplegar el equipo multi-agente de Ariel Agent OS.
                </p>
              </div>

              <div className="bg-ink-950 p-5 rounded-xl border border-ink-700 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 border-b border-ink-700/80 pb-3">
                  <div>
                    <span className="text-ink-400 block">Plantilla Seleccionada:</span>
                    <strong className="text-signal-400">{selectedTemplate.title}</strong>
                  </div>
                  <div>
                    <span className="text-ink-400 block">Archivo de Salida:</span>
                    <strong className="text-white font-mono">{selectedTemplate.fileName}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-ink-700/80 pb-3">
                  <div>
                    <span className="text-ink-400 block">Planta / Instalación:</span>
                    <strong className="text-white">{plantName}</strong>
                  </div>
                  <div>
                    <span className="text-ink-400 block">Ubicación:</span>
                    <strong className="text-ink-200">{location}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-ink-400 block mb-1">Normativa & Criterios Aprobados:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTemplate.applicableStandards.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-ink-900 border border-ink-700 text-signal-300 font-mono text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-pass-950/30 border border-pass-800/60 rounded-lg text-pass-300 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-pass-400 shrink-0" />
                  <span>
                    El orquestador creará el Work Item y asignará las tareas secuenciales entre el Especialista de Dominio, Investigador Normativo y Revisor Técnico.
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 border-t border-ink-700 bg-ink-950 flex items-center justify-between">
          <button
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="px-4 py-2 rounded-lg bg-ink-800 hover:bg-ink-700 disabled:opacity-40 text-ink-200 text-xs font-semibold cursor-pointer transition"
          >
            Atrás
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep((prev) => Math.min(4, prev + 1))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-signal-600 hover:bg-signal-500 text-white font-bold text-xs cursor-pointer transition-colors transition-all"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishWizard}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pass-600 hover:bg-pass-500 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Lanzar Equipo Multi-Agente ChatDev</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
