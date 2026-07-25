import React, { useState } from 'react';
import { INITIAL_WORK_ITEMS } from './data/mockData';
import { WorkItem } from './types';
import { Header } from './components/Header';
import { ChatDevWorkbenchView } from './components/ChatDevWorkbenchView';
import { WorkItemsView } from './components/WorkItemsView';
import { WorkflowStudioView } from './components/WorkflowStudioView';
import { MeasurementMatrixView } from './components/MeasurementMatrixView';
import { NormativeRegistryView } from './components/NormativeRegistryView';
import { SystemRegistryView } from './components/SystemRegistryView';
import { ReportManifestModal } from './components/ReportManifestModal';
import { HarnessStudioModal } from './components/HarnessStudioModal';
import { TemplateIntakeWizardModal } from './components/TemplateIntakeWizardModal';

export const App: React.FC = () => {
  const [workItems, setWorkItems] = useState<WorkItem[]>(INITIAL_WORK_ITEMS);
  const [activeTaskId, setActiveTaskId] = useState<string>(INITIAL_WORK_ITEMS[0].task_id);
  const [activeTab, setActiveTab] = useState<string>('chatdev');
  const [isReportManifestOpen, setIsReportManifestOpen] = useState<boolean>(false);
  const [isHarnessStudioOpen, setIsHarnessStudioOpen] = useState<boolean>(false);
  const [isTemplateWizardOpen, setIsTemplateWizardOpen] = useState<boolean>(false);

  const activeWorkItem = workItems.find((w) => w.task_id === activeTaskId) || workItems[0];

  const handleUpdateActiveWorkItem = (updated: WorkItem) => {
    setWorkItems((prev) => prev.map((w) => (w.task_id === updated.task_id ? updated : w)));
  };

  const handleCreateNewWorkItem = () => {
    const nextNum = workItems.length + 1;
    const newTaskId = `TASK-PAT-2026-00${nextNum}`;
    const newWorkItem: WorkItem = {
      ...INITIAL_WORK_ITEMS[0],
      task_id: newTaskId,
      case: {
        case_id: `CASE-PAT-2026-00${nextNum}`,
        revision_id: 'R0',
        based_on_revision: null,
        revision_reason: 'Nueva inspección de P.A.T. programada',
        plant_name: `Planta Industrial Sector 0${nextNum}`,
        location: 'Área Subestación Secundaria'
      },
      lifecycle: {
        status: 'draft',
        iteration_count: 0,
        readiness: {
          execution_gate: 'passed',
          emission_gate: 'not_evaluated',
          blocking_reasons: ['Expediente recién creado. En fase de carga de datos.']
        }
      },
      human_approval_received: false
    };

    setWorkItems((prev) => [...prev, newWorkItem]);
    setActiveTaskId(newTaskId);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Header Bar */}
      <Header
        workItems={workItems}
        activeWorkItem={activeWorkItem}
        onSelectWorkItem={setActiveTaskId}
        onNewWorkItem={handleCreateNewWorkItem}
        onOpenReportManifest={() => setIsReportManifestOpen(true)}
        onOpenHarnessStudio={() => setIsHarnessStudioOpen(true)}
        onOpenTemplateWizard={() => setIsTemplateWizardOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 flex flex-col">
        {activeTab === 'chatdev' && (
          <ChatDevWorkbenchView
            workItem={activeWorkItem}
            onUpdateWorkItem={handleUpdateActiveWorkItem}
            onOpenHarnessStudio={() => setIsHarnessStudioOpen(true)}
            onOpenTemplateWizard={() => setIsTemplateWizardOpen(true)}
          />
        )}

        {activeTab === 'workflow' && (
          <WorkflowStudioView
            workItem={activeWorkItem}
            onUpdateWorkItem={handleUpdateActiveWorkItem}
          />
        )}

        {activeTab === 'measurements' && (
          <MeasurementMatrixView
            workItem={activeWorkItem}
            onUpdateWorkItem={handleUpdateActiveWorkItem}
          />
        )}

        {activeTab === 'normative' && (
          <NormativeRegistryView
            workItem={activeWorkItem}
            onUpdateWorkItem={handleUpdateActiveWorkItem}
          />
        )}

        {activeTab === 'workitem' && (
          <WorkItemsView
            workItem={activeWorkItem}
            onUpdateWorkItem={handleUpdateActiveWorkItem}
          />
        )}

        {activeTab === 'architecture' && (
          <SystemRegistryView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>Ariel Agent OS — Portable Agent OS Framework | P.A.T. Verification Workbench</p>
      </footer>

      {/* Report Manifest Modal */}
      {isReportManifestOpen && (
        <ReportManifestModal
          workItem={activeWorkItem}
          onClose={() => setIsReportManifestOpen(false)}
        />
      )}

      {/* Harness Studio Modal */}
      {isHarnessStudioOpen && (
        <HarnessStudioModal
          workItem={activeWorkItem}
          onUpdateWorkItem={handleUpdateActiveWorkItem}
          onClose={() => setIsHarnessStudioOpen(false)}
        />
      )}

      {/* Template Intake Wizard Modal */}
      {isTemplateWizardOpen && (
        <TemplateIntakeWizardModal
          onComplete={(newWorkItem) => {
            setWorkItems((prev) => [newWorkItem, ...prev]);
            setActiveTaskId(newWorkItem.task_id);
            setIsTemplateWizardOpen(false);
            setActiveTab('chatdev');
          }}
          onClose={() => setIsTemplateWizardOpen(false)}
        />
      )}

    </div>
  );
};

export default App;
