import mongoose, { Schema, Document } from 'mongoose';

export interface ICollaborationMessage extends Document {
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
  readAt?: Date;
  createdAt: Date;
  metadata?: Record<string, any>;
}

const CollaborationMessageSchema: Schema = new Schema(
  {
    messageId: { type: String, required: true, unique: true, index: true },
    threadId: { type: String, required: true, index: true },
    senderId: { type: String, required: true, index: true },
    senderRole: { type: String, enum: ['teacher', 'parent', 'student', 'system'], required: true },
    recipientIds: { type: [String], default: [] },
    messageType: {
      type: String,
      enum: ['text', 'intervention_update', 'progress_update', 'action_request', 'acknowledgement', 'system_update'],
      default: 'text',
    },
    body: { type: String, required: true },
    aiGenerated: { type: Boolean, default: false },
    requiresAcknowledgement: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const CollaborationMessage = mongoose.model<ICollaborationMessage>(
  'CollaborationMessage',
  CollaborationMessageSchema
);
