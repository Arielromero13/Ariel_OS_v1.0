/**
 * DATOS SINTÉTICOS DE DEMOSTRACIÓN.
 * No representan una instalación real ni autorizan criterios, hallazgos o emisiones.
 */

import { WorkItem, ReportTemplateInfo, AgentChatMessage } from '../types';

export const AVAILABLE_TEMPLATES: ReportTemplateInfo[] = [
  {
    id: 'TPL-PAT-01',
    type: 'grounding_pat',
    title: 'Plantilla Maestra P.A.T. (AEA 90364 & IEEE 80)',
    version: 'v2.1.0',
    fileName: 'Plantilla_Maestra_Informe_PAT_v2.docx',
    description: 'Plantilla oficial para verificación de mallas a tierra, electrodos, jabalinas y prueba de continuidad.',
    requiredEvidences: ['Planilla Excel con mediciones Ω', 'Galería de fotos de jabalinas/conexiones', 'Certificado de calibración de telurímetro'],
    applicableStandards: ['AEA 90364-7-710', 'IEEE Std 80-2013', 'IEEE Std 81-2012']
  },
  {
    id: 'TPL-THERM-01',
    type: 'thermography',
    title: 'Informe de Inspección Termográfica Infrarroja (IRT)',
    version: 'v1.4.0',
    fileName: 'Plantilla_Termografia_Infrarroja_v1.docx',
    description: 'Análisis de termogramas, gradientes ΔT (°C) y severidad de sobrecalentamiento en celdas y tableros.',
    requiredEvidences: ['Imágenes térmicas (.jpg / .is2)', 'Fotos de luz visible de tableros', 'Registro de carga en amperes'],
    applicableStandards: ['NFPA 70B', 'ISO 18434-1', 'ASTM E1934']
  },
  {
    id: 'TPL-PPTX-EXEC-01',
    type: 'executive_pptx_deck',
    title: 'Presentación Ejecutiva PowerPoint (Executive PPTX Deck)',
    version: 'v1.0.0',
    fileName: 'Deck_Ejecutivo_Resumen_Gestion_Riesgos.pptx',
    description: 'Diapositivas de alto nivel para Directorio, Gerencia y Auditoría con kpis, gráficos de radar, mapa de riesgos y recomendaciones de inversión.',
    requiredEvidences: ['Resumen de hallazgos críticos', 'Matriz de riesgo consolidada', 'Estimación de presupuesto de remediación'],
    applicableStandards: ['ISO 31000 (Gestión de Riesgos)', 'Gobierno Corporativo']
  },
  {
    id: 'TPL-PPTX-TECH-01',
    type: 'technical_pptx_deck',
    title: 'Presentación Técnica & Diagnóstico Operativo (.PPTX)',
    version: 'v1.0.0',
    fileName: 'Presentacion_Tecnica_Diagnostico_Planta.pptx',
    description: 'Deck de diapositivas técnicas con esquemas unifilares, fotos comparativas antes/después, tablas de mediciones y gráficos de tendencia.',
    requiredEvidences: ['Fotos de instalaciones y tableros', 'Tabla de mediciones de campo', 'Diagrama de bloques'],
    applicableStandards: ['Normas Técnicas Sectoriales (IEC/IEEE/NFPA)']
  },
  {
    id: 'TPL-SUBSTATION-01',
    type: 'substation_maintenance',
    title: 'Protocolo de Ensayo y Mantenimiento de Subestaciones',
    version: 'v3.0.0',
    fileName: 'Plantilla_Mantenimiento_Subestaciones.docx',
    description: 'Verificación de transformadores, aceite dieléctrico, tiempos de apertura de interruptores y protecciones.',
    requiredEvidences: ['Protocolos de rigidez dieléctrica de aceite', 'Ensayos Megger de aislación', 'Tiempos de disparo de relés'],
    applicableStandards: ['IEC 60076', 'IEEE C57.12', 'NETA ATS']
  },
  {
    id: 'TPL-POWERQUAL-01',
    type: 'power_quality',
    title: 'Estudio de Calidad de Energía y Armónicos',
    version: 'v1.2.0',
    fileName: 'Plantilla_Calidad_Energia_Armonicos.docx',
    description: 'Medición de THD (Tensión/Corriente), sags/swells, factor de potencia y cumplimiento de código de red.',
    requiredEvidences: ['Registros CSV/PQDIF de analizador de redes', 'Diagrama unifilar de la planta'],
    applicableStandards: ['IEEE Std 519-2022', 'IEC 61000-4-30 Class A']
  },
  {
    id: 'TPL-CUSTOM-DOCX-01',
    type: 'custom_docx',
    title: 'Plantilla Corporativa Word (.DOCX)',
    version: 'v1.0.0',
    fileName: 'Plantilla_Personalizada_Cliente.docx',
    description: 'Carga tu propia plantilla Word (.docx) con marcadores {{CLIENTE}}, {{PLANTILLA}}, {{TABLA_MEDICIONES}}.',
    requiredEvidences: ['Definición de campos de entrada custom', 'Archivos de soporte'],
    applicableStandards: ['A definir según alcance del proyecto']
  },
  {
    id: 'TPL-CUSTOM-PPTX-01',
    type: 'custom_pptx',
    title: 'Plantilla Corporativa PowerPoint (.PPTX)',
    version: 'v1.0.0',
    fileName: 'Plantilla_Presentacion_Cliente.pptx',
    description: 'Carga tu propia plantilla PowerPoint (.pptx) con patrones de diapositivas corporativos (Slide Masters) y logotipos.',
    requiredEvidences: ['Archivo .pptx base con estilos del cliente', 'Datos y gráficos a incrustar'],
    applicableStandards: ['Manual de Marca Corporativo']
  }
];

