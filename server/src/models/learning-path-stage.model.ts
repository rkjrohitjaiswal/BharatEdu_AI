import mongoose, { Document, Model, Schema } from 'mongoose';

export type StageStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'active' | 'skipped';
export type StagePriority = 'critical' | 'high' | 'medium' | 'low';

export interface ILearningPathStage extends Document {
  learningPathId: string;
  studentId: mongoose.Types.ObjectId;
  stageOrder: number;
  stageIndex: number;
  title: string;
  description: string;
  subject: string;
  conceptIds: string[];
  topicIds: string[];
  prerequisiteConceptIds: string[];
  estimatedMinutes: number;
  completedMinutes: number;
  progressPercent: number;
  priority: StagePriority;
  status: StageStatus;
  targetMastery: number; // 0 to 100
  masteryRequired: number; // 0 to 100
  currentMastery: number; // 0 to 100
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathStageSchema = new Schema<ILearningPathStage>(
  {
    learningPathId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    stageOrder: { type: Number, required: true },
    stageIndex: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    subject: { type: String, required: true, index: true },
    conceptIds: [{ type: String }],
    topicIds: [{ type: String }],
    prerequisiteConceptIds: [{ type: String }],
    estimatedMinutes: { type: Number, default: 60 },
    completedMinutes: { type: Number, default: 0, min: 0 },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['locked', 'available', 'in_progress', 'completed', 'active', 'skipped'],
      default: 'locked',
      index: true,
    },
    targetMastery: { type: Number, default: 80, min: 0, max: 100 },
    masteryRequired: { type: Number, default: 70, min: 0, max: 100 },
    currentMastery: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

LearningPathStageSchema.index({ learningPathId: 1, stageOrder: 1 }, { unique: true });

export const LearningPathStage: Model<ILearningPathStage> =
  mongoose.models.LearningPathStage ||
  mongoose.model<ILearningPathStage>('LearningPathStage', LearningPathStageSchema);
