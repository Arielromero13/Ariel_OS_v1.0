// Ariel Agent OS TypeScript Definitions

export type LifecycleStatus =
  | 'draft'
  | 'needs_clarification'
  | 'ready'
  | 'in_progress'
  | 'under_review'
  | 'ready_for_emission'
  | 'no_emit'
  | 'blocked'
  | 'complete'
  | 'superseded';

export type GateStatus = 'not_evaluated' | 'passed' | 'failed';

export type RoleId =
  | 'orchestrator'
  | 'domain_specialist'
  | 'normative_researcher'
  | 'technical_reviewer'
  | 'integrator'
  | 'visual_reviewer'
  | 'auditor';

export type CorrectionType = 'patch' | 'partial_rework' | 'full_rework' | 'user_clarification';

export type ReportTemplateType =
  | 'grounding_pat'
  | 'thermography'
  | 'substation_maintenance'
  | 'power_quality'
  | 'executive_pptx_deck'
  | 'technical_pptx_deck'
  | 'custom_docx'
  | 'custom_pptx';

export interface ReportTemplateInfo {
  id: string;
  type: ReportTemplateType;
  title: string;
  version: string;
  fileName: string;
  description: string;
  requiredEvidences: string[];
  applicableStandards: string[];
}

export interface AgentChatMessage {
  id: string;
  senderRole: RoleId | 'user' | 'system';
  senderName: string;
  recipientRole?: RoleId | 'all';
  timestamp: string;
  content: string;
  stageId?: string;
  artifactsLinked?: string[];
  requiresUserAction?: boolean;
  actionPrompt?: string;
  messageType?: 'discussion' | 'handoff' | 'finding_alert' | 'decision_request' | 'approval_notice';
}

export interface CaseInfo {
  case_id: string;
  revision_id: string;
  based_on_revision?: string | null;
  revision_reason: string;
  plant_name: string;
  location: string;
}

export interface RequestInfo {
  objective: string;
  requester?: string | null;
  context?: string | null;
  scope_in: string[];
  scope_out: string[];
}

export interface DefinitionOfDoneItem {
  id: string;
  criterion: string;
  verification_method?: string | null;
  mandatory: boolean;
  completed: boolean;
}

export interface InputManifestItem {
  artifact_id: string;
  name: string;
  location?: string | null;
  role: 'current_evidence' | 'template' | 'historical_reference' | 'normative_source' | 'contextual_reference' | 'output_reference';
  status: 'available' | 'missing' | 'unreadable' | 'superseded';
  authority_note?: string | null;
}

export interface MeasurementPoint {
  id: string;
  point_code: string; // e.g. PAT-01
  location_description: string;
  measured_resistance_ohm: number;
  max_allowed_ohm: number;
  method: '3_point_fall_of_potential' | 'clamp_on' | '4_point_wenner' | 'high_frequency';
  photo_id?: string;
  photo_url?: string;
  photo_rotation_deg: 0 | 90 | 180 | 270;
  photo_legible: boolean;
  status: 'Conforme' | 'No conforme' | 'No concluyente' | 'Pendiente';
  notes?: string;
}

export interface NormativeCriterion {
  id: string;
  standard_name: string; // e.g. IEEE 80-2013
  edition: string;
  clause: string;
  requirement_summary: string;
  max_resistance_threshold_ohm?: number;
  applicability: 'verified' | 'unverified' | 'not_applicable';
  verification_notes: string;
}

export interface TechnicalFinding {
  id: string;
  point_id: string;
  finding_type: 'non_compliance' | 'limitation' | 'observation' | 'conformity';
  title: string;
  description: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
  status: 'open' | 'under_review' | 'resolved' | 'acknowledged';
}

export interface StageState {
  id: string;
  name: string;
  owner: RoleId;
  skill?: string;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'skipped';
  outputsProduced: string[];
  notes?: string;
}

export interface HandoffRecord {
  id: string;
  fromRole: RoleId;
  toRole: RoleId;
  stageId: string;
  timestamp: string;
  artifactsLinked: string[];
  limitations: string[];
  openDecisions: string[];
  specificRequest: string;
}

export interface WorkItem {
  task_id: string;
  case: CaseInfo;
  request: RequestInfo;
  definition_of_done: DefinitionOfDoneItem[];
  input_manifest: InputManifestItem[];
  measurements: MeasurementPoint[];
  normative_criteria: NormativeCriterion[];
  findings: TechnicalFinding[];
  stages: StageState[];
  handoffs: HandoffRecord[];
  lifecycle: {
    status: LifecycleStatus;
    iteration_count: number;
    superseded_by?: string | null;
    readiness: {
      execution_gate: GateStatus;
      emission_gate: GateStatus;
      blocking_reasons: string[];
    };
  };
  open_decisions: string[];
  human_approval_received: boolean;
  template_config?: ReportTemplateInfo;
  chat_history?: AgentChatMessage[];
  audit_decision?: {
    approved: boolean;
    auditor_notes: string;
    decision_timestamp?: string;
  };
}
