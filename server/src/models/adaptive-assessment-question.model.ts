import mongoose, { Document, Model, Schema } from 'mongoose';
import { AssessmentDifficulty } from './adaptive-assessment.model.js';

export type QuestionType = 'mcq' | 'multiple_select' | 'true_false' | 'numerical' | 'short_answer' | 'coding';
export type QuestionGeneratedBy = 'catalog' | 'deterministic' | 'ai' | 'hybrid';
export type QuestionStatus = 'pending' | 'answered' | 'skipped';

export interface IAdaptiveAssessmentQuestion extends Document {
  assessmentId: string;
  questionId: string;
  studentId: mongoose.Types.ObjectId;
  sequence: number;
  subject: string;
  topicId: string;
  conceptId: string;
  difficulty: AssessmentDifficulty;
  questionType: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string; // SERVER-SIDE ONLY - NEVER returned to student before submission!
  marks: number;
  timeLimitSeconds: number;
  sourceType: string;
  sourceId?: string;
  generatedBy: QuestionGeneratedBy;
  status: QuestionStatus;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdaptiveAssessmentQuestionSchema = new Schema<IAdaptiveAssessmentQuestion>(
  {
    assessmentId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, unique: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sequence: { type: Number, required: true, default: 1 },
    subject: { type: String, required: true, default: 'Mathematics' },
    topicId: { type: String, required: true, default: 'Algebra' },
    conceptId: { type: String, required: true, default: 'math_linear_eq' },
    difficulty: {
      type: String,
      enum: ['beginner', 'easy', 'medium', 'hard', 'advanced', 'foundational'],
      default: 'medium',
    },
    questionType: {
      type: String,
      enum: ['mcq', 'multiple_select', 'true_false', 'numerical', 'short_answer', 'coding'],
      default: 'mcq',
    },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    marks: { type: Number, default: 1 },
    timeLimitSeconds: { type: Number, default: 120 },
    sourceType: { type: String, default: 'BharatEdu Catalog' },
    sourceId: { type: String, default: '' },
    generatedBy: {
      type: String,
      enum: ['catalog', 'deterministic', 'ai', 'hybrid'],
      default: 'deterministic',
    },
    status: {
      type: String,
      enum: ['pending', 'answered', 'skipped'],
      default: 'pending',
      index: true,
    },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export const AdaptiveAssessmentQuestion: Model<IAdaptiveAssessmentQuestion> =
  mongoose.models.AdaptiveAssessmentQuestion ||
  mongoose.model<IAdaptiveAssessmentQuestion>('AdaptiveAssessmentQuestion', AdaptiveAssessmentQuestionSchema);
