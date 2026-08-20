import { dataRepository } from '../../repositories/data.repository.js';
import { CollaborationEngine } from './engine.js';
import { CollaborationAICoach } from './ai-coach.js';
import { CollaborationFollowupEngine } from './followup.js';
import { CollaborationAnalyticsEngine } from './analytics.js';
import { CollaborationPrivacyFilter } from './privacy.js';

export class CollaborationService {
  async getTeacherThreads(teacherId: string) {
    let threads = await dataRepository.getCollaborationThreads({ teacherId });
    if (threads.length === 0) {
      // Seed initial thread for teacher demo
      const thread = await dataRepository.createCollaborationThread({
        threadId: `th_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        teacherId,
        studentId: 'student_1',
        subject: 'Mathematics',
        topic: 'Fractions & Rational Expressions',
        threadType: 'intervention',
        status: 'open',
        createdBy: teacherId,
      });

      await dataRepository.createCollaborationMessage({
        messageId: `msg_${Date.now()}_1`,
        threadId: thread.threadId,
        senderId: teacherId,
        senderRole: 'teacher',
        recipientIds: ['student_1', 'parent_1'],
        messageType: 'intervention_update',
        body: 'Welcome to your personalized remediation path for Fractions! Please review the assigned 5-question practice module.',
        aiGenerated: false,
        requiresAcknowledgement: true,
        isRead: false,
      });

      threads = [thread];
    }

    return threads;
  }

  async getThreadById(threadId: string, userId: string, userRole: string) {
    const thread = await dataRepository.getCollaborationThread(threadId);
    if (!thread) throw new Error('Thread not found');

    // Strict Authorization check (Section 26)
    if (userRole === 'teacher' && thread.teacherId !== userId) {
      throw new Error('Access denied. You do not own this thread.');
    }
    if (userRole === 'student' && thread.studentId !== userId) {
      throw new Error('Access denied. This is not your thread.');
    }
    if (userRole === 'parent' && thread.parentId && thread.parentId !== userId) {
      throw new Error('Access denied. This is not your thread.');
    }

    const messagesRaw = await dataRepository.getCollaborationMessages(threadId);
    const actions = await dataRepository.getCollaborationActions(threadId);

    // Sanitize messages for recipients & strip private data
    const messages = messagesRaw.map((m: any) => CollaborationPrivacyFilter.filterPrivateData(m));

    return { thread, messages, actions };
  }

  async createMessage(threadId: string, senderId: string, senderRole: string, body: string, recipientIds?: string[], requiresAck?: boolean, metadata?: any) {
    const thread = await dataRepository.getCollaborationThread(threadId);
    if (!thread) throw new Error('Thread not found');

    // Security check
    if (senderRole === 'teacher' && thread.teacherId !== senderId) throw new Error('Access denied.');
    if (senderRole === 'student' && thread.studentId !== senderId) throw new Error('Access denied.');

    // Privacy & safety filter (Section 29)
    const privacyResult = CollaborationPrivacyFilter.sanitizeMessageContent(body);

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const message = await dataRepository.createCollaborationMessage({
      messageId,
      threadId,
      senderId,
      senderRole,
      recipientIds: recipientIds || [thread.studentId, thread.parentId || ''].filter(Boolean),
      messageType: 'text',
      body: privacyResult.body,
      aiGenerated: false,
      requiresAcknowledgement: !!requiresAck,
      isRead: false,
      metadata: privacyResult.flagged ? { safetyFlag: privacyResult.reason, ...metadata } : metadata,
    });

    // Create Smart Notification (Feature 11 integration)
    await dataRepository.createNotification({
      recipientId: thread.studentId,
      title: 'New Teacher Message',
      message: `You have a new message in ${thread.subject}`,
      type: 'intervention',
      actionUrl: `/collaboration?threadId=${threadId}`,
      dedupeKey: `notif_msg_${messageId}`,
    });

    return message;
  }

  async createInterventionThread(teacherId: string, interventionId: string, payload: any) {
    const threadId = `th_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const thread = await dataRepository.createCollaborationThread({
      threadId,
      classId: payload.classId,
      teacherId,
      studentId: payload.studentId || 'student_1',
      parentId: payload.parentId,
      subject: payload.subject || 'Mathematics',
      topic: payload.topic,
      interventionId,
      threadType: 'intervention',
      status: 'open',
      createdBy: teacherId,
    });

    // Create initial message
    const msgId = `msg_${Date.now()}_init`;
    await dataRepository.createCollaborationMessage({
      messageId: msgId,
      threadId,
      senderId: teacherId,
      senderRole: 'teacher',
      recipientIds: [thread.studentId, thread.parentId || ''].filter(Boolean),
      messageType: 'intervention_update',
      body: payload.initialMessage || `Intervention initiated for ${payload.topic || payload.subject}.`,
      aiGenerated: !!payload.aiGenerated,
      requiresAcknowledgement: true,
      isRead: false,
    });

    return { thread, threadId };
  }

  async acknowledgeMessage(messageId: string, userId: string, role: string, responseText?: string) {
    const ackId = `ack_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const ack = await dataRepository.createAcknowledgement({
      acknowledgementId: ackId,
      messageId,
      userId,
      role,
      status: 'acknowledged',
      response: responseText,
      acknowledgedAt: new Date(),
    });
    return ack;
  }

  async generateDraft(contextData: any) {
    const context = await CollaborationEngine.buildContext(contextData.studentId, contextData.teacherId, contextData.subject, contextData.topic);
    const draft = CollaborationAICoach.generateTeacherDraft(context, contextData.recipient || 'both', contextData.tone || 'supportive');
    return draft;
  }

  async getFollowupQueue(teacherId: string) {
    const threads = await dataRepository.getCollaborationThreads({ teacherId });
    const allMsgs: any[] = [];
    const allActions: any[] = [];
    const ackMap = new Map<string, boolean>();

    for (const t of threads) {
      const msgs = await dataRepository.getCollaborationMessages(t.threadId);
      allMsgs.push(...msgs);
      const acts = await dataRepository.getCollaborationActions(t.threadId);
      allActions.push(...acts);

      for (const m of msgs) {
        if (m.requiresAcknowledgement) {
          const acks = await dataRepository.getAcknowledgements(m.messageId);
          if (acks.some((a: any) => a.status === 'acknowledged')) {
            ackMap.set(m.messageId, true);
          }
        }
      }
    }

    const followups = CollaborationFollowupEngine.detectFollowupsNeeded(threads, allMsgs, allActions, ackMap);
    return followups;
  }

  async createAction(payload: any) {
    const actionId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const action = await dataRepository.createCollaborationAction({
      ...payload,
      actionId,
      status: 'pending',
    });
    return action;
  }

  async updateActionStatus(actionId: string, status: 'started' | 'completed' | 'skipped', userId: string) {
    const updates: any = { status };
    if (status === 'completed') updates.completedAt = new Date();

    const updated = await dataRepository.updateCollaborationAction(actionId, updates);
    return updated;
  }

  async getParentThreads(parentId: string) {
    const threads = await dataRepository.getCollaborationThreads({ parentId });
    return threads;
  }

  async getStudentThreads(studentId: string) {
    const threads = await dataRepository.getCollaborationThreads({ studentId });
    return threads;
  }

  async archiveThread(threadId: string, teacherId: string) {
    const thread = await dataRepository.getCollaborationThread(threadId);
    if (!thread) throw new Error('Thread not found');
    if (thread.teacherId !== teacherId) throw new Error('Access denied.');

    thread.status = 'archived';
    return thread;
  }
}

export const collaborationService = new CollaborationService();
