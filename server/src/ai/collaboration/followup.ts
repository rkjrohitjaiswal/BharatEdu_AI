import { FollowupRecommendation, CollaborationThread, CollaborationMessage, CollaborationAction } from './types.js';

export class CollaborationFollowupEngine {
  static detectFollowupsNeeded(
    threads: CollaborationThread[],
    messages: CollaborationMessage[],
    actions: CollaborationAction[],
    acknowledgementsMap: Map<string, boolean>
  ): FollowupRecommendation[] {
    const recommendations: FollowupRecommendation[] = [];

    for (const thread of threads) {
      if (thread.status === 'archived' || thread.status === 'resolved') continue;

      // 1. Check for unacknowledged messages requiring acknowledgement
      const threadMsgs = messages.filter((m) => m.threadId === thread.threadId && m.requiresAcknowledgement);
      for (const msg of threadMsgs) {
        const isAcked = acknowledgementsMap.get(msg.messageId);
        if (!isAcked) {
          recommendations.push({
            threadId: thread.threadId,
            studentId: thread.studentId,
            parentId: thread.parentId,
            priority: 'high',
            reason: `Unacknowledged intervention message sent on ${new Date(msg.createdAt).toLocaleDateString()}`,
            suggestedAction: 'Send friendly reminder to parent/student to review intervention plan.',
          });
        }
      }

      // 2. Check for overdue assigned actions
      const threadActions = actions.filter((a) => a.threadId === thread.threadId && a.status === 'pending');
      for (const act of threadActions) {
        if (act.dueDate && new Date(act.dueDate).getTime() < Date.now()) {
          recommendations.push({
            threadId: thread.threadId,
            studentId: thread.studentId,
            parentId: thread.parentId,
            priority: 'critical',
            reason: `Overdue action: "${act.title}" (Due: ${new Date(act.dueDate).toLocaleDateString()})`,
            suggestedAction: 'Check in with student on learning obstacle or provide additional hint resource.',
          });
        }
      }
    }

    // Deduplicate recommendations per thread
    const uniqueMap = new Map<string, FollowupRecommendation>();
    for (const rec of recommendations) {
      if (!uniqueMap.has(rec.threadId)) {
        uniqueMap.set(rec.threadId, rec);
      }
    }

    return Array.from(uniqueMap.values());
  }
}
