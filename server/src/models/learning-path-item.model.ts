import mongoose, { Document, Model, Schema } from 'mongoose';

export type LearningPathItemType =
  | 'concept'
  | 'topic'
  | 'practice'
  | 'revision'
  | 'exam'
  | 'goal'
  | 'resource'
  | 'learn'
  | 'remediation'
  | 'assessment'
  | 'exam_prep';

export type LearningPathItemStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'skipped' | 'pending' | 'active';

export interface ILearningPathItem extends Document {
  learningPathId: string;
  stageId: string;
  studentId: mongoose.Types.ObjectId;
  itemType: LearningPathItemType;
  referenceId?: string;
  title: string;
  description: string;
  conceptId?: string;
  topicId?: string;
  resourceId?: string;
  estimatedMinutes: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: LearningPathItemStatus;
  masteryBefore: number; // 0 to 100
  masteryAfter: number; // 0 to 100
  order: number;
  scheduledDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathItemSchema = new Schema<ILearningPathItem>(
  {
    learningPathId: { type: String, required: true, index: true },
    stageId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ['concept', 'topic', 'practice', 'revision', 'exam', 'goal', 'resource', 'learn', 'remediation', 'assessment', 'exam_prep'],
      default: 'concept',
      index: true,
    },
    referenceId: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    conceptId: { type: String, default: '', index: true },
    topicId: { type: String, default: '' },
    resourceId: { type: String, default: '' },
    estimatedMinutes: { type: Number, default: 15 },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['locked', 'available', 'in_progress', 'completed', 'skipped', 'pending', 'active'],
      default: 'available',
      index: true,
    },
    masteryBefore: { type: Number, default: 50, min: 0, max: 100 },
    masteryAfter: { type: Number, default: 50, min: 0, max: 100 },
    order: { type: Number, default: 1 },
    scheduledDate: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const LearningPathItem: Model<ILearningPathItem> =
  mongoose.models.LearningPathItem ||
  mongoose.model<ILearningPathItem>('LearningPathItem', LearningPathItemSchema);
