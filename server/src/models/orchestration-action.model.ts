import mongoose, { Schema, Document } from 'mongoose';

export type OrchestrationActionType =
  | 'study'
  | 'practice'
  | 'revise'
  | 'assessment'
  | 'mock_exam'
  | 'doubt'
  | 'resource'
  | 'learning_path'
  | 'exam_prep'
  | 'recovery'
  | 'goal';

export type OrchestrationPriority = 'critical' | 'high' | 'medium' | 'low';
export type OrchestrationActionStatus = 'recommended' | 'started' | 'completed' | 'skipped' | 'blocked';

export interface IOrchestrationAction extends Document {
  actionId: string;
  studentId: string;
  actionType: OrchestrationActionType;
  sourceFeature: string;
  conceptId: string;
  topic: string;
  title: string;
  description: string;
  priority: OrchestrationPriority;
  estimatedMinutes: number;
  reason: string;
  actionUrl: string;
  prerequisiteActionId?: string;
  status: OrchestrationActionStatus;
  createdAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}

const OrchestrationActionSchema = new Schema<IOrchestrationAction>(
  {
    actionId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true },
    actionType: {
      type: String,
      required: true,
      enum: ['study', 'practice', 'revise', 'assessment', 'mock_exam', 'doubt', 'resource', 'learning_path', 'exam_prep', 'recovery', 'goal'],
      default: 'study',
    },
    sourceFeature: { type: String, required: true, default: 'orchestrator' },
    conceptId: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      required: true,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
      index: true,
    },
    estimatedMinutes: { type: Number, required: true, default: 15 },
    reason: { type: String, required: true },
    actionUrl: { type: String, required: true },
    prerequisiteActionId: { type: String },
    status: {
      type: String,
      required: true,
      enum: ['recommended', 'started', 'completed', 'skipped', 'blocked'],
      default: 'recommended',
      index: true,
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const OrchestrationAction = mongoose.model<IOrchestrationAction>(
  'OrchestrationAction',
  OrchestrationActionSchema
);
export default OrchestrationAction;
