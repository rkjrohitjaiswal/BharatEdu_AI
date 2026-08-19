import mongoose, { Document, Schema } from 'mongoose';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type RiskTrend = 'improving' | 'stable' | 'worsening';

export interface IRiskAction {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl: string;
}

export interface IRiskPrediction extends Document {
  studentId: mongoose.Types.ObjectId | string;
  riskScore: number;
  riskLevel: RiskLevel;
  riskTrend: RiskTrend;
  contributingFactors: string[];
  recommendedActions: IRiskAction[];
  aiExplanation?: string;
  evaluatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const riskPredictionSchema = new Schema<IRiskPrediction>(
  {
    studentId: { type: Schema.Types.Mixed, ref: 'User', required: true, index: true },
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    riskLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      required: true,
      index: true,
    },
    riskTrend: {
      type: String,
      enum: ['improving', 'stable', 'worsening'],
      default: 'stable',
    },
    contributingFactors: [{ type: String }],
    recommendedActions: [
      {
        title: { type: String },
        description: { type: String },
        priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'] },
        actionUrl: { type: String },
      },
    ],
    aiExplanation: { type: String },
    evaluatedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

riskPredictionSchema.index({ studentId: 1, evaluatedAt: -1 });

export const RiskPredictionModel = mongoose.model<IRiskPrediction>(
  'RiskPrediction',
  riskPredictionSchema
);
