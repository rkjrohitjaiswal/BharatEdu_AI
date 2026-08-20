import mongoose, { Document, Model, Schema } from 'mongoose';

export type QuestionDifficultyType = 'easy' | 'medium' | 'hard' | 'beginner' | 'advanced';
export type QuestionTypeFormat = 'mcq' | 'multiple_select' | 'true_false' | 'numerical' | 'short_answer' | 'long_answer' | 'coding';
export type ExamQuestionStatus = 'unanswered' | 'answered' | 'marked_for_review' | 'skipped';

export interface IExamPaperQuestion extends Document {
  paperId: string;
  sectionId: string;
  questionId: string;
  sequence: number;
  subject: string;
  topicId: string;
  conceptId: string;
  difficulty: QuestionDifficultyType;
  questionType: QuestionTypeFormat;
  questionText: string;
  options?: string[];
  correctAnswer: string; // SERVER-SIDE ONLY - NEVER returned before submission!
  expectedConceptCoverage?: string[];
  rubric?: string;
  marks: number;
  negativeMarks: number;
  sourceType: string;
  sourceId?: string;
  generatedBy: 'catalog' | 'deterministic' | 'ai' | 'hybrid';
  status: ExamQuestionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ExamPaperQuestionSchema = new Schema<IExamPaperQuestion>(
  {
    paperId: { type: String, required: true, index: true },
    sectionId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, unique: true, index: true },
    sequence: { type: Number, required: true, default: 1 },
    subject: { type: String, default: 'Mathematics' },
    topicId: { type: String, default: 'Algebra' },
    conceptId: { type: String, default: 'math_linear_eq' },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'beginner', 'advanced'],
      default: 'medium',
    },
    questionType: {
      type: String,
      enum: ['mcq', 'multiple_select', 'true_false', 'numerical', 'short_answer', 'long_answer', 'coding'],
      default: 'mcq',
    },
    questionText: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    expectedConceptCoverage: [{ type: String }],
    rubric: { type: String, default: '' },
    marks: { type: Number, default: 1 },
    negativeMarks: { type: Number, default: 0 },
    sourceType: { type: String, default: 'BharatEdu Curriculum Bank' },
    sourceId: { type: String, default: '' },
    generatedBy: {
      type: String,
      enum: ['catalog', 'deterministic', 'ai', 'hybrid'],
      default: 'deterministic',
    },
    status: {
      type: String,
      enum: ['unanswered', 'answered', 'marked_for_review', 'skipped'],
      default: 'unanswered',
      index: true,
    },
  },
  { timestamps: true }
);

export const ExamPaperQuestion: Model<IExamPaperQuestion> =
  mongoose.models.ExamPaperQuestion || mongoose.model<IExamPaperQuestion>('ExamPaperQuestion', ExamPaperQuestionSchema);
