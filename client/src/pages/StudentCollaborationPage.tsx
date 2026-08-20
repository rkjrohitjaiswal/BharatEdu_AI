import React, { useEffect, useState } from 'react';
import {
  fetchStudentCollaborationThreads,
  fetchThreadDetails,
  sendCollaborationMessage,
  acknowledgeCollaborationMessage,
  startCollaborationAction,
  completeCollaborationAction,
  submitCollaborationHelpRequest,
} from '../services/api';
import { ICollaborationThreadClient, ICollaborationMessageClient, ICollaborationActionClient } from '../types/collaboration';

import { StudentMessageInbox } from '../components/collaboration/StudentMessageInbox';
import { StudentInterventionCard } from '../components/collaboration/StudentInterventionCard';
import { StudentActionCard } from '../components/collaboration/StudentActionCard';
import { StudentFollowupBox } from '../components/collaboration/StudentFollowupBox';
import { StudentHelpRequest } from '../components/collaboration/StudentHelpRequest';
import { CollaborationEmptyState } from '../components/collaboration/CollaborationEmptyState';
import { Sparkles } from 'lucide-react';

export const StudentCollaborationPage: React.FC = () => {
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
    const res = await fetchStudentCollaborationThreads();
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
    const res = await fetchThreadDetails('student', threadId);
    if (res.success && res.data) {
      setMessages(res.data.messages || []);
      setActions(res.data.actions || []);
    }
    setLoading(false);
  };

  const handleAcknowledge = async (msgId: string) => {
    await acknowledgeCollaborationMessage('student', msgId, 'Student acknowledged teacher guidance.');
    if (selectedThreadId) loadThreadDetails(selectedThreadId);
  };

  const handleSendReply = async (text: string) => {
    if (!selectedThreadId) return;
    await sendCollaborationMessage('student', selectedThreadId, text);
    loadThreadDetails(selectedThreadId);
  };

  const handleStartAction = async (actionId: string) => {
    await startCollaborationAction(actionId);
    if (selectedThreadId) loadThreadDetails(selectedThreadId);
  };

  const handleCompleteAction = async (actionId: string) => {
    await completeCollaborationAction('student', actionId);
    if (selectedThreadId) loadThreadDetails(selectedThreadId);
  };

  const handleHelpRequest = async () => {
    await submitCollaborationHelpRequest('student', { threadId: selectedThreadId });
    alert('Extra help request submitted to your teacher!');
  };

  if (loading && threads.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading Teacher Guidance & Tasks...</p>
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
            <Sparkles className="w-4 h-4" />
            <span>Teacher Guidance & Remediation Tasks</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Your Guided Learning Tasks</h1>
          <p className="text-xs text-slate-400">View teacher feedback, acknowledge guidance, and complete assigned learning tasks.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StudentInterventionCard />
            <StudentMessageInbox messages={messages} onAcknowledge={handleAcknowledge} />
            <StudentFollowupBox onSend={handleSendReply} />
          </div>

          <div className="space-y-6">
            <StudentHelpRequest onRequest={handleHelpRequest} />
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Assigned Learning Tasks</h4>
              {actions.map((act) => (
                <StudentActionCard
                  key={act.actionId}
                  action={act}
                  onStart={() => handleStartAction(act.actionId)}
                  onComplete={() => handleCompleteAction(act.actionId)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCollaborationPage;
