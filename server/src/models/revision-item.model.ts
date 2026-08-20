import mongoose, { Document, Schema } from 'mongoose';

export type RevisionSourceType =
  | 'mistake'
  | 'practice'
  | 'learning_gap'
  | 'exam'
  | 'goal'
  | 'resource'
  | 'manual'
  | 'prerequisite'
  | 'risk';

export type RevisionStatus = 'due' | 'upcoming' | 'completed' | 'paused' | 'active' | 'overdue' | 'archived' | 'mastered';

export type RevisionPriority = 'critical' | 'high' | 'medium' | 'low';

export type ReviewLevel = 'new' | 'learning' | 'reinforcing' | 'retained' | 'mastered';

export type ReviewResultType = 'failed' | 'weak' | 'passed' | 'strong';

export interface IRevisionItem extends Document {
  studentId: mongoose.Types.ObjectId;
  topicId: string;
  topic: string;
  conceptId: string;
  subject: string;
  sourceType: RevisionSourceType;
  sourceId?: string;
  lastReviewedAt?: Date;
  nextReviewAt: Date;
  reviewCount: number;
  successfulReviews: number;
  failedReviews: number;
  currentIntervalDays: number;
  easeFactor: number;
  difficulty: 'foundational' | 'easy' | 'medium' | 'hard' | 'advanced' | 'beginner' | 'intermediate';
  masteryScore: number;
  confidenceScore: number;
  priority: RevisionPriority;
  status: RevisionStatus;

  // Backward compatibility
  subtopic?: string;
  retentionScore?: number;
  reviewLevel?: ReviewLevel;
  intervalDays?: number;
  repetitionCount?: number;
  lastResult?: ReviewResultType;
  consecutiveCorrect?: number;
  consecutiveIncorrect?: number;
  overdue?: boolean;

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
    topicId: { type: String, required: true, index: true },
    topic: { type: String, required: true, index: true },
    conceptId: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    sourceType: {
      type: String,
      enum: ['mistake', 'practice', 'learning_gap', 'exam', 'goal', 'resource', 'manual', 'prerequisite', 'risk'],
      default: 'practice',
    },
    sourceId: { type: String, default: '' },
    lastReviewedAt: { type: Date },
    nextReviewAt: { type: Date, required: true, index: true },
    reviewCount: { type: Number, default: 0, min: 0 },
    successfulReviews: { type: Number, default: 0, min: 0 },
    failedReviews: { type: Number, default: 0, min: 0 },
    currentIntervalDays: { type: Number, default: 1, min: 1 },
    easeFactor: { type: Number, default: 2.5, min: 1.3, max: 3.5 },
    difficulty: {
      type: String,
      enum: ['foundational', 'easy', 'medium', 'hard', 'advanced', 'beginner', 'intermediate'],
      default: 'medium',
    },
    masteryScore: { type: Number, min: 0, max: 100, default: 50 },
    confidenceScore: { type: Number, min: 0, max: 100, default: 50 },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['due', 'upcoming', 'completed', 'paused', 'active', 'overdue', 'archived', 'mastered'],
      default: 'due',
      index: true,
    },

    // Backward compatibility fields
    subtopic: { type: String, default: '' },
    retentionScore: { type: Number, default: 50 },
    reviewLevel: { type: String, default: 'new' },
    intervalDays: { type: Number, default: 1 },
    repetitionCount: { type: Number, default: 0 },
    lastResult: { type: String },
    consecutiveCorrect: { type: Number, default: 0 },
    consecutiveIncorrect: { type: Number, default: 0 },
    overdue: { type: Boolean, default: false },
  },
  { timestamps: true }
);

RevisionItemSchema.index({ studentId: 1, conceptId: 1 }, { unique: true });

export const RevisionItem =
  mongoose.models.RevisionItem || mongoose.model<IRevisionItem>('RevisionItem', RevisionItemSchema);
