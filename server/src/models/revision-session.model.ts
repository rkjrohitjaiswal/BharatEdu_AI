import mongoose, { Document, Schema } from 'mongoose';
import { ReviewResultType } from './revision-item.model.js';

export interface IRevisionSession extends Document {
  studentId: mongoose.Types.ObjectId;
  revisionItemId: string;
  topic: string;
  startedAt: Date;
  completedAt?: Date;
  plannedMinutes: number;
  actualMinutes: number;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  result: ReviewResultType;
  retentionBefore: number;
  retentionAfter: number;
  nextReviewAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RevisionSessionSchema = new Schema<IRevisionSession>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    revisionItemId: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    plannedMinutes: { type: Number, default: 15 },
    actualMinutes: { type: Number, default: 15 },
    questionsAttempted: { type: Number, default: 5 },
    questionsCorrect: { type: Number, default: 0 },
    accuracy: { type: Number, min: 0, max: 100, default: 0 },
    result: {
      type: String,
      enum: ['failed', 'weak', 'passed', 'strong'],
      default: 'passed',
    },
    retentionBefore: { type: Number, default: 50 },
    retentionAfter: { type: Number, default: 50 },
    nextReviewAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const RevisionSession =
  mongoose.models.RevisionSession ||
  mongoose.model<IRevisionSession>('RevisionSession', RevisionSessionSchema);
