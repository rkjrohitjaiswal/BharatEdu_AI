import mongoose, { Document, Model, Schema } from 'mongoose';

export type LearningPathTargetType =
  | 'general_learning'
  | 'exam'
  | 'goal'
  | 'career'
  | 'subject'
  | 'custom';

export type LearningPathStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface ILearningPath extends Document {
  studentId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  board: string;
  classLevel: string;
  targetType: LearningPathTargetType;
  targetId?: string;
  targetName?: string;
  startDate: Date;
  targetDate?: Date;
  status: LearningPathStatus;
  progressPercent: number; // 0 to 100
  currentStage: number;
  totalStages: number;
  completedStages: number;
  estimatedTotalMinutes: number;
  dailyMinutes: number;
  weeklyMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathSchema = new Schema<ILearningPath>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    board: { type: String, default: 'CBSE' },
    classLevel: { type: String, default: 'Class 10' },
    targetType: {
      type: String,
      enum: ['general_learning', 'exam', 'goal', 'career', 'subject', 'custom'],
      default: 'general_learning',
      index: true,
    },
    targetId: { type: String, default: '' },
    targetName: { type: String, default: '' },
    startDate: { type: Date, default: Date.now },
    targetDate: { type: Date },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed', 'archived'],
      default: 'active',
      index: true,
    },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    currentStage: { type: Number, default: 1, min: 1 },
    totalStages: { type: Number, default: 6, min: 1 },
    completedStages: { type: Number, default: 0, min: 0 },
    estimatedTotalMinutes: { type: Number, default: 300 },
    dailyMinutes: { type: Number, default: 60 },
    weeklyMinutes: { type: Number, default: 420 },
  },
  { timestamps: true }
);

export const LearningPath: Model<ILearningPath> =
  mongoose.models.LearningPath || mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);
