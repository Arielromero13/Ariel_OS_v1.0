import React, { useState } from 'react';
import { WorkItem } from '../types';
import { ModelConfig, ModelProvider, HarnessExecutionResult } from '../harness/types';
import { ArielHarnessEngine } from '../harness/core/harnessEngine';
import { Cpu, Play, AlertTriangle, X, Terminal, ShieldAlert, Sparkles, Code2, Bot } from 'lucide-react';

interface HarnessStudioModalProps {
  workItem: WorkItem;
  onUpdateWorkItem: (updated: WorkItem) => void;
  onClose: () => void;
}

const CONNECTORS: Array<{ id: ModelProvider; title: string; detail: string; icon: typeof Cpu }> = [
  { id: 'simulator', title: 'Simulador de navegador', detail: 'Solo visualización; no cambia estados ni crea evidencia.', icon: Cpu },
  { id: 'native_codex_cli', title: 'Codex CLI worker', detail: 'Requiere worker autorizado; no está conectado desde este navegador.', icon: Code2 },
  { id: 'native_claude_code', title: 'Claude Code worker', detail: 'Requiere worker autorizado; no está conectado desde este navegador.', icon: Bot },
  { id: 'native_antigravity', title: 'Antigravity worker', detail: 'Requiere integración documentada y worker autorizado.', icon: Sparkles },
  { id: 'openai', title: 'OpenAI API', detail: 'Solo mediante backend seguro; no acepta claves en esta interfaz.', icon: Code2 },
  { id: 'gemini', title: 'Gemini API', detail: 'Solo mediante backend seguro; no acepta claves en esta interfaz.', icon: Sparkles },
];

export const HarnessStudioModal: React.FC<HarnessStudioModalProps> = ({ workItem, onUpdateWorkItem, onClose }) => {
  const [provider, setProvider] = useState<ModelProvider>('simulator');
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<HarnessExecutionResult[]>([]);

  const handleRun = async () => {
    setIsRunning(true);
    const config: ModelConfig = {
      provider,
      modelName: provider === 'simulator' ? 'Ariel OS Browser Simulation' : 'Worker not configured',
      executionMode: 'browser_simulation',
      temperature: 0.2,
      maxTokens: 1024,
    };

    const result = await new ArielHarnessEngine(config).executeNextStage(workItem);
    setExecutionLogs((previous) => [result, ...previous]);
    onUpdateWorkItem(result.updatedWorkItem);
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30"><Cpu className="w-5 h-5" /></div>
            <div>
              <h2 className="text-base font-bold text-white">Arnés de Ejecución — Frontera de Seguridad</h2>
              <p className="text-xs text-slate-400">El navegador es un Control Room; los modelos y CLIs se ejecutan únicamente en workers autorizados.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="flex gap-3 p-4 rounded-xl border border-amber-700/70 bg-amber-950/30 text-amber-100 text-xs">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
            <p><strong>Modo prototipo / simulación.</strong> Ninguna opción de esta pantalla puede aprobar una etapa, emitir un reporte, enviar credenciales ni ejecutar una sesión nativa desde el navegador.</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Conector declarado</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CONNECTORS.map((connector) => {
                const Icon = connector.icon;
                const selected = provider === connector.id;
                return (
                  <button key={connector.id} onClick={() => setProvider(connector.id)}
                    className={selected ? 'p-3.5 rounded-xl border border-sky-500 bg-sky-950/40 ring-2 ring-sky-500/40 text-left' : 'p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/40 text-left'}>
                    <Icon className="w-5 h-5 text-sky-300 mb-3" />
                    <div className="text-xs font-bold text-white">{connector.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{connector.detail}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Expediente: <span className="font-mono text-sky-400">{workItem.case.case_id}</span><br />
              El resultado se registrará como intento de simulación sin cambio de estado.
            </div>
            <button onClick={handleRun} disabled={isRunning} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer">
              <Play className="w-4 h-4 fill-current" /><span>{isRunning ? 'Registrando simulación...' : 'Ejecutar simulación segura'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2"><Terminal className="w-4 h-4 text-sky-400" />Registro de intentos</h3>
            {executionLogs.length === 0 ? (
              <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center text-xs text-slate-500 italic">Aún no hay simulaciones registradas.</div>
            ) : executionLogs.map((log, index) => (
              <div key={index} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300"><strong>{log.stageId}</strong><span>{log.modelResponse.provider}</span></div>
                <div className="p-3 rounded bg-slate-900 text-slate-300">{log.modelResponse.rawTextResponse}</div>
                {log.blockingReasons.map((reason, reasonIndex) => <div key={reasonIndex} className="flex gap-2 text-amber-300"><AlertTriangle className="w-4 h-4 shrink-0" />{reason}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarnessStudioModal;
