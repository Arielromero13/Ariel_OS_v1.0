import React, { useState, useRef, useEffect } from 'react';
import { WorkItem, RoleId, AgentChatMessage } from '../types';
import { AGENTS_CATALOG } from '../data/mockData';
import { Bot, Send, AlertTriangle, ShieldCheck, FileText, CheckCircle2, UserCheck, MessageSquare, Play, HelpCircle, Layers, ArrowRight } from 'lucide-react';

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
        return 'bg-note-500/20 text-note-300 border-note-500/30';
      case 'domain_specialist':
        return 'bg-signal-500/20 text-signal-300 border-signal-500/30';
      case 'normative_researcher':
        return 'bg-pass-500/20 text-pass-300 border-pass-500/30';
      case 'technical_reviewer':
        return 'bg-pending-500/20 text-pending-300 border-pending-500/30';
      case 'integrator':
        return 'bg-signal-500/20 text-signal-300 border-signal-500/30';
      case 'visual_reviewer':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'presentation_designer':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'auditor':
        return 'bg-fail-500/20 text-fail-300 border-fail-500/30';
      case 'user':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      default:
        return 'bg-ink-800 text-ink-200 border-ink-600';
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 md:p-6 overflow-hidden max-w-7xl mx-auto w-full">
      
      {/* Left Chat / Conversational Panel */}
      <div className="flex-1 flex flex-col bg-ink-900 border border-ink-700 rounded-lg overflow-hidden shadow-xl">
        
        {/* Top Chat Bar */}
        <div className="p-4 border-b border-ink-700 bg-ink-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-signal-500/20 text-signal-400 border border-signal-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">Mesa de Trabajo ChatDev Multi-Agente</h2>
                <span className="px-2 py-0.5 rounded-full bg-signal-950 border border-signal-800 text-[10px] text-signal-300 font-mono">
                  {workItem.template_config?.title || 'Plantilla Maestra'}
                </span>
              </div>
              <p className="text-xs text-ink-300">
                Discusión en tiempo real entre Orquestador, Especialistas y Revisores de Ariel OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerNextAgentTurn(workItem)}
              disabled={isSimulatingAgentTurn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-signal-600 hover:bg-signal-500 disabled:opacity-50 text-white text-xs font-semibold transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Siguiente Discusión</span>
            </button>

            <button
              onClick={onOpenHarnessStudio}
              className="px-3 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-signal-300 text-xs font-semibold border border-ink-600 cursor-pointer transition"
            >
              Conectores IA
            </button>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-ink-950/40">
          {messages.map((msg) => {
            const isUser = msg.senderRole === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Role Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-semibold text-xs border ${getRoleColor(msg.senderRole)}`}>
                  {isUser ? <UserCheck className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-lg border space-y-2 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-signal-950/60 border-signal-700 text-signal-100 rounded-tr-none'
                      : 'bg-ink-900 border-ink-700 text-ink-100 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-ink-700/80 pb-1.5 text-[11px]">
                    <span className="font-semibold text-white">{msg.senderName}</span>
                    <span className="text-ink-400 font-mono text-[10px]">{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Message Action Prompt if needed */}
                  {msg.requiresUserAction && (
                    <div className="p-3 bg-pending-950/40 border border-pending-800/80 rounded-lg space-y-2 mt-2 text-pending-200">
                      <div className="flex items-center gap-1.5 font-semibold text-pending-300">
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
                        <span key={i} className="px-2 py-0.5 rounded bg-ink-950 border border-ink-700 text-signal-400 font-mono text-[10px] flex items-center gap-1">
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
        <div className="p-4 border-t border-ink-700 bg-ink-950 flex items-center gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tus instrucciones o confirma decisiones para el equipo de agentes..."
            className="flex-1 bg-ink-900 border border-ink-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-signal-500 font-sans placeholder:text-ink-400"
          />

          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim()}
            className="px-4 py-2.5 rounded-lg bg-signal-600 hover:bg-signal-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition transition-colors"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Right Sidebar - Active Context & Template Summary */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        
        {/* Template & Intake Info Card */}
        <div className="p-4 bg-ink-900 border border-ink-700 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-ink-700 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-signal-400" />
              Plantilla Activa
            </h3>

            <button
              onClick={onOpenTemplateWizard}
              className="text-[11px] text-signal-400 hover:underline font-semibold cursor-pointer"
            >
              Cambiar
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-white">
              {workItem.template_config?.title || 'Plantilla Maestra P.A.T.'}
            </div>
            <p className="text-ink-300 text-[11px] leading-relaxed">
              {workItem.template_config?.description || 'Plantilla de verificación técnica trazable.'}
            </p>

            <div className="p-2.5 bg-ink-950 rounded-lg border border-ink-700 font-mono text-[11px] text-signal-400">
              {workItem.template_config?.fileName || 'Plantilla_Maestra_PAT_v2.docx'}
            </div>
          </div>
        </div>

        {/* Stage Workflow Pipeline */}
        <div className="p-4 bg-ink-900 border border-ink-700 rounded-lg space-y-3 flex-1 overflow-y-auto">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-signal-400" />
            Workflow de Agentes
          </h3>

          <div className="space-y-2">
            {workItem.stages.map((st, idx) => {
              const isPassed = st.status === 'passed';
              const isInProgress = st.status === 'in_progress';
              return (
                <div
                  key={st.id}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition ${
                    isPassed
                      ? 'bg-pass-950/20 border-pass-800/60 text-pass-300'
                      : isInProgress
                      ? 'bg-signal-950/40 border-signal-700 text-signal-200 ring-1 ring-signal-500/50'
                      : 'bg-ink-950/60 border-ink-700 text-ink-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-ink-400">{idx + 1}.</span>
                    <span className="font-semibold text-white">{st.name}</span>
                  </div>

                  <span className="text-[10px] uppercase font-mono font-semibold">
                    {st.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Human Approval Status Card */}
        <div className="p-4 bg-ink-900 border border-ink-700 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-200">Aprobación Humana</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                workItem.human_approval_received
                  ? 'bg-pass-950 text-pass-300 border border-pass-700'
                  : 'bg-fail-950 text-fail-300 border border-fail-800'
              }`}
            >
              {workItem.human_approval_received ? 'APROBADO' : 'PENDIENTE'}
            </span>
          </div>

          <p className="text-[11px] text-ink-300">
            Ningún documento puede ser emitido externamente sin aprobación humana explícita.
          </p>

          <button
            onClick={() => {
              onUpdateWorkItem({
                ...workItem,
                human_approval_received: !workItem.human_approval_received,
              });
            }}
            className={`w-full py-2 rounded-lg font-semibold text-xs cursor-pointer transition ${
              workItem.human_approval_received
                ? 'bg-ink-800 hover:bg-ink-700 text-ink-200'
                : 'bg-pass-600 hover:bg-pass-500 text-white '
            }`}
          >
            {workItem.human_approval_received ? 'Revocar Aprobación' : 'Registrar Aprobación Humana'}
          </button>
        </div>

      </div>

    </div>
  );
};