export const INITIAL_CHAT_MESSAGES: AgentChatMessage[] = [
  {
    id: 'MSG-001',
    senderRole: 'orchestrator',
    senderName: 'Orquestador del Sistema',
    recipientRole: 'all',
    timestamp: '14:10:02',
    content: 'Comenzando expedientes TASK-PAT-2026-001 para la Planta Industrial San Martín. Plantilla cargada: "Plantilla Maestra P.A.T. (AEA 90364 & IEEE 80)". Verificando manifest de evidencias inicial.',
    stageId: 'intake_and_plan',
    artifactsLinked: ['ART-001', 'ART-002', 'ART-005'],
    messageType: 'discussion'
  },
  {
    id: 'MSG-002',
    senderRole: 'domain_specialist',
    senderName: 'Especialista P.A.T. (Dominio)',
    recipientRole: 'orchestrator',
    timestamp: '14:12:45',
    content: '[SINTÉTICO DE DEMOSTRACIÓN] Se registraron lecturas que requieren evaluación contra criterios aún no verificados. No se asigna conformidad.',
    stageId: 'evidence_control',
    artifactsLinked: ['validated_control_matrix'],
    messageType: 'finding_alert'
  },
  {
    id: 'MSG-003',
    senderRole: 'normative_researcher',
    senderName: 'Investigador Normativo',
    recipientRole: 'domain_specialist',
    timestamp: '14:15:30',
    content: '[SINTÉTICO DE DEMOSTRACIÓN] Las fuentes están disponibles, pero su edición, cláusula y aplicabilidad siguen pendientes de verificación.',
    stageId: 'normative_analysis',
    artifactsLinked: ['criteria_register'],
    messageType: 'discussion'
  },
  {
    id: 'MSG-004',
    senderRole: 'technical_reviewer',
    senderName: 'Revisor Técnico',
    recipientRole: 'all',
    timestamp: '14:18:10',
    content: 'Atención: Dado que existe una No Conformidad Crítica en la Subestación, la compuerta de emisión externa está en estado NO EMITIR. Recomiendo al Integrador preparar el borrador indicando la propuesta de hincado de jabalina auxiliar.',
    stageId: 'technical_review',
    artifactsLinked: ['technical_review_record'],
    requiresUserAction: true,
    actionPrompt: '¿Confirmas la recomendación técnica de jabalina auxiliar profunda para incluir en la plantilla borrador?',
    messageType: 'decision_request'
  }
];

