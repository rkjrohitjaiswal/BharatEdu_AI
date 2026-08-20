import mongoose, { Schema, Document } from 'mongoose';

export interface ICollaborationAction extends Document {
  actionId: string;
  threadId: string;
  interventionId?: string;
  actionType: 'practice' | 'revision' | 'study_plan' | 'learning_path' | 'doubt_solver' | 'exam_prep' | 'resource' | 'parent_support' | 'teacher_followup';
  title: string;
  description: string;
  targetUrl?: string;
  assignedTo: string;
  assignedBy: string;
  dueDate?: Date;
  status: 'pending' | 'started' | 'completed' | 'skipped';
  completedAt?: Date;
  createdAt: Date;
}

const CollaborationActionSchema: Schema = new Schema(
  {
    actionId: { type: String, required: true, unique: true, index: true },
    threadId: { type: String, required: true, index: true },
    interventionId: { type: String, index: true },
    actionType: {
      type: String,
      enum: ['practice', 'revision', 'study_plan', 'learning_path', 'doubt_solver', 'exam_prep', 'resource', 'parent_support', 'teacher_followup'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetUrl: { type: String },
    assignedTo: { type: String, required: true, index: true },
    assignedBy: { type: String, required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ['pending', 'started', 'completed', 'skipped'], default: 'pending' },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const CollaborationAction = mongoose.model<ICollaborationAction>(
  'CollaborationAction',
  CollaborationActionSchema
);
