import mongoose, { Schema, Document } from 'mongoose';

export interface IResourceRecommendationDoc extends Document {
  studentId: string;
  resourceId: string;
  reason: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendationScore: number;
  sourceSignals: string[];
  targetConcepts: string[];
  targetGaps: string[];
  targetGoals?: string[];
  examRelevance?: string[];
  careerRelevance?: string[];
  status: 'recommended' | 'viewed' | 'started' | 'completed' | 'dismissed';
  generatedAt: Date;
  expiresAt?: Date;
}

const ResourceRecommendationSchema = new Schema<IResourceRecommendationDoc>(
  {
    studentId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    reason: { type: String, required: true },
    priority: { type: String, required: true, enum: ['critical', 'high', 'medium', 'low'], default: 'medium', index: true },
    recommendationScore: { type: Number, required: true, min: 0, max: 100 },
    sourceSignals: [{ type: String }],
    targetConcepts: [{ type: String }],
    targetGaps: [{ type: String }],
    targetGoals: [{ type: String }],
    examRelevance: [{ type: String }],
    careerRelevance: [{ type: String }],
    status: {
      type: String,
      required: true,
      enum: ['recommended', 'viewed', 'started', 'completed', 'dismissed'],
      default: 'recommended',
      index: true,
    },
    generatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

ResourceRecommendationSchema.index({ studentId: 1, recommendationScore: -1 });

export const ResourceRecommendation = mongoose.models.ResourceRecommendation || mongoose.model<IResourceRecommendationDoc>('ResourceRecommendation', ResourceRecommendationSchema);
