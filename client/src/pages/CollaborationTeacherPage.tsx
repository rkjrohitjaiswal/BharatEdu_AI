import React, { useEffect, useState } from 'react';
import {
  fetchTeacherCollaborationThreads,
  fetchThreadDetails,
  sendCollaborationMessage,
  generateCollaborationDraft,
  fetchCollaborationFollowups,
  createCollaborationAction,
} from '../services/api';
import { ICollaborationThreadClient, ICollaborationMessageClient, ICollaborationActionClient, IFollowupRecommendationClient } from '../types/collaboration';

import { CollaborationOverview } from '../components/collaboration/CollaborationOverview';
import { CollaborationThreadList } from '../components/collaboration/CollaborationThreadList';
import { CollaborationMessageList } from '../components/collaboration/CollaborationMessageList';
import { CollaborationMessageComposer } from '../components/collaboration/CollaborationMessageComposer';
import { TeacherMessageDraft } from '../components/collaboration/TeacherMessageDraft';
import { RecipientSelector } from '../components/collaboration/RecipientSelector';
import { FollowupQueue } from '../components/collaboration/FollowupQueue';
import { CollaborationActionCard } from '../components/collaboration/CollaborationActionCard';
import { CollaborationAIInsight } from '../components/collaboration/CollaborationAIInsight';
import { InterventionOutcomeCard } from '../components/collaboration/InterventionOutcomeCard';
import { CollaborationEmptyState } from '../components/collaboration/CollaborationEmptyState';

export const CollaborationTeacherPage: React.FC = () => {
  const [threads, setThreads] = useState<ICollaborationThreadClient[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('');
  const [messages, setMessages] = useState<ICollaborationMessageClient[]>([]);
  const [actions, setActions] = useState<ICollaborationActionClient[]>([]);
  const [followups, setFollowups] = useState<IFollowupRecommendationClient[]>([]);
  const [draft, setDraft] = useState<any | null>(null);
  const [recipient, setRecipient] = useState<'parent' | 'student' | 'both'>('both');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreads();
    loadFollowups();
  }, []);

  const loadThreads = async () => {
    setLoading(true);
    const res = await fetchTeacherCollaborationThreads();
    if (res.success && res.data && res.data.length > 0) {
      setThreads(res.data);
      const firstId = res.data[0].threadId;
      setSelectedThreadId(firstId);
      loadThreadDetails(firstId);
    } else {
      setLoading(false);
    }
  };

  const loadFollowups = async () => {
    const res = await fetchCollaborationFollowups();
    if (res.success && res.data) {
      setFollowups(res.data);
    }
  };

  const loadThreadDetails = async (threadId: string) => {
    const res = await fetchThreadDetails('teacher', threadId);
    if (res.success && res.data) {
      setMessages(res.data.messages || []);
      setActions(res.data.actions || []);
    }
    setLoading(false);
  };

  const handleSelectThread = (id: string) => {
    setSelectedThreadId(id);
    loadThreadDetails(id);
  };

  const handleSendMessage = async (body: string, requiresAck: boolean) => {
    if (!selectedThreadId) return;
    await sendCollaborationMessage('teacher', selectedThreadId, body, undefined, requiresAck);
    loadThreadDetails(selectedThreadId);
    setDraft(null);
  };

  const handleGenerateDraft = async () => {
    const currentThread = threads.find((t) => t.threadId === selectedThreadId);
    const res = await generateCollaborationDraft({
      studentId: currentThread?.studentId || 'student_1',
      subject: currentThread?.subject || 'Mathematics',
      topic: currentThread?.topic,
      recipient,
    });
    if (res.success && res.data) {
      setDraft(res.data);
    }
  };

  if (loading && threads.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading Collaboration Hub...</p>
        </div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
        <CollaborationEmptyState />
      </div>
    );
  }

  const selectedThread = threads.find((t) => t.threadId === selectedThreadId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Overview */}
        <CollaborationOverview
          totalThreads={threads.length}
          openThreads={threads.filter((t) => t.status === 'open' || t.status === 'active').length}
          unacknowledged={messages.filter((m) => m.requiresAcknowledgement).length}
          pendingActions={actions.filter((a) => a.status === 'pending').length}
        />

        {/* AI Insight */}
        <CollaborationAIInsight />

        {/* Action Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thread List Column */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Active Communication Threads</h3>
            <CollaborationThreadList threads={threads} selectedThreadId={selectedThreadId} onSelectThread={handleSelectThread} />
          </div>

          {/* Messages & Composer Column */}
          <div className="lg:col-span-2 space-y-4">
            {selectedThread && (
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedThread.subject}</h3>
                  <p className="text-xs text-slate-400">Student: {selectedThread.studentId} • Topic: {selectedThread.topic || 'General'}</p>
                </div>
                <RecipientSelector recipient={recipient} onChange={setRecipient} />
              </div>
            )}

            {/* AI Draft Preview */}
            {draft && (
              <TeacherMessageDraft
                subject={draft.subject}
                body={draft.body}
                evidence={draft.evidenceUsed}
                onApply={(bodyText) => handleSendMessage(bodyText, true)}
              />
            )}

            {/* Message History */}
            <CollaborationMessageList messages={messages} />

            {/* Composer */}
            <CollaborationMessageComposer onSend={handleSendMessage} onGenerateDraft={handleGenerateDraft} />

            {/* Actions for current thread */}
            {actions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-white">Assigned Intervention Actions</h4>
                {actions.map((act) => (
                  <CollaborationActionCard key={act.actionId} action={act} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Followup Queue & Outcome Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FollowupQueue followups={followups} onSelectThread={handleSelectThread} />
          <InterventionOutcomeCard />
        </div>
      </div>
    </div>
  );
};

export default CollaborationTeacherPage;
