import mongoose, { Document, Model, Schema } from 'mongoose';

export type DoubtSessionStatus = 'active' | 'resolved' | 'archived';
export type DoubtDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface IDoubtSession extends Document {
  sessionId: string;
  studentId: mongoose.Types.ObjectId;
  subject: string;
  classLevel: string;
  board: string;
  topicId?: string;
  conceptId?: string;
  learningPathId?: string;
  materialId?: string;
  examId?: string;
  title: string;
  status: DoubtSessionStatus;
  difficulty: DoubtDifficulty;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

const DoubtSessionSchema = new Schema<IDoubtSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: { type: String, required: true, default: 'General Academic' },
    classLevel: { type: String, default: 'Class 10' },
    board: { type: String, default: 'CBSE' },
    topicId: { type: String, default: '', index: true },
    conceptId: { type: String, default: '', index: true },
    learningPathId: { type: String, default: '' },
    materialId: { type: String, default: '' },
    examId: { type: String, default: '' },
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['active', 'resolved', 'archived'],
      default: 'active',
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    language: { type: String, default: 'English' },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const DoubtSession: Model<IDoubtSession> =
  mongoose.models.DoubtSession || mongoose.model<IDoubtSession>('DoubtSession', DoubtSessionSchema);
