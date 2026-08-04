import React, { useState } from 'react';
import { WorkItem } from '../types';
import { ModelConfig, ModelProvider, HarnessExecutionResult } from '../harness/types';
import { ArielHarnessEngine } from '../harness/core/harnessEngine';
import { Cpu, Play, CheckCircle2, AlertTriangle, X, Terminal, ShieldAlert, Sparkles, Key, Code2, Bot, Cloud } from 'lucide-react';

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
      case 'native_codex_cloud':
        setModelName('OpenAI Codex Cloud (sandbox aislado)');
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
    <div className="fixed inset-0 z-50 bg-ink-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-ink-900 border border-ink-700 rounded-lg max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-ink-700 flex items-center justify-between bg-ink-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-signal-500/20 text-signal-400 border border-signal-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                Arnés de Ejecución Adaptable (Ariel Harness OS)
              </h2>
              <p className="text-xs text-ink-300">
                Conectores intercambiables de modelos (Gemini, OpenAI/Codex, Claude Code, Simulador Local)
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

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Model Selector Cards */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-300 block">
              1. Seleccionar Conector de Modelo
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  id: 'native_antigravity',
                  title: 'Google Antigravity (nativo)',
                  badge: 'Sin API key',
                  desc: 'Sesión local del entorno Antigravity / Gemini Core',
                  icon: Sparkles,
                  accent: 'signal',
                },
                {
                  id: 'native_claude_code',
                  title: 'Claude Code (nativo, headless)',
                  badge: 'Sin API key',
                  desc: "Invoca 'claude -p' localmente. Cae a simulación si el binario no está en el PATH.",
                  icon: Bot,
                  accent: 'note',
                },
                {
                  id: 'native_codex_cli',
                  title: 'Codex CLI (nativo, local)',
                  badge: 'Sin API key',
                  desc: 'Sesión ambiental local de OpenAI Codex CLI',
                  icon: Code2,
                  accent: 'pass',
                },
                {
                  id: 'native_codex_cloud',
                  title: 'Codex Cloud',
                  badge: 'Sandbox aislado',
                  desc: 'Contenedor aislado en infraestructura de OpenAI. Salida siempre en PR — no toca el sistema local.',
                  icon: Cloud,
                  accent: 'pass',
                },
                {
                  id: 'gemini',
                  title: 'Google Gemini API',
                  badge: 'Requiere API key',
                  desc: 'Servicio REST — gemini-2.5-flash',
                  icon: Sparkles,
                  accent: 'neutral',
                },
                {
                  id: 'openai',
                  title: 'OpenAI GPT-4o API',
                  badge: 'Requiere API key',
                  desc: 'Servicio REST — api.openai.com',
                  icon: Code2,
                  accent: 'neutral',
                },
                {
                  id: 'claude',
                  title: 'Claude API',
                  badge: 'Requiere API key',
                  desc: 'Servicio REST — api.anthropic.com',
                  icon: Bot,
                  accent: 'neutral',
                },
                {
                  id: 'simulator',
                  title: 'Simulador local',
                  badge: 'Determinístico',
                  desc: 'Verificación offline, sin conexión de red',
                  icon: Cpu,
                  accent: 'pending',
                },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = provider === m.id;
                const accentText: Record<string, string> = {
                  signal: 'text-signal-400',
                  note: 'text-note-400',
                  pass: 'text-pass-400',
                  pending: 'text-pending-400',
                  neutral: 'text-ink-300',
                };
                return (
                  <button
                    key={m.id}
                    onClick={() => handleProviderChange(m.id as ModelProvider)}
                    className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-ink-850 border-signal-500'
                        : 'bg-ink-900 border-ink-700 hover:border-ink-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4.5 h-4.5 ${accentText[m.accent]}`} />
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-ink-950 border border-ink-700 text-ink-300">
                        {m.badge}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-medium text-ink-50">{m.title}</div>
                      <div className="text-[11px] text-ink-400 mt-0.5">{m.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Config & Execution Trigger */}
          <div className="bg-ink-900 p-4 rounded-lg border border-ink-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div>
                <label className="text-xs font-medium text-ink-300 block mb-1">Nombre de modelo</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full bg-ink-950 border border-ink-700 rounded p-2 text-xs text-ink-50 focus:outline-none focus:border-signal-500 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-ink-300 block mb-1">
                  API key opcional — si se omite, usa variable de entorno o simulador
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-ink-400 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-ink-950 border border-ink-700 rounded pl-8 p-2 text-xs text-ink-50 focus:outline-none focus:border-signal-500 font-mono"
                  />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between border-t border-ink-700 pt-3">
              <div className="text-xs text-ink-400">
                Expediente <span className="font-mono text-signal-400">{workItem.case.case_id}</span> · estado <span className="font-mono text-pending-300">{workItem.lifecycle.status}</span>
              </div>

              <button
                onClick={handleRunEngineTurn}
                disabled={isRunning || workItem.lifecycle.status === 'blocked'}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-signal-600 hover:bg-signal-500 disabled:opacity-50 text-ink-950 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'Ejecutando…' : 'Ejecutar siguiente turno'}</span>
              </button>
            </div>
          </div>

          {/* Execution Output Console */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-signal-400" />
              Consola de Salida del Arnés & Logs de Ejecución
            </h3>

            {executionLogs.length > 0 ? (
              <div className="space-y-3">
                {executionLogs.map((log, idx) => (
                  <div key={idx} className="bg-ink-950 p-4 rounded-lg border border-ink-700 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between border-b border-ink-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-signal-950 text-signal-400 border border-signal-800 font-semibold uppercase">
                          {log.modelResponse.provider}
                        </span>
                        <span className="text-ink-200 font-sans font-semibold">
                          Etapa: {log.stageId} (Rol: {log.roleId})
                        </span>
                      </div>
                      <span className="text-ink-400 text-[11px]">
                        {log.modelResponse.executionTimeMs} ms
                      </span>
                    </div>

                    <div className="text-ink-200 bg-ink-900/80 p-2.5 rounded border border-ink-700/80 font-sans leading-relaxed">
                      {log.modelResponse.rawTextResponse}
                    </div>

                    {log.blockingReasons.length > 0 && (
                      <div className="bg-fail-950/40 border border-fail-800 p-2 rounded text-fail-300 space-y-1">
                        <strong className="text-fail-400 font-sans">Bloqueos de Emisión (Gate Failed):</strong>
                        {log.blockingReasons.map((r, i) => (
                          <div key={i}>• {r}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-ink-950 p-8 rounded-lg border border-ink-700 text-center text-xs text-ink-400 italic">
                Presione "Ejecutar Siguiente Turno en Arnés" para probar la interacción entre el núcleo de reglas y el conector de modelo seleccionado.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