export const INITIAL_WORK_ITEMS: WorkItem[] = [
  {
    task_id: 'TASK-PAT-2026-001',
    data_classification: 'demo_synthetic',
    template_config: AVAILABLE_TEMPLATES[0],
    chat_history: INITIAL_CHAT_MESSAGES,
    case: {
      case_id: 'CASE-PAT-2026-001',
      revision_id: 'R0',
      based_on_revision: null,
      revision_reason: 'Emisión inicial de verificación de Malla P.A.T. Subestación Principal',
      plant_name: 'Planta Industrial San Martín',
      location: 'Sector Subestación 33kV / 13.2kV'
    },
    request: {
      objective: 'Preparar informe P.A.T. trazable con verificación de mediciones de resistencia de puesta a tierra y continuidad de mallas.',
      requester: 'Ing. Carlos Mendoza (Gerencia de Mantenimiento)',
      context: 'Auditoría anual de seguridad eléctrica según normativa nacional AEA y estándar IEEE 80.',
      scope_in: [
        'Medición de resistencia de puesta a tierra en 6 electrodos principales',
        'Inspección visual de conexiones de jabalinas y barras de cobre',
        'Verificación de criterios de aceptación normativos AEA 90364 e IEEE 80',
        'Emisión de borrador de informe técnico y galería fotográfica en formato trazable'
      ],
      scope_out: [
        'Análisis de resistividad del terreno por método Wenner (campaña previa)',
        'Cálculo de tensiones de paso y contacto por simulación de elementos finitos'
      ]
    },
    definition_of_done: [
      {
        id: 'DOD-01',
        criterion: 'Matriz de control de mediciones completa y vinculada a evidencias fotográficas legibles.',
        verification_method: 'Verificación visual e inspección fotográfica 1:1',
        mandatory: true,
        completed: true
      },
      {
        id: 'DOD-02',
        criterion: 'Criterio de resistencia máxima (< 10 Ω para subestación secundaria / < 5 Ω principal) sustentado con cláusula normativa.',
        verification_method: 'Cita en registro normativo y evaluación de aplicabilidad',
        mandatory: true,
        completed: true
      },
      {
        id: 'DOD-03',
        criterion: 'Aprobación formal del Revisor Técnico sin inconsistencias críticas.',
        verification_method: 'Firma electrónica de revisión técnica',
        mandatory: true,
        completed: false
      },
      {
        id: 'DOD-04',
        criterion: 'Control de calidad visual de maquetación y orientación fotográfica (sin giros incorrectos).',
        verification_method: 'Visual QA Check por Revisor Visual',
        mandatory: true,
        completed: false
      },
      {
        id: 'DOD-05',
        criterion: 'Decisión de auditoría favorable y autorización humana previa a emisión externa.',
        verification_method: 'Registro de auditoría + Checkbox de aprobación humana',
        mandatory: true,
        completed: false
      }
    ],
    input_manifest: [
      {
        artifact_id: 'ART-001',
        name: 'Planilla_Mediciones_PAT_SanMartin_2026.xlsx',
        location: '/evidencias/2026/mediciones_pat.xlsx',
        role: 'current_evidence',
        status: 'available',
        authority_note: 'Planilla de campo firmada por el técnico certificador.'
      },
      {
        artifact_id: 'ART-002',
        name: 'Galeria_Fotografica_Jabalinas_Subestacion.zip',
        location: '/evidencias/2026/fotos_jabalinas.zip',
        role: 'current_evidence',
        status: 'available',
        authority_note: '6 fotografías de alta resolución con GPS y timestamp.'
      },
      {
        artifact_id: 'ART-003',
        name: 'Informe_PAT_Historico_2025_R1.pdf',
        location: '/historicos/2025/PAT_SanMartin_R1.pdf',
        role: 'historical_reference',
        status: 'available',
        authority_note: 'Informe de referencia año anterior. Usar solo como contexto.'
      },
      {
        artifact_id: 'ART-004',
        name: 'Norma_AEA_90364_7_710_2015.pdf',
        location: '/normativa/AEA_90364.pdf',
        role: 'normative_source',
        status: 'available',
        authority_note: 'Reglamentación para la Ejecución de Instalaciones Eléctricas en Inmuebles.'
      },
      {
        artifact_id: 'ART-005',
        name: 'Plantilla_Maestra_Informe_PAT_v2.docx',
        location: '/templates/Plantilla_PAT_v2.docx',
        role: 'template',
        status: 'available',
        authority_note: 'Plantilla oficial de reporte técnico Ariel OS.'
      }
    ],
    measurements: [
      {
        id: 'M-01',
        point_code: 'PAT-SUB-01',
        location_description: 'Jabalina N°1 - Transformador Trafo T1 13.2kV (Lado Norte)',
        measured_resistance_ohm: 2.85,
        max_allowed_ohm: 5.0,
        method: '3_point_fall_of_potential',
        photo_id: 'IMG_PAT_01.jpg',
        photo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
        photo_rotation_deg: 0,
        photo_legible: true,
        status: 'Pendiente',
        notes: 'Conexión limpia, sin corrosión en prensa de bronce.'
      },
      {
        id: 'M-02',
        point_code: 'PAT-SUB-02',
        location_description: 'Jabalina N°2 - Tablero General de Baja Tensión (TGBT)',
        measured_resistance_ohm: 3.12,
        max_allowed_ohm: 5.0,
        method: '3_point_fall_of_potential',
        photo_id: 'IMG_PAT_02.jpg',
        photo_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=80',
        photo_rotation_deg: 0,
        photo_legible: true,
        status: 'Pendiente',
        notes: 'Puntos de medición limpios y ajustados.'
      },
      {
        id: 'M-03',
        point_code: 'PAT-SUB-03',
        location_description: 'Jabalina N°3 - Celda de Media Tensión 33kV (Sector Entrada)',
        measured_resistance_ohm: 8.45,
        max_allowed_ohm: 5.0,
        method: '3_point_fall_of_potential',
        photo_id: 'IMG_PAT_03.jpg',
        photo_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80',
        photo_rotation_deg: 0,
        photo_legible: true,
        status: 'Pendiente',
        notes: 'Supera el límite de 5.0 Ω para subestación. Requiere jabalina auxiliar o acondicionamiento del suelo.'
      },
      {
        id: 'M-04',
        point_code: 'PAT-GEN-01',
        location_description: 'Jabalina N°4 - Grupo Electrógeno de Emergencia 500kVA',
        measured_resistance_ohm: 4.10,
        max_allowed_ohm: 10.0,
        method: 'clamp_on',
        photo_id: 'IMG_PAT_04.jpg',
        photo_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=500&auto=format&fit=crop&q=80',
        photo_rotation_deg: 0,
        photo_legible: true,
        status: 'Pendiente',
        notes: 'Neutro del generador conectado a barra colectora.'
      },
      {
        id: 'M-05',
        point_code: 'PAT-EST-01',
        location_description: 'Jabalina N°5 - Estructura Metálica Nave Principal Norte',
        measured_resistance_ohm: 12.30,
        max_allowed_ohm: 10.0,
        method: '3_point_fall_of_potential',
        photo_id: 'IMG_PAT_05.jpg',
        photo_url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&auto=format&fit=crop&q=80',
        photo_rotation_deg: 0,
        photo_legible: true,
        status: 'Pendiente',
        notes: 'Sulfatación en terminal de cable de cobre 50mm2.'
      },
      {
        id: 'M-06',
        point_code: 'PAT-PATIO-01',
        location_description: 'Jabalina N°6 - Cerco Perimetral Subestación Exterior',
        measured_resistance_ohm: 4.90,
        max_allowed_ohm: 10.0,
        method: '3_point_fall_of_potential',
        photo_id: 'IMG_PAT_06.jpg',
        photo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
        photo_rotation_deg: 0,
        photo_legible: true,
        status: 'Pendiente',
        notes: 'Puesta a tierra de seguridad de portón y cerco.'
      }
    ],
    normative_criteria: [
      {
        id: 'CRIT-01',
        standard_name: 'AEA 90364-7-710',
        edition: '2015',
        clause: 'Sección 710.55.2',
        requirement_summary: '[SINTÉTICO] Posible criterio a investigar. No usar como límite hasta confirmar fuente y aplicabilidad.',
        max_resistance_threshold_ohm: 10.0,
        applicability: 'unverified',
        verification_notes: '[SINTÉTICO] Pendiente de verificación independiente.'
      },
      {
        id: 'CRIT-02',
        standard_name: 'IEEE 80',
        edition: '2013',
        clause: 'Section 14.1 - Substation Grounding',
        requirement_summary: '[SINTÉTICO] Posible criterio a investigar. IEEE 80 no debe citarse como límite genérico de resistencia.',
        max_resistance_threshold_ohm: 5.0,
        applicability: 'unverified',
        verification_notes: '[SINTÉTICO] Pendiente de verificación independiente.'
      },
      {
        id: 'CRIT-03',
        standard_name: 'IEEE 81',
        edition: '2012',
        clause: 'Section 8.2 - Fall of Potential Method',
        requirement_summary: '[SINTÉTICO] Método de ensayo pendiente de validación contra el procedimiento y fuente aplicable.',
        applicability: 'unverified',
        verification_notes: '[SINTÉTICO] Pendiente de verificación independiente.'
      }
    ],
    findings: [
      {
        id: 'FIND-01',
        point_id: 'M-03',
        finding_type: 'limitation',
        title: 'Exceso de Resistencia en Jabalina PAT-SUB-03 (Media Tensión)',
        description: 'Lectura sintética de 8.45 Ω que requiere validación del método y de un criterio aplicable antes de emitir una conclusión.',
        severity: 'major',
        status: 'open'
      },
      {
        id: 'FIND-02',
        point_id: 'M-05',
        finding_type: 'limitation',
        title: 'Resistencia Elevada y Sulfatación en Estructura PAT-EST-01',
        description: 'Lectura sintética de 12.30 Ω y observación visual que requieren validación de evidencia y criterio antes de emitir una conclusión.',
        severity: 'major',
        status: 'open'
      }
    ],
    stages: [
      {
        id: 'intake_and_plan',
        name: '1. Intake & Planificación',
        owner: 'orchestrator',
        status: 'passed',
        outputsProduced: ['execution_brief', 'workflow_selection_record', 'initial_gap_list'],
        notes: 'Expediente clasificado como grounding-report v0.1.0. Definición de Done configurada con 5 criterios obligatorios.'
      },
      {
        id: 'evidence_control',
        name: '2. Control de Evidencias',
        owner: 'domain_specialist',
        skill: 'analyze-grounding-report',
        status: 'passed',
        outputsProduced: ['validated_control_matrix', 'evidence_manifest', 'traceability_map'],
        notes: '6 mediciones cargadas desde la planilla. Fotos vinculadas 1:1 con legibilidad confirmada.'
      },
      {
        id: 'technical_analysis',
        name: '3. Análisis Técnico P.A.T.',
        owner: 'domain_specialist',
        skill: 'analyze-grounding-report',
        status: 'passed',
        outputsProduced: ['technical_findings', 'limitations_record', 'provisional_evaluation_states'],
        notes: 'Se identificaron dos lecturas sintéticas pendientes de evaluación; no se asignaron estados de conformidad.'
      },
      {
        id: 'normative_analysis',
        name: '4. Análisis Normativo',
        owner: 'normative_researcher',
        status: 'passed',
        outputsProduced: ['criteria_register', 'normative_citations', 'applicability_assessment'],
        notes: 'Fuentes de demostración registradas; edición, cláusula y aplicabilidad pendientes de investigación.'
      },
      {
        id: 'technical_review',
        name: '5. Revisión Técnica',
        owner: 'technical_reviewer',
        status: 'in_progress',
        outputsProduced: ['technical_review_record'],
        notes: 'Revisión en proceso. Verificando trazabilidad de hallazgos FIND-01 y FIND-02.'
      },
      {
        id: 'report_integration',
        name: '6. Integración del Entregable',
        owner: 'integrator',
        status: 'pending',
        outputsProduced: [],
        notes: 'Pendiente de aprobación técnica.'
      },
      {
        id: 'visual_evidence_qa',
        name: '7. Control Visual & Maquetación',
        owner: 'visual_reviewer',
        status: 'pending',
        outputsProduced: [],
        notes: 'Pendiente de integración de borrador Word.'
      },
      {
        id: 'intent_validation',
        name: '8. Validación de Intención',
        owner: 'orchestrator',
        status: 'pending',
        outputsProduced: [],
        notes: 'Pendiente de control de calidad visual.'
      },
      {
        id: 'decision_audit',
        name: '9. Auditoría & Decisión',
        owner: 'auditor',
        status: 'pending',
        outputsProduced: [],
        notes: 'Pendiente de validación de intención.'
      }
    ],
    handoffs: [
      {
        id: 'HO-01',
        fromRole: 'orchestrator',
        toRole: 'domain_specialist',
        stageId: 'evidence_control',
        timestamp: '2026-07-24T14:10:00Z',
        artifactsLinked: ['ART-001', 'ART-002'],
        limitations: ['No se incluyeron curvas de resistividad del terreno.'],
        openDecisions: ['Confirmar si la jabalina PAT-SUB-03 pertenece al anillo de MT o es independiente.'],
        specificRequest: 'Validar matriz de mediciones y vincular cada lectura a su foto en la galería.'
      },
      {
        id: 'HO-02',
        fromRole: 'domain_specialist',
        toRole: 'normative_researcher',
        stageId: 'normative_analysis',
        timestamp: '2026-07-24T14:35:00Z',
        artifactsLinked: ['validated_control_matrix'],
        limitations: [],
        openDecisions: [],
        specificRequest: 'Verificar si el umbral de 5Ω aplica por norma local o requerimiento contractual IEEE 80.'
      },
      {
        id: 'HO-03',
        fromRole: 'domain_specialist',
        toRole: 'technical_reviewer',
        stageId: 'technical_review',
        timestamp: '2026-07-24T15:05:00Z',
        artifactsLinked: ['technical_findings', 'validated_control_matrix'],
        limitations: ['Mediciones efectuadas en época seca.'],
        openDecisions: [],
        specificRequest: 'Revisar si los hallazgos no conformes justifican emitir recomendación de adecuación urgente.'
      }
    ],
    lifecycle: {
      status: 'under_review',
      iteration_count: 0,
      readiness: {
        execution_gate: 'passed',
        emission_gate: 'not_evaluated',
        blocking_reasons: [
          'Pendiente de aprobación técnica y visual.',
          'Requiere confirmación de recomendación técnica para jabalina PAT-SUB-03.',
          'Requiere autorización humana registrada antes de emisión externa.'
        ]
      }
    },
    open_decisions: [
      '¿Corresponde emitir el informe con estado NO CONFORME o solicitar re-medición tras mantenimiento?',
      'Verificar si se aplica recomendación de hincado de jabalina auxiliar profunda.'
    ],
    human_approval_received: false
  }
];

