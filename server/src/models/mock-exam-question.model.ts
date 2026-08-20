import mongoose, { Schema, Document } from 'mongoose';

export interface IMockExamQuestion extends Document {
  examId: string;
  sectionId: string;
  questionId: string;
  questionNumber: number;
  marks: number;
  negativeMarks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  conceptId: string;
  topicId: string;
  questionType: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  sourceType: 'verified_bank' | 'ai_generated' | 'previous_year';
  sourceReference?: string;
  verified: boolean;
  createdAt: Date;
}

const MockExamQuestionSchema: Schema = new Schema(
  {
    examId: { type: String, required: true, index: true },
    sectionId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, index: true },
    questionNumber: { type: Number, required: true },
    marks: { type: Number, required: true, default: 2 },
    negativeMarks: { type: Number, default: 0.5 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    conceptId: { type: String, required: true },
    topicId: { type: String, required: true },
    questionType: { type: String, default: 'mcq' },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    sourceType: {
      type: String,
      enum: ['verified_bank', 'ai_generated', 'previous_year'],
      default: 'verified_bank',
    },
    sourceReference: { type: String },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MockExamQuestion = mongoose.model<IMockExamQuestion>('MockExamQuestion', MockExamQuestionSchema);
