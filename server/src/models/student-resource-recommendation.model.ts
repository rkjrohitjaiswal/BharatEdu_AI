import mongoose, { Document, Model, Schema } from 'mongoose';

export type RecommendationType =
  | 'prerequisite_repair'
  | 'learning_path_next'
  | 'weak_topic'
  | 'exam_prep'
  | 'revision'
  | 'practice'
  | 'career_skill'
  | 'goal_aligned'
  | 'risk_recovery'
  | 'enrichment';

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';
export type RecommendationStatus = 'recommended' | 'started' | 'completed' | 'dismissed';

export interface IStudentResourceRecommendation extends Document {
  studentId: mongoose.Types.ObjectId;
  resourceId: string;
  reason: string;
  recommendationType: RecommendationType;
  priority: RecommendationPriority;
  relevanceScore: number; // 0 to 100
  difficultyMatch: number;
  masteryMatch: number;
  goalMatch: number;
  examMatch: number;
  careerMatch: number;
  riskMatch: number;
  prerequisiteMatch: number;
  estimatedMinutes: number;
  status: RecommendationStatus;
  recommendedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  dismissedAt?: Date;
  dedupeKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentResourceRecommendationSchema = new Schema<IStudentResourceRecommendation>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resourceId: { type: String, required: true, index: true },
    reason: { type: String, required: true },
    recommendationType: {
      type: String,
      enum: [
        'prerequisite_repair',
        'learning_path_next',
        'weak_topic',
        'exam_prep',
        'revision',
        'practice',
        'career_skill',
        'goal_aligned',
        'risk_recovery',
        'enrichment',
      ],
      default: 'learning_path_next',
      index: true,
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
      index: true,
    },
    relevanceScore: { type: Number, default: 75, min: 0, max: 100, index: true },
    difficultyMatch: { type: Number, default: 80, min: 0, max: 100 },
    masteryMatch: { type: Number, default: 75, min: 0, max: 100 },
    goalMatch: { type: Number, default: 50, min: 0, max: 100 },
    examMatch: { type: Number, default: 50, min: 0, max: 100 },
    careerMatch: { type: Number, default: 50, min: 0, max: 100 },
    riskMatch: { type: Number, default: 50, min: 0, max: 100 },
    prerequisiteMatch: { type: Number, default: 90, min: 0, max: 100 },
    estimatedMinutes: { type: Number, default: 15 },
    status: {
      type: String,
      enum: ['recommended', 'started', 'completed', 'dismissed'],
      default: 'recommended',
      index: true,
    },
    recommendedAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
    completedAt: { type: Date },
    dismissedAt: { type: Date },
    dedupeKey: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

StudentResourceRecommendationSchema.index({ studentId: 1, dedupeKey: 1 }, { unique: true });

export const StudentResourceRecommendation: Model<IStudentResourceRecommendation> =
  mongoose.models.StudentResourceRecommendation ||
  mongoose.model<IStudentResourceRecommendation>('StudentResourceRecommendation', StudentResourceRecommendationSchema);
