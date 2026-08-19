import mongoose, { Schema, Document, Model } from 'mongoose';

export type AnalysisType = 'quiz_answer' | 'practice_attempt' | 'tutor_doubt' | 'assessment';
export type DetectedGapType = 'knowledge_gap' | 'prerequisite_gap' | 'misconception' | 'practice_gap' | 'none';
export type GapSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ILearningAnalysisEvent extends Document {
  studentId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  evidenceId: string;
  analysisType: AnalysisType;
  isCorrect: boolean;
  studentAnswer?: string;
  detectedGapType: DetectedGapType;
  severity: GapSeverity;
  confidence: number;
  evidenceSummary: string;
  recommendedAction: {
    type: string;
    reason: string;
  };
  createdAt: Date;
}

const LearningAnalysisEventSchema: Schema<ILearningAnalysisEvent> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    evidenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    analysisType: {
      type: String,
      enum: ['quiz_answer', 'practice_attempt', 'tutor_doubt', 'assessment'],
      default: 'practice_attempt',
    },
    isCorrect: { type: Boolean, required: true },
    studentAnswer: { type: String, default: '' },
    detectedGapType: {
      type: String,
      enum: ['knowledge_gap', 'prerequisite_gap', 'misconception', 'practice_gap', 'none'],
      default: 'none',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    confidence: { type: Number, required: true, min: 0, max: 1 },
    evidenceSummary: { type: String, required: true, trim: true },
    recommendedAction: {
      type: { type: String, required: true },
      reason: { type: String, required: true },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

LearningAnalysisEventSchema.index({ studentId: 1, createdAt: -1 });
LearningAnalysisEventSchema.index({ studentId: 1, topicId: 1 });

export const LearningAnalysisEventModel: Model<ILearningAnalysisEvent> = mongoose.model<ILearningAnalysisEvent>(
  'LearningAnalysisEvent',
  LearningAnalysisEventSchema
);
