export interface CollaborationThread {
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

export interface CollaborationMessage {
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

export interface Acknowledgement {
  acknowledgementId: string;
  messageId: string;
  userId: string;
  role: 'teacher' | 'parent' | 'student';
  status: 'pending' | 'acknowledged' | 'declined';
  response?: string;
  acknowledgedAt?: string;
}

export interface CollaborationAction {
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

export interface CommunicationContext {
  studentId: string;
  studentName?: string;
  teacherId: string;
  parentId?: string;
  classId?: string;
  subject: string;
  topic?: string;
  mastery: number;
  riskScore: number;
  learningGaps: string[];
  interventionReason?: string;
  evidence: string[];
}

export interface CommunicationRecommendation {
  suggestedAudience: ('parent' | 'student')[];
  suggestedType: 'intervention_update' | 'action_request' | 'progress_update';
  reason: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface TeacherMessageDraft {
  recipient: 'parent' | 'student' | 'both';
  subject: string;
  body: string;
  tone: 'professional' | 'supportive' | 'concise' | 'encouraging' | 'exam-focused' | 'action-oriented';
  evidenceUsed: string[];
  recommendedActions: string[];
  aiGenerated: boolean;
}

export interface ParentMessageDraft {
  subject: string;
  body: string;
  homeSupportSuggestions: string[];
  tone: string;
  aiGenerated: boolean;
}

export interface StudentMessageDraft {
  subject: string;
  body: string;
  taskTitle: string;
  targetUrl: string;
  dueDate?: string;
  aiGenerated: boolean;
}

export interface CollaborationSummary {
  totalThreads: number;
  openThreads: number;
  unacknowledgedMessages: number;
  pendingActions: number;
  responseRate: number;
  acknowledgementRate: number;
  actionCompletionRate: number;
  avgResponseTimeHours: number;
}

export interface FollowupRecommendation {
  threadId: string;
  studentId: string;
  studentName?: string;
  parentId?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  suggestedAction: string;
}
