import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionQuality extends Document {
  questionId: string;
  validationScore: number;
  ambiguityScore: number;
  correctnessScore: number;
  difficultyFitScore: number;
  explanationScore: number;
  duplicateScore: number;
  reportedIssueCount: number;
  approved: boolean;
  rejected: boolean;
  reviewedAt?: Date;
}

const QuestionQualitySchema: Schema = new Schema(
  {
    questionId: { type: String, required: true, unique: true, index: true },
    validationScore: { type: Number, default: 90 },
    ambiguityScore: { type: Number, default: 5 },
    correctnessScore: { type: Number, default: 95 },
    difficultyFitScore: { type: Number, default: 90 },
    explanationScore: { type: Number, default: 85 },
    duplicateScore: { type: Number, default: 0 },
    reportedIssueCount: { type: Number, default: 0 },
    approved: { type: Boolean, default: true },
    rejected: { type: Boolean, default: false },
    reviewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const QuestionQuality = mongoose.model<IQuestionQuality>('QuestionQuality', QuestionQualitySchema);
