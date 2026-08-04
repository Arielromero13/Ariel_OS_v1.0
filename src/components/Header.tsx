import React from 'react';
import { WorkItem, LifecycleStatus } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Lock,
  UserCheck,
  FileCheck,
  FileStack,
  Cpu,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  workItems: WorkItem[];
  activeWorkItem: WorkItem;
  onSelectWorkItem: (taskId: string) => void;
  onNewWorkItem: () => void;
  onOpenReportManifest: () => void;
  onOpenHarnessStudio: () => void;
  onOpenTemplateWizard: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: 'chatdev', label: 'Consola multiagente' },
  { id: 'workflow', label: 'Etapas y handoffs' },
  { id: 'measurements', label: 'Matriz de mediciones' },
  { id: 'normative', label: 'Criterios normativos' },
  { id: 'architecture', label: 'Catálogo de agentes' },
];

export const Header: React.FC<HeaderProps> = ({
  workItems,
  activeWorkItem,
  onSelectWorkItem,
  onOpenReportManifest,
  onOpenHarnessStudio,
  onOpenTemplateWizard,
  activeTab,
  setActiveTab,
}) => {
  const status = activeWorkItem.lifecycle.status;
  const cycles = activeWorkItem.lifecycle.iteration_count;

  const getStatusBadge = (st: LifecycleStatus) => {
    switch (st) {
      case 'ready_for_emission':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-pass-950 text-pass-300 border border-pass-900">
            <CheckCircle2 className="w-3.5 h-3.5" /> Lista para emisión
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-pending-950 text-pending-300 border border-pending-900">
            <RefreshCw className="w-3.5 h-3.5" /> En revisión
          </span>
        );
      case 'no_emit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-fail-950 text-fail-300 border border-fail-900">
            <ShieldAlert className="w-3.5 h-3.5" /> No emitir
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-fail-950 text-fail-300 border border-fail-900">
            <Lock className="w-3.5 h-3.5" /> Bloqueado — 3 ciclos agotados
          </span>
        );
      case 'complete':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-signal-950 text-signal-300 border border-signal-900">
            <ShieldCheck className="w-3.5 h-3.5" /> Completado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-ink-800 text-ink-200 border border-ink-600">
            {st.replace(/_/g, ' ')}
          </span>
        );
    }
  };

  return (
    <header className="bg-ink-950 border-b border-ink-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between py-3.5 gap-3">

          {/* Marca */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-md bg-ink-900 border border-signal-800 flex items-center justify-center text-signal-400">
              <ShieldCheck className="w-4.5 h-4.5" strokeWidth={2.25} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-[15px] font-semibold tracking-tight text-ink-50">Ariel Agent OS</h1>
                <span className="font-mono text-[10px] text-ink-400">v0.2.0</span>
              </div>
              <p className="text-[11px] text-ink-400 leading-tight">Verificación P.A.T. — oficina técnica digital portable</p>
            </div>
          </div>

          {/* Expediente activo + estado */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex items-center gap-2 bg-ink-900 border border-ink-700 rounded-md pl-3 pr-7 py-1.5">
              <span className="text-[11px] text-ink-400 shrink-0">Expediente</span>
              <select
                value={activeWorkItem.task_id}
                onChange={(e) => onSelectWorkItem(e.target.value)}
                className="appearance-none bg-transparent text-ink-50 text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
              >
                {workItems.map((item) => (
                  <option key={item.task_id} value={item.task_id} className="bg-ink-900 text-ink-50 font-sans">
                    {item.case.case_id} · rev. {item.case.revision_id} — {item.case.plant_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-ink-400 absolute right-2.5 pointer-events-none" />
            </div>

            {getStatusBadge(status)}

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border ${
                cycles >= 3
                  ? 'bg-fail-950 text-fail-300 border-fail-900'
                  : cycles > 0
                  ? 'bg-pending-950 text-pending-300 border-pending-900'
                  : 'bg-ink-900 text-ink-300 border-ink-700'
              }`}
              title="Ciclos de corrección consumidos (máximo 3)"
            >
              <RefreshCw className="w-3 h-3" />
              {cycles}/3
            </div>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border ${
                activeWorkItem.human_approval_received
                  ? 'bg-pass-950 text-pass-300 border-pass-900'
                  : 'bg-ink-900 text-ink-400 border-ink-700'
              }`}
              title="Aprobación humana registrada antes de emisión"
            >
              <UserCheck className="w-3.5 h-3.5" />
              {activeWorkItem.human_approval_received ? 'Aprobado' : 'Sin aprobar'}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenTemplateWizard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ink-900 hover:bg-ink-800 text-ink-100 text-xs font-medium border border-ink-700 transition-colors"
              title="Cargar expediente desde plantillas .docx / .xlsx"
            >
              <FileStack className="w-3.5 h-3.5" />
              Nuevo expediente
            </button>
            <button
              onClick={onOpenHarnessStudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ink-900 hover:bg-ink-800 text-ink-100 text-xs font-medium border border-ink-700 transition-colors"
              title="Configurar arnés de ejecución y conectores"
            >
              <Cpu className="w-3.5 h-3.5" />
              Arnés
            </button>
            <button
              onClick={onOpenReportManifest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-signal-600 hover:bg-signal-500 text-ink-950 text-xs font-semibold transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Manifiesto
            </button>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex items-center gap-1 border-t border-ink-800 -mb-px overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 text-xs whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-signal-400 border-signal-500 font-medium'
                  : 'text-ink-400 border-transparent hover:text-ink-200 hover:border-ink-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
