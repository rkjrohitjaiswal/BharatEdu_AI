export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';
export type NotificationRecipientRole = 'student' | 'teacher' | 'parent';
export type NotificationSourceType =
  | 'study_plan'
  | 'mistake_review'
  | 'intervention'
  | 'scholarship'
  | 'goal'
  | 'achievement'
  | 'exam'
  | 'learning_coach'
  | 'career'
  | 'system';

export interface NotificationCandidate {
  recipientUserId: string;
  recipientRole: NotificationRecipientRole;
  type: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  sourceType: NotificationSourceType;
  sourceId?: string;
  actionUrl?: string;
  dedupeKey: string;
}

export interface NotificationFilterOptions {
  recipientUserId: string;
  recipientRole?: NotificationRecipientRole;
  isRead?: boolean;
  priority?: NotificationPriority;
  sourceType?: NotificationSourceType;
  limit?: number;
}
