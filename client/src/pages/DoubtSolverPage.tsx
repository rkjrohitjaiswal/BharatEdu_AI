import React, { useEffect, useState } from 'react';
import { HelpCircle, Lightbulb, MessageSquare, Plus, Send, Sparkles, Trash2 } from 'lucide-react';
import {
  createDoubtSession,
  deleteDoubtSession,
  fetchDoubtContext,
  fetchDoubtMessages,
  fetchDoubtRecommendations,
  fetchDoubtSessions,
  sendDoubtMessage,
  solveDoubt,
  startSocraticMode,
  submitDoubtFeedback,
} from '../services/api';
import {
  IDoubtContextClientDTO,
  IDoubtMessageClientDTO,
  IDoubtSessionClientDTO,
  IDoubtSolutionClientDTO,
  ISocraticHintClientDTO,
} from '../types/doubt-solver';
import { DoubtContextCard } from '../components/doubt-solver/DoubtContextCard';
import { StepByStepSolutionCard } from '../components/doubt-solver/StepByStepSolution';

export const DoubtSolverPage: React.FC = () => {
  const [sessions, setSessions] = useState<IDoubtSessionClientDTO[]>([]);
  const [activeSession, setActiveSession] = useState<IDoubtSessionClientDTO | null>(null);
  const [messages, setMessages] = useState<IDoubtMessageClientDTO[]>([]);
  const [context, setContext] = useState<IDoubtContextClientDTO | null>(null);
  const [solution, setSolution] = useState<IDoubtSolutionClientDTO | null>(null);
  const [socraticHint, setSocraticHint] = useState<ISocraticHintClientDTO | null>(null);
  const [inputQuestion, setInputQuestion] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    const [sessRes, recRes] = await Promise.all([fetchDoubtSessions(), fetchDoubtRecommendations()]);
    if (sessRes.success && Array.isArray(sessRes.data) && sessRes.data.length > 0) {
      setSessions(sessRes.data);
      const top = sessRes.data[0];
      setActiveSession(top);
      loadSessionDetails(top.sessionId || top.id);
    }
    if (recRes.success && recRes.data) {
      setRecommendations(recRes.data);
    }
    setLoading(false);
  };

  const loadSessionDetails = async (sessionId: string) => {
    const [msgRes, ctxRes] = await Promise.all([fetchDoubtMessages(sessionId), fetchDoubtContext(sessionId)]);
    if (msgRes.success && Array.isArray(msgRes.data)) {
      setMessages(msgRes.data);
    }
    if (ctxRes.success && ctxRes.data) {
      setContext(ctxRes.data);
    }
  };

  const handleCreateNewSession = async () => {
    const res = await createDoubtSession({ title: 'New Doubt Session' });
    if (res.success && res.data) {
      setSessions((prev) => [res.data, ...prev]);
      setActiveSession(res.data);
      setMessages([]);
      setSolution(null);
      setSocraticHint(null);
    }
  };

  const handleSolveDoubt = async (questionText?: string) => {
    const text = questionText || inputQuestion;
    if (!text.trim() || !activeSession) return;

    setSolving(true);
    setInputQuestion('');

    // Append user message immediately
    const userMsg: IDoubtMessageClientDTO = {
      id: `temp_${Date.now()}`,
      messageId: `msg_${Date.now()}`,
      sessionId: activeSession.sessionId,
      studentId: activeSession.studentId,
      role: 'student',
      content: text,
      explanationLevel: 'standard',
      referencedConceptIds: [],
      referencedTopicIds: [],
      sourceReferences: [],
      generatedBy: 'deterministic',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const solRes = await solveDoubt(activeSession.sessionId || activeSession.id, text);
    if (solRes.success && solRes.data) {
      setSolution(solRes.data);
      // Reload messages to get persisted tutor response
      const msgRes = await fetchDoubtMessages(activeSession.sessionId || activeSession.id);
      if (msgRes.success && Array.isArray(msgRes.data)) {
        setMessages(msgRes.data);
      }
    }
    setSolving(false);
  };

  const handleGetSocraticHint = async () => {
    if (!activeSession) return;
    const text = inputQuestion || 'Provide a guiding hint for this problem';
    const res = await startSocraticMode(activeSession.sessionId || activeSession.id, hintLevel, text);
    if (res.success && res.data) {
      setSocraticHint(res.data);
      setHintLevel((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleDeleteSession = async (id: string) => {
    await deleteDoubtSession(id);
    loadSessions();
  };

  const handleFeedback = async (messageId: string, isHelpful: boolean) => {
    await submitDoubtFeedback(messageId, isHelpful);
    if (activeSession) {
      loadSessionDetails(activeSession.sessionId || activeSession.id);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-black text-slate-900">AI Doubt Solver & Contextual Learning Tutor</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            24/7 academic assistance with step-by-step explanations, Socratic hints, and prerequisite guidance.
          </p>
        </div>

        <button
          onClick={handleCreateNewSession}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Doubt Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Sessions List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Active Doubt Sessions</h3>
          <div className="space-y-2">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => {
                  setActiveSession(sess);
                  loadSessionDetails(sess.sessionId || sess.id);
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  activeSession?.id === sess.id ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                  <h4 className="text-xs font-black text-slate-900 truncate">{sess.title}</h4>
                  <span className="text-[10px] text-slate-500 font-bold">{sess.subject}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(sess.sessionId || sess.id);
                  }}
                  className="p-1 text-slate-400 hover:text-red-600 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Context Card */}
          {context && <DoubtContextCard context={context} />}
        </div>

        {/* Main Conversation & Solver Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Socratic Hint Card if active */}
          {socraticHint && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" /> Socratic Hint (Level {socraticHint.hintLevel + 1})
                </span>
              </div>
              <p className="text-xs font-black text-amber-900">{socraticHint.guidingQuestion}</p>
              <p className="text-xs text-amber-800 leading-relaxed">{socraticHint.hintContent}</p>
              <p className="text-[11px] font-bold text-amber-700">{socraticHint.nextStepPrompt}</p>
            </div>
          )}

          {/* Step By Step Solution if available */}
          {solution && <StepByStepSolutionCard solution={solution} />}

          {/* Messages List */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm min-h-[350px] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-black text-slate-700">Ask your academic question below</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Type any problem from Mathematics, Science, or Computer Science for step-by-step guidance.
                  </p>

                  {/* Suggested Question Chips */}
                  {recommendations?.recommendedQuestions && (
                    <div className="flex flex-wrap justify-center gap-2 pt-3">
                      {recommendations.recommendedQuestions.map((q: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleSolveDoubt(q)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-bold transition border border-slate-200"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl space-y-2 text-xs font-medium leading-relaxed ${
                        msg.role === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-75 font-bold uppercase">
                        <span>{msg.role === 'student' ? 'You' : 'AI Tutor'}</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input & Action Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSolveDoubt()}
                  placeholder="Ask a question or request step-by-step explanation..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
                <button
                  onClick={() => handleSolveDoubt()}
                  disabled={solving || !inputQuestion.trim()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs inline-flex items-center gap-1 transition disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${solving ? 'animate-spin' : ''}`} />
                  <span>Solve</span>
                </button>
                <button
                  onClick={handleGetSocraticHint}
                  className="px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs inline-flex items-center gap-1 transition"
                  title="Socratic Hint Mode"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Hint</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
