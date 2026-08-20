import mongoose, { Document, Model, Schema } from 'mongoose';

export type RevisionOutcome = 'again' | 'hard' | 'good' | 'easy';

export interface IRevisionHistory extends Document {
  studentId: mongoose.Types.ObjectId;
  revisionItemId: string;
  conceptId: string;
  topicId: string;
  reviewedAt: Date;
  outcome: RevisionOutcome;
  previousInterval: number;
  newInterval: number;
  previousEaseFactor: number;
  newEaseFactor: number;
  responseTimeSeconds?: number;
  source: string;
  createdAt: Date;
}

const RevisionHistorySchema = new Schema<IRevisionHistory>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    revisionItemId: { type: String, required: true, index: true },
    conceptId: { type: String, required: true, index: true },
    topicId: { type: String, required: true },
    reviewedAt: { type: Date, default: Date.now, index: true },
    outcome: {
      type: String,
      enum: ['again', 'hard', 'good', 'easy'],
      required: true,
    },
    previousInterval: { type: Number, required: true },
    newInterval: { type: Number, required: true },
    previousEaseFactor: { type: Number, required: true },
    newEaseFactor: { type: Number, required: true },
    responseTimeSeconds: { type: Number, default: 0 },
    source: { type: String, default: 'Smart Revision Engine' },
  },
  { timestamps: true }
);

export const RevisionHistory: Model<IRevisionHistory> =
  mongoose.models.RevisionHistory || mongoose.model<IRevisionHistory>('RevisionHistory', RevisionHistorySchema);
