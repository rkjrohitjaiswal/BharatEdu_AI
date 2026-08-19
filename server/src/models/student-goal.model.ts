import mongoose, { Schema, Document } from 'mongoose';

export type GoalType =
  | 'mastery'
  | 'practice_questions'
  | 'practice_accuracy'
  | 'study_minutes'
  | 'study_streak'
  | 'topic_completion'
  | 'custom';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'expired';

export interface IStudentGoal extends Document {
  studentId: mongoose.Types.ObjectId | string;
  title: string;
  description?: string;
  goalType: GoalType;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: Date;
  status: GoalStatus;
  progressPercent: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentGoalSchema: Schema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500 },
    goalType: {
      type: String,
      required: true,
      enum: ['mastery', 'practice_questions', 'practice_accuracy', 'study_minutes', 'study_streak', 'topic_completion', 'custom'],
      default: 'practice_questions',
    },
    targetValue: { type: Number, required: true, min: 1 },
    currentValue: { type: Number, required: true, default: 0, min: 0 },
    unit: { type: String, required: true, default: 'questions' },
    targetDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'paused', 'expired'],
      default: 'active',
      index: true,
    },
    progressPercent: { type: Number, required: true, default: 0, min: 0, max: 100 },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const StudentGoal = mongoose.model<IStudentGoal>('StudentGoal', StudentGoalSchema);
