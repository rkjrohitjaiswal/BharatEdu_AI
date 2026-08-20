import mongoose, { Schema, Document } from 'mongoose';

export type PracticeQuestionType =
  | 'mcq'
  | 'multiple_select'
  | 'true_false'
  | 'numerical'
  | 'short_answer'
  | 'coding'
  | 'assertion_reason'
  | 'case_based';

export type PracticeQuestionDifficulty = 'easy' | 'medium' | 'hard';
export type PracticeSourceType = 'verified_bank' | 'generated' | 'imported';

export interface IPracticeQuestion extends Document {
  questionId: string;
  subject: string;
  topicId: string;
  conceptId: string;
  classLevel?: string;
  board?: string;
  questionType: PracticeQuestionType;
  difficulty: PracticeQuestionDifficulty;
  question: string;
  options?: string[];
  correctAnswer: any; // Kept server-side only
  explanation?: string;
  solutionSteps?: string[];
  hints?: string[];
  misconceptionTags?: string[];
  prerequisiteConceptIds?: string[];
  examTags?: string[];
  careerTags?: string[];
  sourceType: PracticeSourceType;
  sourceReference?: string;
  qualityScore: number;
  verified: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeQuestionSchema: Schema = new Schema(
  {
    questionId: { type: String, required: true, unique: true, index: true },
    subject: { type: String, required: true, index: true },
    topicId: { type: String, required: true, index: true },
    conceptId: { type: String, required: true, index: true },
    classLevel: { type: String, default: '10th' },
    board: { type: String, default: 'CBSE' },
    questionType: {
      type: String,
      enum: ['mcq', 'multiple_select', 'true_false', 'numerical', 'short_answer', 'coding', 'assertion_reason', 'case_based'],
      default: 'mcq',
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
      index: true,
    },
    question: { type: String, required: true },
    options: { type: [String], default: [] },
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String },
    solutionSteps: { type: [String], default: [] },
    hints: { type: [String], default: [] },
    misconceptionTags: { type: [String], default: [] },
    prerequisiteConceptIds: { type: [String], default: [] },
    examTags: { type: [String], default: [] },
    careerTags: { type: [String], default: [] },
    sourceType: {
      type: String,
      enum: ['verified_bank', 'generated', 'imported'],
      default: 'verified_bank',
    },
    sourceReference: { type: String },
    qualityScore: { type: Number, default: 85 },
    verified: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PracticeQuestion = mongoose.model<IPracticeQuestion>('PracticeQuestion', PracticeQuestionSchema);
