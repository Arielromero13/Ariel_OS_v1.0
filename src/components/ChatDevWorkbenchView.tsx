import React, { useState, useRef, useEffect } from 'react';
import { WorkItem, RoleId, AgentChatMessage } from '../types';
import { AGENTS_CATALOG } from '../data/mockData';
import { Bot, Send, Sparkles, AlertTriangle, ShieldCheck, FileText, CheckCircle2, UserCheck, MessageSquare, Play, HelpCircle, Layers, ArrowRight } from 'lucide-react';

interface ChatDevWorkbenchViewProps {
  workItem: WorkItem;
  onUpdateWorkItem: (updated: WorkItem) => void;
  onOpenHarnessStudio: () => void;
  onOpenTemplateWizard: () => void;
}

export const ChatDevWorkbenchView: React.FC<ChatDevWorkbenchViewProps> = ({
  workItem,
  onUpdateWorkItem,
  onOpenHarnessStudio,
  onOpenTemplateWizard,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [isSimulatingAgentTurn, setIsSimulatingAgentTurn] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const messages = workItem.chat_history || [];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage: AgentChatMessage = {
      id: `MSG-USER-${Date.now()}`,
      senderRole: 'user',
      senderName: 'Usuario / Revisor Humano',
      recipientRole: 'all',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: userInput,
      messageType: 'discussion',
    };

    const updatedHistory = [...messages, userMessage];

    const updatedWorkItem: WorkItem = {
      ...workItem,
      chat_history: updatedHistory,
    };

    onUpdateWorkItem(updatedWorkItem);
    setUserInput('');

    // Trigger simulated agent response after user message
    setTimeout(() => {
      triggerNextAgentTurn(updatedWorkItem);
    }, 600);
  };

  const triggerNextAgentTurn = (currentWorkItem: WorkItem) => {
    setIsSimulatingAgentTurn(true);

    const currentMessages = currentWorkItem.chat_history || [];
    const stages = currentWorkItem.stages;
    const currentStage = stages.find((s) => s.status === 'in_progress' || s.status === 'pending') || stages[stages.length - 1];

    let nextRole: RoleId = currentStage.owner;
    let nextContent = '';
    let messageType: AgentChatMessage['messageType'] = 'discussion';

    switch (nextRole) {
      case 'orchestrator':
        nextContent = `Revisando avance del expediente ${currentWorkItem.case.case_id}. Avanzando etapa "${currentStage.name}". Delegando al Especialista de Dominio.`;
        break;
      case 'domain_specialist':
        nextContent = `Especialista P.A.T. analizando datos de la plantilla ${currentWorkItem.template_config?.title || 'Maestra'}. Se han procesado los puntos de medición y generado los hallazgos en la matriz.`;
        messageType = 'finding_alert';
        break;
      case 'normative_researcher':
        nextContent = `Evaluación normativamente sustentada. Se verifican cláusulas de IEEE 80 y AEA 90364-7-710. La trazabilidad con los requerimientos está asegurada.`;
        break;
      case 'technical_reviewer':
        nextContent = `Verificación técnica completada. Los hallazgos están vinculados a la evidencia. Se requiere aprobación humana para autorizar la compuerta de emisión.`;
        messageType = 'decision_request';
        break;
      case 'integrator':
        {
          const isPPTX = currentWorkItem.template_config?.fileName.toLowerCase().endsWith('.pptx') || currentWorkItem.template_config?.type.includes('pptx');
          nextContent = isPPTX
            ? `Iniciando maquetación del deck de diapositivas en la plantilla PowerPoint (.pptx) "${currentWorkItem.template_config?.fileName}". Generando estructura de slides, kpis visuales y gráficos de tendencia.`
            : `Iniciando integración del entregable en la plantilla .docx "${currentWorkItem.template_config?.fileName || 'Borrador.docx'}". Generando maquetación y tablas completas.`;
        }
        break;
      case 'visual_reviewer':
        {
          const isPPTX = currentWorkItem.template_config?.fileName.toLowerCase().endsWith('.pptx') || currentWorkItem.template_config?.type.includes('pptx');
          nextContent = isPPTX
            ? `Control visual de diapositivas PPTX: Alineación de elementos, fuentes corporativas, contraste de colores e incrustación de fotos/esquemas aprobados.`
            : `Control visual de maquetación: Orientación de fotos verificada a 0°. Márgenes y estilos tipográficos conformes a las reglas AGENTS.md.`;
        }
        break;
      case 'auditor':
        nextContent = `Auditoría final del proceso: Verificando 3 ciclos de corrección y lista de bloqueos. Todo listo para decisión final.`;
        messageType = 'approval_notice';
        break;
      default:
        nextContent = `El agente ${nextRole} ha completado la revisión de su alcance.`;
    }

    const agentMeta = AGENTS_CATALOG.find((a) => a.id === nextRole);

    const agentResponse: AgentChatMessage = {
      id: `MSG-AGENT-${Date.now()}`,
      senderRole: nextRole,
      senderName: agentMeta?.title || nextRole,
      recipientRole: 'all',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: nextContent,
      stageId: currentStage.id,
      messageType: messageType,
    };

    // Update stages in workItem
    const updatedStages = stages.map((st) => {
      if (st.id === currentStage.id) {
        return { ...st, status: 'passed' as const };
      }
      return st;
    });

    const updatedWorkItem: WorkItem = {
      ...currentWorkItem,
      stages: updatedStages,
      chat_history: [...currentMessages, agentResponse],
    };

    onUpdateWorkItem(updatedWorkItem);
    setIsSimulatingAgentTurn(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'orchestrator':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'domain_specialist':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'normative_researcher':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'technical_reviewer':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'integrator':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'visual_reviewer':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'presentation_designer':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'auditor':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'user':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 md:p-6 overflow-hidden max-w-7xl mx-auto w-full">
      
      {/* Left Chat / Conversational Panel */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Top Chat Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Mesa de Trabajo ChatDev Multi-Agente</h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-[10px] text-indigo-300 font-mono">
                  {workItem.template_config?.title || 'Plantilla Maestra'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Discusión en tiempo real entre Orquestador, Especialistas y Revisores de Ariel OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerNextAgentTurn(workItem)}
              disabled={isSimulatingAgentTurn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Siguiente Discusión</span>
            </button>

            <button
              onClick={onOpenHarnessStudio}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-slate-700 cursor-pointer transition"
            >
              Conectores IA
            </button>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((msg) => {
            const isUser = msg.senderRole === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Role Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs border ${getRoleColor(msg.senderRole)}`}>
                  {isUser ? <UserCheck className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl border space-y-2 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-950/60 border-indigo-700 text-indigo-100 rounded-tr-none'
                      : 'bg-slate-900 border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-1.5 text-[11px]">
                    <span className="font-bold text-white">{msg.senderName}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Message Action Prompt if needed */}
                  {msg.requiresUserAction && (
                    <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl space-y-2 mt-2 text-amber-200">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Aclaración Humana Requerida:</span>
                      </div>
                      <p>{msg.actionPrompt}</p>
                    </div>
                  )}

                  {/* Artifact Links */}
                  {msg.artifactsLinked && msg.artifactsLinked.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.artifactsLinked.map((art, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-400 font-mono text-[10px] flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {art}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tus instrucciones o confirma decisiones para el equipo de agentes..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans placeholder:text-slate-500"
          />

          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-lg shadow-indigo-600/30"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Right Sidebar - Active Context & Template Summary */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        
        {/* Template & Intake Info Card */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              Plantilla Activa
            </h3>

            <button
              onClick={onOpenTemplateWizard}
              className="text-[11px] text-indigo-400 hover:underline font-semibold cursor-pointer"
            >
              Cambiar
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-white">
              {workItem.template_config?.title || 'Plantilla Maestra P.A.T.'}
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {workItem.template_config?.description || 'Plantilla de verificación técnica trazable.'}
            </p>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-sky-400">
              {workItem.template_config?.fileName || 'Plantilla_Maestra_PAT_v2.docx'}
            </div>
          </div>
        </div>

        {/* Stage Workflow Pipeline */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex-1 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-400" />
            Workflow de Agentes
          </h3>

          <div className="space-y-2">
            {workItem.stages.map((st, idx) => {
              const isPassed = st.status === 'passed';
              const isInProgress = st.status === 'in_progress';
              return (
                <div
                  key={st.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition ${
                    isPassed
                      ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                      : isInProgress
                      ? 'bg-sky-950/40 border-sky-700 text-sky-200 ring-1 ring-sky-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500">{idx + 1}.</span>
                    <span className="font-semibold text-white">{st.name}</span>
                  </div>

                  <span className="text-[10px] uppercase font-mono font-bold">
                    {st.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Human Approval Status Card */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Aprobación Humana</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                workItem.human_approval_received
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {workItem.human_approval_received ? 'APROBADO' : 'PENDIENTE'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Ningún documento puede ser emitido externamente sin aprobación humana explícita.
          </p>

          <button
            onClick={() => {
              onUpdateWorkItem({
                ...workItem,
                human_approval_received: !workItem.human_approval_received,
              });
            }}
            className={`w-full py-2 rounded-xl font-bold text-xs cursor-pointer transition ${
              workItem.human_approval_received
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
            }`}
          >
            {workItem.human_approval_received ? 'Revocar Aprobación' : 'Registrar Aprobación Humana'}
          </button>
        </div>

      </div>

    </div>
  );
};
