import React from 'react';
import { WorkItem, LifecycleStatus } from '../types';
import { ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, FileCheck, RefreshCw, Lock, Sparkles, UserCheck } from 'lucide-react';

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

export const Header: React.FC<HeaderProps> = ({
  workItems,
  activeWorkItem,
  onSelectWorkItem,
  onNewWorkItem,
  onOpenReportManifest,
  onOpenHarnessStudio,
  onOpenTemplateWizard,
  activeTab,
  setActiveTab
}) => {
  const status = activeWorkItem.lifecycle.status;
  const cycles = activeWorkItem.lifecycle.iteration_count;
  const emissionGate = activeWorkItem.lifecycle.readiness.emission_gate;

  const getStatusBadge = (st: LifecycleStatus) => {
    switch (st) {
      case 'ready_for_emission':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><CheckCircle2 className="w-3.5 h-3.5" /> EMISIÓN LISTA</span>;
      case 'under_review':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> EN REVISIÓN</span>;
      case 'no_emit':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30"><ShieldAlert className="w-3.5 h-3.5" /> NO EMITIR</span>;
      case 'blocked':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600/30 text-red-400 border border-red-500/40"><Lock className="w-3.5 h-3.5" /> BLOQUEADO (3 CYCLES)</span>;
      case 'complete':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30"><ShieldCheck className="w-3.5 h-3.5" /> COMPLETADO</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300 border border-slate-600">{st.toUpperCase().replace('_', ' ')}</span>;
    }
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between py-3 gap-4">
          
          {/* Logo & Workspace Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 border border-sky-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Ariel Agent OS
                  <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">v0.1.0</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">Sistema Portable de Agentes & Verificar Informe P.A.T.</p>
            </div>
          </div>

          {/* Active Work Item Selector & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Selector */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
              <span className="text-slate-400 font-medium">Expediente:</span>
              <select
                value={activeWorkItem.task_id}
                onChange={(e) => onSelectWorkItem(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                {workItems.map((item) => (
                  <option key={item.task_id} value={item.task_id} className="bg-slate-900 text-white">
                    {item.case.case_id} ({item.case.revision_id}) - {item.case.plant_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Lifecycle Status Pill */}
            <div>{getStatusBadge(status)}</div>

            {/* Correction Budget Counter */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${
              cycles >= 3 ? 'bg-red-950/80 text-red-300 border-red-800' : cycles > 0 ? 'bg-amber-950/60 text-amber-300 border-amber-800' : 'bg-slate-900 text-slate-300 border-slate-800'
            }`}>
              <RefreshCw className={`w-3 h-3 ${cycles > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Ciclos: {cycles}/3</span>
            </div>

            {/* Human Approval Indicator */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              activeWorkItem.human_approval_received ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}>
              <UserCheck className="w-3.5 h-3.5" />
              <span>Aprobación Humana: {activeWorkItem.human_approval_received ? 'SÍ' : 'NO'}</span>
            </div>

            {/* Template Intake Wizard Button */}
            <button
              onClick={onOpenTemplateWizard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plantillas .DOCX / .PPTX (Intake Wizard)</span>
            </button>

            {/* Harness Studio Button */}
            <button
              onClick={onOpenHarnessStudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Arnés & Conectores IA</span>
            </button>

            {/* Report Manifest Button */}
            <button
              onClick={onOpenReportManifest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Manifest & Reporte</span>
            </button>

          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 border-t border-slate-800/80 pt-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'chatdev', label: 'ChatDev Console (Multi-Agente)', icon: '💬' },
            { id: 'workflow', label: 'Etapas & Handoffs (OS Workflow)', icon: '⚡' },
            { id: 'measurements', label: 'Matriz de Mediciones & Fotos', icon: '📊' },
            { id: 'normative', label: 'Criterios Normativos (IEEE/AEA)', icon: '📜' },
            { id: 'architecture', label: 'Catálogo de Agentes & Roles', icon: '🧩' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-500 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </header>
  );
};
