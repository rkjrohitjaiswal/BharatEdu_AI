import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAdaptiveAssessmentContext extends Document {
  assessmentId: string;
  studentId: mongoose.Types.ObjectId;
  topicId: string;
  conceptId: string;
  masteryScore: number;
  confidenceScore: number;
  riskLevel: string;
  examUrgency: boolean;
  learningPathPriority: number;
  revisionPriority: number;
  mistakeFrequency: number;
  recommendedDifficulty: string;
  capturedAt: Date;
}

const AdaptiveAssessmentContextSchema = new Schema<IAdaptiveAssessmentContext>(
  {
    assessmentId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topicId: { type: String, default: 'Algebra' },
    conceptId: { type: String, default: 'math_linear_eq' },
    masteryScore: { type: Number, default: 50 },
    confidenceScore: { type: Number, default: 70 },
    riskLevel: { type: String, default: 'LOW' },
    examUrgency: { type: Boolean, default: false },
    learningPathPriority: { type: Number, default: 1 },
    revisionPriority: { type: Number, default: 1 },
    mistakeFrequency: { type: Number, default: 0 },
    recommendedDifficulty: { type: String, default: 'medium' },
    capturedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AdaptiveAssessmentContext: Model<IAdaptiveAssessmentContext> =
  mongoose.models.AdaptiveAssessmentContext ||
  mongoose.model<IAdaptiveAssessmentContext>('AdaptiveAssessmentContext', AdaptiveAssessmentContextSchema);
