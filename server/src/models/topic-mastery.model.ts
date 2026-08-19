import mongoose, { Schema, Document, Model } from 'mongoose';

export type MasteryStatus = 'not_started' | 'learning' | 'needs_review' | 'mastered';

export interface ITopicMastery extends Document {
  studentId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  masteryScore: number;
  confidenceScore: number;
  attempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  lastAttemptAt?: Date;
  lastAssessmentScore: number;
  status: MasteryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TopicMasterySchema: Schema<ITopicMastery> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    masteryScore: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    confidenceScore: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    attempts: {
      type: Number,
      default: 0,
      min: [0, 'Attempts cannot be negative'],
    },
    correctAttempts: {
      type: Number,
      default: 0,
      min: [0, 'Attempts cannot be negative'],
    },
    incorrectAttempts: {
      type: Number,
      default: 0,
      min: [0, 'Attempts cannot be negative'],
    },
    lastAttemptAt: {
      type: Date,
    },
    lastAssessmentScore: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    status: {
      type: String,
      enum: ['not_started', 'learning', 'needs_review', 'mastered'],
      default: 'not_started',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index for studentId + topicId
TopicMasterySchema.index({ studentId: 1, topicId: 1 }, { unique: true });

export const TopicMastery: Model<ITopicMastery> = mongoose.model<ITopicMastery>(
  'TopicMastery',
  TopicMasterySchema
);
