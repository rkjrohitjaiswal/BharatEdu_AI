import mongoose, { Document, Model, Schema } from 'mongoose';

export type DoubtSourceContext =
  | 'practice'
  | 'exam'
  | 'revision'
  | 'learning_path'
  | 'dashboard'
  | 'free_question'
  | 'teacher_assigned';

export type DoubtDifficultyLevel = 'easy' | 'medium' | 'hard' | 'unknown';
export type DoubtStatus = 'open' | 'answered' | 'needs_clarification' | 'resolved';

export interface IStudentDoubt extends Document {
  doubtId: string;
  studentId: mongoose.Types.ObjectId;
  question: string;
  normalizedQuestion: string;
  subject: string;
  topicId: string;
  conceptId?: string;
  sourceContext: DoubtSourceContext;
  sourceId?: string;
  difficulty: DoubtDifficultyLevel;
  status: DoubtStatus;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const StudentDoubtSchema = new Schema<IStudentDoubt>(
  {
    doubtId: { type: String, required: true, unique: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    question: { type: String, required: true },
    normalizedQuestion: { type: String, required: true, index: true },
    subject: { type: String, required: true, default: 'Mathematics' },
    topicId: { type: String, default: 'Algebra' },
    conceptId: { type: String },
    sourceContext: {
      type: String,
      enum: ['practice', 'exam', 'revision', 'learning_path', 'dashboard', 'free_question', 'teacher_assigned'],
      default: 'free_question',
    },
    sourceId: { type: String },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'unknown'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'answered', 'needs_clarification', 'resolved'],
      default: 'answered',
      index: true,
    },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export const StudentDoubt: Model<IStudentDoubt> =
  mongoose.models.StudentDoubt || mongoose.model<IStudentDoubt>('StudentDoubt', StudentDoubtSchema);
