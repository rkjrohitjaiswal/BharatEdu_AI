import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchConversations,
  fetchConversationById,
  createConversation,
  deleteConversation,
  sendTutorMessage,
  fetchSubjects,
  fetchTopics,
} from '../services/api';
import { ConversationItem, PreferredLanguage, Subject, Topic } from '../types';
import { TutorHeader } from '../components/tutor/TutorHeader';
import { ConversationList } from '../components/tutor/ConversationList';
import { TutorMessage } from '../components/tutor/TutorMessage';
import { StudentMessage } from '../components/tutor/StudentMessage';
import { TypingIndicator } from '../components/tutor/TypingIndicator';
import { EmptyConversation } from '../components/tutor/EmptyConversation';
import { ChatInput } from '../components/tutor/ChatInput';
import { AlertCircle, X, Sparkles, BookOpen } from 'lucide-react';

export const TutorPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Subject/Topic Filter Context
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  const [language, setLanguage] = useState<PreferredLanguage>(
    user?.preferredLanguage || 'english'
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, sending]);

  // Load Initial Subjects & Conversations
  useEffect(() => {
    loadSubjects();
    loadConversations();
  }, []);

  const loadSubjects = async () => {
    const res = await fetchSubjects();
    if (res.success && res.data) {
      setSubjects(res.data);
    }
  };

  useEffect(() => {
    if (selectedSubjectId) {
      fetchTopics(selectedSubjectId).then((res) => {
        if (res.success && res.data) setTopics(res.data);
      });
    } else {
      setTopics([]);
    }
  }, [selectedSubjectId]);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchConversations();
      if (res.success && res.data) {
        setConversations(res.data);
        if (res.data.length > 0 && !activeConversation) {
          loadSingleConversation(res.data[0]._id || res.data[0].id || '');
        }
      } else {
        setError(res.message || 'Failed to load conversations');
      }
    } catch (err) {
      setError('Failed to reach tutor service');
    } finally {
      setLoading(false);
    }
  };

  const loadSingleConversation = async (id: string) => {
    try {
      const res = await fetchConversationById(id);
      if (res.success && res.data) {
        setActiveConversation(res.data);
        setLanguage(res.data.language || 'english');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConversation = (id: string) => {
    loadSingleConversation(id);
    setMobileDrawerOpen(false);
  };

  const handleNewConversation = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await createConversation({
        title: 'New Learning Doubt',
        subjectId: selectedSubjectId || undefined,
        topicId: selectedTopicId || undefined,
        language,
      });

      if (res.success && res.data) {
        setConversations((prev) => [res.data!, ...prev]);
        setActiveConversation(res.data);
      }
    } catch (err) {
      setError('Failed to create new conversation');
    } finally {
      setLoading(false);
      setMobileDrawerOpen(false);
    }
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await deleteConversation(id);
      if (res.success) {
        setConversations((prev) => prev.filter((c) => (c._id || c.id) !== id));
        if (activeConversation && (activeConversation._id || activeConversation.id) === id) {
          setActiveConversation(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation', err);
    }
  };

  const handleSendMessage = async (text: string) => {
    let currentConvId = activeConversation?._id || activeConversation?.id;

    // Auto-create conversation if none exists
    if (!currentConvId) {
      const newRes = await createConversation({
        title: text.length > 30 ? `${text.substring(0, 30)}...` : text,
        subjectId: selectedSubjectId || undefined,
        topicId: selectedTopicId || undefined,
        language,
      });
      if (newRes.success && newRes.data) {
        currentConvId = newRes.data._id || newRes.data.id;
        setActiveConversation(newRes.data);
        setConversations((prev) => [newRes.data!, ...prev]);
      } else {
        setError('Failed to initiate conversation context.');
        return;
      }
    }

    setSending(true);
    setNotice(null);
    setError(null);

    // Optimistic student message push
    const tempMessage = {
      role: 'student' as const,
      content: text,
      timestamp: new Date().toISOString(),
    };

    setActiveConversation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, tempMessage],
      };
    });

    try {
      const res = await sendTutorMessage(currentConvId!, {
        content: text,
        subjectId: selectedSubjectId || undefined,
        topicId: selectedTopicId || undefined,
        language,
      });

      if (res.success && res.data) {
        const convData = (res.data as any).conversation || res.data;
        setActiveConversation(convData);
        setConversations((prev) =>
          prev.map((c) => ((c._id || c.id) === convData._id ? convData : c))
        );
      } else {
        setError(res.message || 'Failed to generate tutor response.');
      }
    } catch (err) {
      setError('Network error sending message to tutor service');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex gap-6 relative overflow-hidden">
      {/* Sidebar Conversation History (Desktop) */}
      <div className="hidden lg:block w-72 shrink-0 h-full">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?._id || activeConversation?.id || null}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      {/* Mobile Drawer (Collapsible) */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-80 max-w-[80vw] h-full p-2 bg-slate-900 shadow-xl">
            <div className="flex items-center justify-between p-3 border-b border-slate-800 text-white font-bold text-sm">
              <span>Conversation History</span>
              <button onClick={() => setMobileDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversation?._id || activeConversation?.id || null}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)}></div>
        </div>
      )}

      {/* Main AI Tutor Workspace */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col h-full shadow-sm overflow-hidden">
        {/* Header */}
        <TutorHeader
          currentLanguage={language}
          onLanguageChange={setLanguage}
          onNewConversation={handleNewConversation}
          onToggleMobileDrawer={() => setMobileDrawerOpen(true)}
        />

        {/* Optional Subject & Topic Filter Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-3 text-xs overflow-x-auto shrink-0">
          <span className="font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Curriculum Context:
          </span>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none shrink-0"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>

          {topics.length > 0 && (
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none shrink-0"
            >
              <option value="">All Topics</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Notice Alert Box */}
        {notice && (
          <div className="bg-sky-50 border-b border-sky-200 p-2.5 px-4 text-xs text-sky-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{notice}</span>
            </div>
            <button onClick={() => setNotice(null)} className="text-sky-600 hover:text-sky-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-2.5 px-4 text-xs text-red-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <EmptyConversation onSelectPrompt={handleSendMessage} />
          ) : (
            activeConversation.messages.map((msg, idx) => (
              <React.Fragment key={idx}>
                {msg.role === 'student' ? (
                  <StudentMessage message={msg} />
                ) : (
                  <TutorMessage message={msg} />
                )}
              </React.Fragment>
            ))
          )}

          {sending && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} loading={sending} />
      </div>
    </div>
  );
};
