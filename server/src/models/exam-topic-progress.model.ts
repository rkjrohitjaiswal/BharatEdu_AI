import mongoose, { Schema, Document, Model } from 'mongoose';

export type ReadinessLevel = 'weak' | 'developing' | 'ready' | 'strong';
export type TopicPriority = 'critical' | 'high' | 'medium' | 'low';

export interface IExamTopicProgress extends Document {
  examId: mongoose.Types.ObjectId | string;
  studentId: mongoose.Types.ObjectId | string;
  subjectId: mongoose.Types.ObjectId | string;
  topicId: mongoose.Types.ObjectId | string;
  masteryScore: number;
  confidenceScore: number;
  readinessLevel: ReadinessLevel;
  priority: TopicPriority;
  revisionCount: number;
  lastReviewedAt?: Date;
  updatedAt: Date;
}

const ExamTopicProgressSchema: Schema<IExamTopicProgress> = new Schema(
  {
    examId: { type: Schema.Types.Mixed, required: true, index: true },
    studentId: { type: Schema.Types.Mixed, required: true, index: true },
    subjectId: { type: Schema.Types.Mixed, required: true },
    topicId: { type: Schema.Types.Mixed, required: true },
    masteryScore: { type: Number, default: 0, min: 0, max: 100 },
    confidenceScore: { type: Number, default: 0.5, min: 0, max: 1 },
    readinessLevel: {
      type: String,
      enum: ['weak', 'developing', 'ready', 'strong'],
      default: 'weak',
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    revisionCount: { type: Number, default: 0 },
    lastReviewedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

ExamTopicProgressSchema.index({ examId: 1, studentId: 1, topicId: 1 }, { unique: true });

export const ExamTopicProgressModel: Model<IExamTopicProgress> = mongoose.model<IExamTopicProgress>(
  'ExamTopicProgress',
  ExamTopicProgressSchema
);