export const AGENTS_CATALOG = [
  {
    id: 'orchestrator',
    title: 'Orquestador (Orchestrator)',
    badge: 'always',
    mission: 'Convertir expedientes en work items y coordinar workflows verificables.',
    activates: 'Siempre activo al inicio y en compuertas de cambio de ciclo',
    outputs: ['work_item', 'execution_brief', 'workflow_selection_record', 'reformulation_brief'],
    mayDecide: ['workflow_selection', 'delegation', 'correction_type', 'escalation'],
    mustEscalate: ['ambiguous_intent', 'missing_hard_requirement', 'exhausted_correction_cycles']
  },
  {
    id: 'domain_specialist',
    title: 'Especialista de Dominio (P.A.T. Specialist)',
    badge: 'when_technical_evidence_is_sufficient',
    mission: 'Analizar evidencia dentro de la skill y alcance del dominio activos.',
    activates: 'Cuando la evidencia técnica es suficiente',
    outputs: ['validated_matrix', 'technical_findings', 'limitations_record'],
    mayDecide: ['evidence_bound_interpretation'],
    mustEscalate: ['unreadable_evidence', 'unsupported_method', 'field_contradiction']
  },
  {
    id: 'normative_researcher',
    title: 'Investigador Normativo (Normative Researcher)',
    badge: 'when_normative_or_design_criterion_is_needed',
    mission: 'Verificar criterios técnicos, fuentes y aplicabilidad de normas (IEEE, AEA, IEC, NFPA).',
    activates: 'Cuando se requiere un criterio normativo o de diseño',
    outputs: ['criteria_register', 'normative_citations', 'applicability_assessment'],
    mayDecide: ['verified_criterion_applicability'],
    mustEscalate: ['source_or_clause_unverified', 'applicability_uncertain']
  },
  {
    id: 'technical_reviewer',
    title: 'Revisor Técnico (Technical Reviewer)',
    badge: 'before_integration_of_technical_deliverable',
    mission: 'Validar calidad, trazabilidad y límites del análisis técnico independientemente.',
    activates: 'Antes de la integración del entregable técnico',
    outputs: ['technical_review_record', 'correction_request'],
    mayDecide: ['approve_analysis', 'request_patch', 'request_partial_rework'],
    mustEscalate: ['material_technical_risk', 'evidence_conflict', 'unsupported_conclusion']
  },
  {
    id: 'integrator',
    title: 'Integrador (Integrator)',
    badge: 'after_technical_approval',
    mission: 'Ensamblar componentes aprobados en entregables coherentes sin alterar hallazgos.',
    activates: 'Después de la aprobación técnica',
    outputs: ['integrated_deliverable', 'rendered_document', 'output_manifest'],
    mayDecide: ['presentation_and_layout'],
    mustEscalate: ['component_inconsistency', 'missing_required_component']
  },
  {
    id: 'visual_reviewer',
    title: 'Revisor Visual (Visual Reviewer)',
    badge: 'after_document_integration',
    mission: 'Aprobar la calidad visual y trazabilidad de documentos renderizados y galerías.',
    activates: 'Después de la integración del documento',
    outputs: ['visual_qa_record', 'visual_correction_request'],
    mayDecide: ['approve_visual_presentation', 'request_visual_patch', 'request_visual_partial_rework'],
    mustEscalate: ['ambiguous_visual_evidence', 'traceability_break']
  },
  {
    id: 'auditor',
    title: 'Auditor de Sistema (Auditor)',
    badge: 'before_external_emission_or_when_risk_is_high',
    mission: 'Evaluar si aprobar, bloquear o escalar cumple la evidencia y las reglas no negociables.',
    activates: 'Antes de emisión externa o cuando el riesgo es alto',
    outputs: ['audit_decision', 'escalation_record', 'blocking_report'],
    mayDecide: ['approve_process', 'block_emission', 'escalate'],
    mustEscalate: ['disagreement_between_control_roles', 'critical_evidence_missing', 'correction_budget_exhausted']
  },
  {
    id: 'presentation_designer',
    title: 'Diseñador de Presentaciones PPTX (Visual Communicator)',
    badge: 'when_presentation_deck_requested',
    mission: 'Transformar datos de ingeniería, informes y matrices de riesgo en diapositivas PowerPoint (.PPTX) de alto impacto visual y ejecutivo.',
    activates: 'Cuando el expediente requiere un deck de diapositivas ejecutivo o técnico',
    outputs: ['pptx_slide_deck', 'slide_master_layout', 'executive_summary_deck'],
    mayDecide: ['slide_layout_selection', 'kpi_visual_pairing', 'color_palette_contrast'],
    mustEscalate: ['missing_brand_guidelines', 'unsupported_chart_data']
  }
];

