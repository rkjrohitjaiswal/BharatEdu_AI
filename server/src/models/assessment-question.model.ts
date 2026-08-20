import mongoose, { Schema, Document } from 'mongoose';

export type QuestionType =
  | 'mcq'
  | 'multiple_select'
  | 'true_false'
  | 'numerical'
  | 'short_answer'
  | 'long_answer'
  | 'essay'
  | 'coding'
  | 'file_upload';

export interface IAssessmentQuestion extends Document {
  assessmentId: string;
  questionId: string;
  order: number;
  questionType: QuestionType;
  question: string;
  options?: string[];
  marks: number;
  correctAnswer?: string | string[] | number;
  expectedPoints?: string[];
  conceptIds: string[];
  topicId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rubricCriteria?: {
    criterionId: string;
    maxMarks: number;
  }[];
  modelAnswer?: string;
  hints?: string[];
  attachments?: string[];
  sourceType?: 'manual' | 'question_bank' | 'personalized_practice' | 'mock_exam';
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentQuestionSchema = new Schema<IAssessmentQuestion>(
  {
    assessmentId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, unique: true, index: true },
    order: { type: Number, required: true, default: 1 },
    questionType: {
      type: String,
      enum: ['mcq', 'multiple_select', 'true_false', 'numerical', 'short_answer', 'long_answer', 'essay', 'coding', 'file_upload'],
      required: true,
    },
    question: { type: String, required: true },
    options: [{ type: String }],
    marks: { type: Number, required: true, default: 1 },
    correctAnswer: { type: Schema.Types.Mixed },
    expectedPoints: [{ type: String }],
    conceptIds: [{ type: String }],
    topicId: { type: String },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    rubricCriteria: [
      {
        criterionId: { type: String },
        maxMarks: { type: Number },
      },
    ],
    modelAnswer: { type: String },
    hints: [{ type: String }],
    attachments: [{ type: String }],
    sourceType: {
      type: String,
      enum: ['manual', 'question_bank', 'personalized_practice', 'mock_exam'],
      default: 'manual',
    },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AssessmentQuestion =
  mongoose.models.AssessmentQuestion ||
  mongoose.model<IAssessmentQuestion>('AssessmentQuestion', AssessmentQuestionSchema);
