import mongoose, { Schema, Document } from 'mongoose';

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';
export type RecommendationContext =
  | 'learning_gap'
  | 'prerequisite'
  | 'exam'
  | 'doubt'
  | 'mistake'
  | 'revision'
  | 'learning_path'
  | 'career'
  | 'goal'
  | 'risk'
  | 'practice'
  | 'general';

export interface IResourceRecommendation extends Document {
  recommendationId: string;
  studentId: string;
  resourceId: string;
  reason: string;
  priority: RecommendationPriority;
  score: number;
  recommendationContext: RecommendationContext;
  sourceEntityId?: string;
  expiresAt?: Date;
  isDismissed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceRecommendationSchema: Schema = new Schema(
  {
    recommendationId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    reason: { type: String, required: true },
    priority: {
      type: String,
      required: true,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    score: { type: Number, required: true, min: 0, max: 100 },
    recommendationContext: {
      type: String,
      required: true,
      enum: [
        'learning_gap',
        'prerequisite',
        'exam',
        'doubt',
        'mistake',
        'revision',
        'learning_path',
        'career',
        'goal',
        'risk',
        'practice',
        'general',
      ],
      default: 'general',
    },
    sourceEntityId: { type: String },
    expiresAt: { type: Date },
    isDismissed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ResourceRecommendationSchema.index({ studentId: 1, resourceId: 1, recommendationContext: 1 });

export const ResourceRecommendation = mongoose.model<IResourceRecommendation>(
  'ResourceRecommendation',
  ResourceRecommendationSchema
);
