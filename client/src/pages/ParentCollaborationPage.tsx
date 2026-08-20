import React, { useEffect, useState } from 'react';
import {
  fetchParentCollaborationThreads,
  fetchThreadDetails,
  sendCollaborationMessage,
  acknowledgeCollaborationMessage,
  completeCollaborationAction,
} from '../services/api';
import { ICollaborationThreadClient, ICollaborationMessageClient, ICollaborationActionClient } from '../types/collaboration';

import { ParentMessageInbox } from '../components/collaboration/ParentMessageInbox';
import { ParentInterventionCard } from '../components/collaboration/ParentInterventionCard';
import { ParentSupportAction } from '../components/collaboration/ParentSupportAction';
import { ParentResponseBox } from '../components/collaboration/ParentResponseBox';
import { ParentProgressFollowup } from '../components/collaboration/ParentProgressFollowup';
import { CollaborationEmptyState } from '../components/collaboration/CollaborationEmptyState';
import { HeartHandshake } from 'lucide-react';

export const ParentCollaborationPage: React.FC = () => {
  const [threads, setThreads] = useState<ICollaborationThreadClient[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('');
  const [messages, setMessages] = useState<ICollaborationMessageClient[]>([]);
  const [actions, setActions] = useState<ICollaborationActionClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    setLoading(true);
    const res = await fetchParentCollaborationThreads();
    if (res.success && res.data && res.data.length > 0) {
      setThreads(res.data);
      const firstId = res.data[0].threadId;
      setSelectedThreadId(firstId);
      loadThreadDetails(firstId);
    } else {
      setLoading(false);
    }
  };

  const loadThreadDetails = async (threadId: string) => {
    const res = await fetchThreadDetails('parent', threadId);
    if (res.success && res.data) {
      setMessages(res.data.messages || []);
      setActions(res.data.actions || []);
    }
    setLoading(false);
  };

  const handleAcknowledge = async (msgId: string) => {
    await acknowledgeCollaborationMessage('parent', msgId, 'Confirmed parent home review routine.');
    if (selectedThreadId) loadThreadDetails(selectedThreadId);
  };

  const handleSendReply = async (text: string) => {
    if (!selectedThreadId) return;
    await sendCollaborationMessage('parent', selectedThreadId, text);
    loadThreadDetails(selectedThreadId);
  };

  const handleCompleteAction = async () => {
    if (actions.length > 0) {
      await completeCollaborationAction('parent', actions[0].actionId);
      if (selectedThreadId) loadThreadDetails(selectedThreadId);
    }
  };

  if (loading && threads.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading Parent Collaboration Portal...</p>
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Parent–Teacher Learning Collaboration</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Teacher Guidance & Home Support</h1>
          <p className="text-xs text-slate-400">View teacher updates, confirm home review routines, and track your child's progress.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ParentInterventionCard />
            <ParentMessageInbox messages={messages} onAcknowledge={handleAcknowledge} />
            <ParentResponseBox onSend={handleSendReply} />
          </div>

          <div className="space-y-6">
            <ParentSupportAction onComplete={handleCompleteAction} />
            <ParentProgressFollowup />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentCollaborationPage;
