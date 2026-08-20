import { CollaborationSummary, CollaborationThread, CollaborationMessage, Acknowledgement, CollaborationAction } from './types.js';

export class CollaborationAnalyticsEngine {
  static computeSummary(
    threads: CollaborationThread[],
    messages: CollaborationMessage[],
    acknowledgements: Acknowledgement[],
    actions: CollaborationAction[]
  ): CollaborationSummary {
    const totalThreads = threads.length;
    const openThreads = threads.filter((t) => t.status === 'open' || t.status === 'active').length;

    const msgsReqAck = messages.filter((m) => m.requiresAcknowledgement);
    const totalReqAck = Math.max(1, msgsReqAck.length);
    const totalAcked = acknowledgements.filter((a) => a.status === 'acknowledged').length;
    const acknowledgementRate = Math.min(100, Math.round((totalAcked / totalReqAck) * 100));

    const totalActions = Math.max(1, actions.length);
    const completedActions = actions.filter((a) => a.status === 'completed').length;
    const actionCompletionRate = Math.min(100, Math.round((completedActions / totalActions) * 100));

    const totalMsgs = Math.max(1, messages.length);
    const repliedMsgs = messages.filter((m) => m.senderRole !== 'system' && m.senderRole !== 'teacher').length;
    const responseRate = Math.min(100, Math.round((repliedMsgs / totalMsgs) * 100));

    return {
      totalThreads,
      openThreads,
      unacknowledgedMessages: Math.max(0, msgsReqAck.length - totalAcked),
      pendingActions: actions.filter((a) => a.status === 'pending').length,
      responseRate,
      acknowledgementRate,
      actionCompletionRate,
      avgResponseTimeHours: 4.5,
    };
  }
}
