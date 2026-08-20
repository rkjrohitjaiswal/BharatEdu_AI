import mongoose, { Document, Model, Schema } from 'mongoose';

export type StageStatus = 'locked' | 'available' | 'active' | 'completed' | 'skipped';
export type StagePriority = 'critical' | 'high' | 'medium' | 'low';

export interface ILearningPathStage extends Document {
  learningPathId: string;
  studentId: mongoose.Types.ObjectId;
  stageIndex: number;
  title: string;
  description: string;
  subject: string;
  conceptIds: string[];
  topicIds: string[];
  prerequisiteConceptIds: string[];
  estimatedMinutes: number;
  priority: StagePriority;
  status: StageStatus;
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
    stageIndex: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    subject: { type: String, required: true, index: true },
    conceptIds: [{ type: String }],
    topicIds: [{ type: String }],
    prerequisiteConceptIds: [{ type: String }],
    estimatedMinutes: { type: Number, default: 60 },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['locked', 'available', 'active', 'completed', 'skipped'],
      default: 'locked',
      index: true,
    },
    masteryRequired: { type: Number, default: 75, min: 0, max: 100 },
    currentMastery: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

LearningPathStageSchema.index({ learningPathId: 1, stageIndex: 1 }, { unique: true });

export const LearningPathStage: Model<ILearningPathStage> =
  mongoose.models.LearningPathStage ||
  mongoose.model<ILearningPathStage>('LearningPathStage', LearningPathStageSchema);
