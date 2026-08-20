import mongoose, { Document, Model, Schema } from 'mongoose';

export type EvaluationMethod = 'deterministic' | 'rubric' | 'semantic' | 'hybrid';

export interface IQuestionEvaluation extends Document {
  evaluationId: string;
  paperId: string;
  questionId: string;
  studentId: mongoose.Types.ObjectId;
  questionType: string;
  topicId: string;
  conceptId: string;
  difficulty: string;
  submittedAnswer: string;
  isCorrect: boolean;
  marksAvailable: number;
  marksAwarded: number;
  negativeMarks: number;
  responseTimeSeconds: number;
  confidence: number;
  evaluationMethod: EvaluationMethod;
  misconceptionType?: string;
  feedback: string;
  createdAt: Date;
}

const QuestionEvaluationSchema = new Schema<IQuestionEvaluation>(
  {
    evaluationId: { type: String, required: true, index: true },
    paperId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questionType: { type: String, default: 'mcq' },
    topicId: { type: String, default: 'Algebra' },
    conceptId: { type: String, default: 'math_linear_eq' },
    difficulty: { type: String, default: 'medium' },
    submittedAnswer: { type: String, default: '' },
    isCorrect: { type: Boolean, required: true },
    marksAvailable: { type: Number, required: true, default: 1 },
    marksAwarded: { type: Number, required: true, default: 0 },
    negativeMarks: { type: Number, default: 0 },
    responseTimeSeconds: { type: Number, default: 30 },
    confidence: { type: Number, default: 80 },
    evaluationMethod: {
      type: String,
      enum: ['deterministic', 'rubric', 'semantic', 'hybrid'],
      default: 'deterministic',
    },
    misconceptionType: { type: String },
    feedback: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const QuestionEvaluation: Model<IQuestionEvaluation> =
  mongoose.models.QuestionEvaluation || mongoose.model<IQuestionEvaluation>('QuestionEvaluation', QuestionEvaluationSchema);
