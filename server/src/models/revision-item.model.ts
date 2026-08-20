import mongoose, { Document, Schema } from 'mongoose';

export type RevisionSourceType =
  | 'mistake'
  | 'practice'
  | 'learning_gap'
  | 'exam'
  | 'goal'
  | 'resource'
  | 'manual';

export type RevisionStatus = 'active' | 'due' | 'overdue' | 'mastered' | 'paused' | 'archived';

export type ReviewLevel = 'new' | 'learning' | 'reinforcing' | 'retained' | 'mastered';

export type ReviewResultType = 'failed' | 'weak' | 'passed' | 'strong';

export interface IRevisionItem extends Document {
  studentId: mongoose.Types.ObjectId;
  subject: string;
  topic: string;
  subtopic: string;
  sourceType: RevisionSourceType;
  sourceId?: string;
  masteryScore: number;
  retentionScore: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reviewLevel: ReviewLevel;
  intervalDays: number;
  repetitionCount: number;
  lastReviewedAt?: Date;
  nextReviewAt: Date;
  lastResult?: ReviewResultType;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  overdue: boolean;
  status: RevisionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const RevisionItemSchema = new Schema<IRevisionItem>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: { type: String, required: true, index: true },
    topic: { type: String, required: true, index: true },
    subtopic: { type: String, default: '' },
    sourceType: {
      type: String,
      enum: ['mistake', 'practice', 'learning_gap', 'exam', 'goal', 'resource', 'manual'],
      default: 'practice',
    },
    sourceId: { type: String, default: '' },
    masteryScore: { type: Number, min: 0, max: 100, default: 50 },
    retentionScore: { type: Number, min: 0, max: 100, default: 50 },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
    reviewLevel: {
      type: String,
      enum: ['new', 'learning', 'reinforcing', 'retained', 'mastered'],
      default: 'new',
    },
    intervalDays: { type: Number, default: 1, min: 1 },
    repetitionCount: { type: Number, default: 0, min: 0 },
    lastReviewedAt: { type: Date },
    nextReviewAt: { type: Date, required: true, index: true },
    lastResult: { type: String, enum: ['failed', 'weak', 'passed', 'strong'] },
    consecutiveCorrect: { type: Number, default: 0, min: 0 },
    consecutiveIncorrect: { type: Number, default: 0, min: 0 },
    overdue: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['active', 'due', 'overdue', 'mastered', 'paused', 'archived'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

RevisionItemSchema.index({ studentId: 1, topic: 1 }, { unique: true });

export const RevisionItem =
  mongoose.models.RevisionItem || mongoose.model<IRevisionItem>('RevisionItem', RevisionItemSchema);
