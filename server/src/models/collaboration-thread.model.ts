import mongoose, { Schema, Document } from 'mongoose';

export interface ICollaborationThread extends Document {
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
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
}

const CollaborationThreadSchema: Schema = new Schema(
  {
    threadId: { type: String, required: true, unique: true, index: true },
    classId: { type: String, index: true },
    teacherId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    parentId: { type: String, index: true },
    subject: { type: String, required: true },
    topic: { type: String },
    interventionId: { type: String, index: true },
    threadType: {
      type: String,
      enum: ['intervention', 'progress', 'exam', 'learning_gap', 'attendance', 'general'],
      default: 'intervention',
    },
    status: {
      type: String,
      enum: ['open', 'active', 'resolved', 'archived'],
      default: 'open',
      index: true,
    },
    createdBy: { type: String, required: true },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CollaborationThread = mongoose.model<ICollaborationThread>(
  'CollaborationThread',
  CollaborationThreadSchema
);