export const SKILLS_CATALOG = [
  {
    id: 'analyze-grounding-report',
    name: 'Análisis de Informe P.A.T.',
    domain: 'electrical-grounding',
    path: 'skills/analyze-grounding-report/SKILL.md',
    description: 'Procesamiento de planillas de mediciones de puesta a tierra, validación geométrica de electrodos y evaluación de resistencia.'
  },
  {
    id: 'generate-pptx-deck',
    name: 'Maquetación & Generación de Decks PPTX',
    domain: 'visual-presentation',
    path: 'skills/generate-pptx-deck/SKILL.md',
    description: 'Creación de diapositivas PowerPoint (.pptx) para diferentes rubros (Ingeniería, Gestión de Riesgos, Proyectos, Directorio) con kpis, gráficos, esquemas y tablas.'
  },
  {
    id: 'manage-photo-evidence-gallery',
    name: 'Galería de Evidencias Fotográficas',
    domain: 'visual-qa',
    path: 'skills/manage-photo-evidence-gallery/SKILL.md',
    description: 'Alineación 1:1 entre puntos de medición y fotografías, detección de rotaciones incorrectas y control de nitidez.'
  },
  {
    id: 'research-normative-criterion',
    name: 'Investigación de Criterios Normativos',
    domain: 'normative-research',
    path: 'skills/research-normative-criterion/SKILL.md',
    description: 'Verificación de fuentes IEEE 80, IEEE 81, AEA 90364 y CENELEC EN 50522 con citas formales de edición y cláusula.'
  },
  {
    id: 'validate-technical-traceability',
    name: 'Validación de Trazabilidad Técnica',
    domain: 'quality-assurance',
    path: 'skills/validate-technical-traceability/SKILL.md',
    description: 'Mapeo bidireccional entre lecturas de campo, hallazgos técnicos, criterios de aceptación y conclusiones del informe.'
  }
];
