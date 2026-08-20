import mongoose, { Document, Model, Schema } from 'mongoose';

export type EvaluationStatus = 'pending' | 'evaluating' | 'completed' | 'failed';
export type OverallPerformanceLevel = 'critical' | 'needs_improvement' | 'developing' | 'good' | 'strong';

export interface IExamEvaluation extends Document {
  evaluationId: string;
  paperId: string;
  studentId: mongoose.Types.ObjectId;
  totalMarks: number;
  earnedMarks: number;
  percentage: number;
  accuracy: number;
  completionRate: number;
  averageResponseTimeSeconds: number;
  unansweredCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  negativeMarks: number;
  evaluationStatus: EvaluationStatus;
  overallLevel: OverallPerformanceLevel;
  aiInsight?: string;
  generatedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExamEvaluationSchema = new Schema<IExamEvaluation>(
  {
    evaluationId: { type: String, required: true, unique: true, index: true },
    paperId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    totalMarks: { type: Number, required: true, default: 50 },
    earnedMarks: { type: Number, required: true, default: 0 },
    percentage: { type: Number, required: true, default: 0 },
    accuracy: { type: Number, required: true, default: 0 },
    completionRate: { type: Number, default: 100 },
    averageResponseTimeSeconds: { type: Number, default: 30 },
    unansweredCount: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    negativeMarks: { type: Number, default: 0 },
    evaluationStatus: {
      type: String,
      enum: ['pending', 'evaluating', 'completed', 'failed'],
      default: 'completed',
      index: true,
    },
    overallLevel: {
      type: String,
      enum: ['critical', 'needs_improvement', 'developing', 'good', 'strong'],
      default: 'developing',
    },
    aiInsight: { type: String, default: '' },
    generatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const ExamEvaluation: Model<IExamEvaluation> =
  mongoose.models.ExamEvaluation || mongoose.model<IExamEvaluation>('ExamEvaluation', ExamEvaluationSchema);
