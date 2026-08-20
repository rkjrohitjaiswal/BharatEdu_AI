import mongoose, { Document, Schema } from 'mongoose';

export type RecommendationStatus = 'recommended' | 'started' | 'completed' | 'dismissed' | 'expired';

export interface IResourceRecommendation extends Document {
  studentId: mongoose.Types.ObjectId;
  resourceId: string;
  topic: string;
  reason: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  relevanceScore: number;
  trustScore: number;
  difficultyMatch: string;
  estimatedMinutes: number;
  sourceFeature: string;
  actionUrl: string;
  status: RecommendationStatus;
  generatedAt: Date;
  expiresAt?: Date;
  completedAt?: Date;
}

const ResourceRecommendationSchema = new Schema<IResourceRecommendation>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resourceId: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    reason: { type: String, required: true },
    priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
    relevanceScore: { type: Number, min: 0, max: 100, default: 50 },
    trustScore: { type: Number, min: 0, max: 100, default: 80 },
    difficultyMatch: { type: String, default: 'Optimal' },
    estimatedMinutes: { type: Number, default: 15 },
    sourceFeature: { type: String, default: 'Recommendation Engine' },
    actionUrl: { type: String, default: '/resources' },
    status: {
      type: String,
      enum: ['recommended', 'started', 'completed', 'dismissed', 'expired'],
      default: 'recommended',
      index: true,
    },
    generatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

ResourceRecommendationSchema.index({ studentId: 1, resourceId: 1, topic: 1 }, { unique: true });

export const ResourceRecommendation =
  mongoose.models.ResourceRecommendation ||
  mongoose.model<IResourceRecommendation>('ResourceRecommendation', ResourceRecommendationSchema);
