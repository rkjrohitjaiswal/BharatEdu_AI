import mongoose, { Schema, Document } from 'mongoose';

export interface ICollaborationAcknowledgement extends Document {
  acknowledgementId: string;
  messageId: string;
  userId: string;
  role: 'teacher' | 'parent' | 'student';
  status: 'pending' | 'acknowledged' | 'declined';
  response?: string;
  acknowledgedAt?: Date;
  createdAt: Date;
}

const CollaborationAcknowledgementSchema: Schema = new Schema(
  {
    acknowledgementId: { type: String, required: true, unique: true, index: true },
    messageId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    role: { type: String, enum: ['teacher', 'parent', 'student'], required: true },
    status: { type: String, enum: ['pending', 'acknowledged', 'declined'], default: 'pending' },
    response: { type: String },
    acknowledgedAt: { type: Date },
  },
  { timestamps: true }
);

// Prevent duplicate acknowledgement records
CollaborationAcknowledgementSchema.index({ messageId: 1, userId: 1 }, { unique: true });

export const CollaborationAcknowledgement = mongoose.model<ICollaborationAcknowledgement>(
  'CollaborationAcknowledgement',
  CollaborationAcknowledgementSchema
);
