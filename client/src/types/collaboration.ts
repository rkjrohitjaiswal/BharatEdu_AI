export interface ICollaborationThreadClient {
  threadId: string;
  classId?: string;
  teacherId: string;
  studentId: string;
  parentId?: string;
  subject: string;
  topic?: string;
  interventionId?: string;
  threadType: 'intervention' | 'progress' | 'exam' | 'learning_gap' | 'attendance' | 'general';
  status: 'open' | 'active' | 'resolved' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

export interface ICollaborationMessageClient {
  messageId: string;
  threadId: string;
  senderId: string;
  senderRole: 'teacher' | 'parent' | 'student' | 'system';
  recipientIds: string[];
  messageType: 'text' | 'intervention_update' | 'progress_update' | 'action_request' | 'acknowledgement' | 'system_update';
  body: string;
  aiGenerated: boolean;
  requiresAcknowledgement: boolean;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface ICollaborationActionClient {
  actionId: string;
  threadId: string;
  interventionId?: string;
  actionType: 'practice' | 'revision' | 'study_plan' | 'learning_path' | 'doubt_solver' | 'exam_prep' | 'resource' | 'parent_support' | 'teacher_followup';
  title: string;
  description: string;
  targetUrl?: string;
  assignedTo: string;
  assignedBy: string;
  dueDate?: string;
  status: 'pending' | 'started' | 'completed' | 'skipped';
  completedAt?: string;
}

export interface IFollowupRecommendationClient {
  threadId: string;
  studentId: string;
  studentName?: string;
  parentId?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  suggestedAction: string;
}
