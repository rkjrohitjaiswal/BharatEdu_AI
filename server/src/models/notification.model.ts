import mongoose, { Document, Schema } from 'mongoose';

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

export interface INotification extends Document {
  recipientUserId: mongoose.Types.ObjectId | string;
  recipientRole: NotificationRecipientRole;
  type: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  sourceType: NotificationSourceType;
  sourceId?: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: Date;
  dedupeKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientUserId: { type: Schema.Types.Mixed, ref: 'User', required: true, index: true },
    recipientRole: {
      type: String,
      enum: ['student', 'teacher', 'parent'],
      required: true,
      index: true,
    },
    type: { type: String, required: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'critical'],
      default: 'normal',
      index: true,
    },
    sourceType: {
      type: String,
      required: true,
      enum: [
        'study_plan',
        'mistake_review',
        'intervention',
        'scholarship',
        'goal',
        'achievement',
        'exam',
        'learning_coach',
        'career',
        'system',
      ],
      index: true,
    },
    sourceId: { type: String },
    actionUrl: { type: String },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    dedupeKey: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientUserId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipientUserId: 1, priority: 1 });

export const NotificationModel = mongoose.model<INotification>('Notification', notificationSchema);
