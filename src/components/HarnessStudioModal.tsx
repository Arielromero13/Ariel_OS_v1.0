import React, { useState } from 'react';
import { WorkItem } from '../types';
import { ModelConfig, ModelProvider, HarnessExecutionResult } from '../harness/types';
import { ArielHarnessEngine } from '../harness/core/harnessEngine';
import { Cpu, Play, CheckCircle2, AlertTriangle, X, Terminal, ShieldAlert, Sparkles, Key, Code2, Bot } from 'lucide-react';

interface HarnessStudioModalProps {
  workItem: WorkItem;
  onUpdateWorkItem: (updated: WorkItem) => void;
  onClose: () => void;
}

export const HarnessStudioModal: React.FC<HarnessStudioModalProps> = ({ workItem, onUpdateWorkItem, onClose }) => {
  const [provider, setProvider] = useState<ModelProvider>('gemini');
  const [modelName, setModelName] = useState<string>('gemini-2.5-flash');
  const [apiKey, setApiKey] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<HarnessExecutionResult[]>([]);

  const handleProviderChange = (newProvider: ModelProvider) => {
    setProvider(newProvider);
    switch (newProvider) {
      case 'native_antigravity':
        setModelName('Google Antigravity Agent Session (Gemini 2.5 Native Core)');
        break;
      case 'native_claude_code':
        setModelName('Claude Code CLI Ambient Session');
        break;
      case 'native_codex_cli':
        setModelName('OpenAI Codex CLI Local Runner');
        break;
      case 'gemini':
        setModelName('gemini-2.5-flash');
        break;
      case 'openai':
        setModelName('gpt-4o');
        break;
      case 'claude':
        setModelName('claude-3-5-sonnet-20241022');
        break;
      case 'simulator':
        setModelName('Ariel-Deterministic-Simulator');
        break;
    }
  };

  const handleRunEngineTurn = async () => {
    setIsRunning(true);
    const config: ModelConfig = {
      provider,
      modelName,
      apiKey: apiKey.trim() || undefined,
      temperature: 0.2,
      maxTokens: 1024,
    };

    const engine = new ArielHarnessEngine(config);
    const result = await engine.executeNextStage(workItem);

    setExecutionLogs((prev) => [result, ...prev]);
    onUpdateWorkItem(result.updatedWorkItem);
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Arnés de Ejecución Adaptable (Ariel Harness OS)
              </h2>
              <p className="text-xs text-slate-400">
                Conectores intercambiables de modelos (Gemini, OpenAI/Codex, Claude Code, Simulador Local)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Model Selector Cards */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              1. Seleccionar Conector de Modelo
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  id: 'native_antigravity',
                  title: 'Google Antigravity (Nativo)',
                  badge: 'Sin API Key',
                  desc: 'Entorno de ejecución IDE Antigravity / Gemini Core ambient session',
                  icon: Sparkles,
                  color: 'from-sky-500/20 to-blue-600/20 border-sky-500/40 text-sky-300',
                },
                {
                  id: 'native_claude_code',
                  title: 'Claude Code CLI (Nativo)',
                  badge: 'Sin API Key',
                  desc: 'Subproceso local de la herramienta Claude Code CLI activa',
                  icon: Bot,
                  color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/40 text-purple-300',
                },
                {
                  id: 'native_codex_cli',
                  title: 'OpenAI Codex CLI (Nativo)',
                  badge: 'Sin API Key',
                  desc: 'Subproceso local y sesión activa de OpenAI Codex / ChatGPT',
                  icon: Code2,
                  color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300',
                },
                {
                  id: 'gemini',
                  title: 'Google Gemini API',
                  badge: 'Requiere API Key',
                  desc: 'Servicio Web REST gemini-2.5-flash',
                  icon: Sparkles,
                  color: 'from-slate-800 to-slate-900 border-slate-700 text-slate-300',
                },
                {
                  id: 'openai',
                  title: 'OpenAI GPT-4o API',
                  badge: 'Requiere API Key',
                  desc: 'Servicio Web REST api.openai.com',
                  icon: Code2,
                  color: 'from-slate-800 to-slate-900 border-slate-700 text-slate-300',
                },
                {
                  id: 'simulator',
                  title: 'Simulador Local OS',
                  badge: 'Determinístico',
                  desc: 'Verificación offline sin conexión',
                  icon: Cpu,
                  color: 'from-amber-500/20 to-orange-600/20 border-amber-500/40 text-amber-300',
                },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = provider === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleProviderChange(m.id as ModelProvider)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? `bg-gradient-to-br ${m.color} ring-2 ring-sky-400 shadow-lg`
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold">
                        {m.badge}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white">{m.title}</div>
                      <div className="text-[11px] text-slate-400">{m.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Config & Execution Trigger */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre de Modelo:</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  API Key Opcional (Si se omite usa variable de entorno o simulador):
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-slate-900 border border-slate-800 rounded pl-8 p-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
              <div className="text-xs text-slate-400">
                Expediente: <span className="font-mono text-sky-400 font-semibold">{workItem.case.case_id}</span> | Estado: <span className="font-mono text-amber-300">{workItem.lifecycle.status}</span>
              </div>

              <button
                onClick={handleRunEngineTurn}
                disabled={isRunning || workItem.lifecycle.status === 'blocked'}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg shadow-sky-600/30 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'Ejecutando en Arnés...' : 'Ejecutar Siguiente Turno en Arnés'}</span>
              </button>
            </div>
          </div>

          {/* Execution Output Console */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              Consola de Salida del Arnés & Logs de Ejecución
            </h3>

            {executionLogs.length > 0 ? (
              <div className="space-y-3">
                {executionLogs.map((log, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-bold uppercase">
                          {log.modelResponse.provider}
                        </span>
                        <span className="text-slate-300 font-sans font-semibold">
                          Etapa: {log.stageId} (Rol: {log.roleId})
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px]">
                        {log.modelResponse.executionTimeMs} ms
                      </span>
                    </div>

                    <div className="text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800/80 font-sans leading-relaxed">
                      {log.modelResponse.rawTextResponse}
                    </div>

                    {log.blockingReasons.length > 0 && (
                      <div className="bg-rose-950/40 border border-rose-800 p-2 rounded text-rose-300 space-y-1">
                        <strong className="text-rose-400 font-sans">Bloqueos de Emisión (Gate Failed):</strong>
                        {log.blockingReasons.map((r, i) => (
                          <div key={i}>• {r}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center text-xs text-slate-500 italic">
                Presione "Ejecutar Siguiente Turno en Arnés" para probar la interacción entre el núcleo de reglas y el conector de modelo seleccionado.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
