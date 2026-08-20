import mongoose, { Schema, Document } from 'mongoose';

export type EvaluationStatus =
  | 'pending'
  | 'generated'
  | 'teacher_approved'
  | 'teacher_modified'
  | 'rejected';

export interface IRubricScore {
  criterionId: string;
  criterionName: string;
  assignedScore: number;
  maxScore: number;
  feedback?: string;
}

export interface IAIEvaluation extends Document {
  evaluationId: string;
  submissionId: string;
  questionId: string;
  proposedScore: number;
  maxScore: number;
  confidence: number;
  rubricScores: IRubricScore[];
  strengths: string[];
  weaknesses: string[];
  evidence: string[];
  misconceptionTags: string[];
  feedback: string;
  recommendedActions: string[];
  modelVersion: string;
  evaluationStatus: EvaluationStatus;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AIEvaluationSchema = new Schema<IAIEvaluation>(
  {
    evaluationId: { type: String, required: true, unique: true, index: true },
    submissionId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, index: true },
    proposedScore: { type: Number, required: true, default: 0 },
    maxScore: { type: Number, required: true, default: 0 },
    confidence: { type: Number, required: true, default: 0.8 },
    rubricScores: [
      {
        criterionId: { type: String, required: true },
        criterionName: { type: String, required: true },
        assignedScore: { type: Number, required: true },
        maxScore: { type: Number, required: true },
        feedback: { type: String },
      },
    ],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    evidence: [{ type: String }],
    misconceptionTags: [{ type: String }],
    feedback: { type: String, required: true },
    recommendedActions: [{ type: String }],
    modelVersion: { type: String, default: 'bharatedu-ai-eval-v1' },
    evaluationStatus: {
      type: String,
      enum: ['pending', 'generated', 'teacher_approved', 'teacher_modified', 'rejected'],
      default: 'pending',
    },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AIEvaluation =
  mongoose.models.AIEvaluation || mongoose.model<IAIEvaluation>('AIEvaluation', AIEvaluationSchema);
