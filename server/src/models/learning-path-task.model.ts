import mongoose, { Document, Model, Schema } from 'mongoose';

export type TaskType =
  | 'learn'
  | 'practice'
  | 'revise'
  | 'assessment'
  | 'resource'
  | 'remediation'
  | 'exam_prep';

export type TaskStatus = 'pending' | 'active' | 'completed' | 'skipped';

export interface ILearningPathTask extends Document {
  learningPathId: string;
  stageId: string;
  studentId: mongoose.Types.ObjectId;
  taskType: TaskType;
  title: string;
  description: string;
  conceptId: string;
  topicId: string;
  resourceId?: string;
  estimatedMinutes: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  scheduledDate?: Date;
  status: TaskStatus;
  completedAt?: Date;
  sourceType?: string;
  sourceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathTaskSchema = new Schema<ILearningPathTask>(
  {
    learningPathId: { type: String, required: true, index: true },
    stageId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    taskType: {
      type: String,
      enum: ['learn', 'practice', 'revise', 'assessment', 'resource', 'remediation', 'exam_prep'],
      default: 'learn',
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    conceptId: { type: String, required: true, index: true },
    topicId: { type: String, required: true },
    resourceId: { type: String, default: '' },
    estimatedMinutes: { type: Number, default: 15 },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    scheduledDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'skipped'],
      default: 'pending',
      index: true,
    },
    completedAt: { type: Date },
    sourceType: { type: String, default: 'learning_path' },
    sourceId: { type: String, default: '' },
  },
  { timestamps: true }
);

export const LearningPathTask: Model<ILearningPathTask> =
  mongoose.models.LearningPathTask ||
  mongoose.model<ILearningPathTask>('LearningPathTask', LearningPathTaskSchema);
