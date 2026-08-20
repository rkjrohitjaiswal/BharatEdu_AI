import mongoose, { Schema, Document } from 'mongoose';

export type InteractionType =
  | 'viewed'
  | 'started'
  | 'completed'
  | 'bookmarked'
  | 'skipped'
  | 'helpful'
  | 'not_helpful'
  | 'opened';

export interface IResourceInteraction extends Document {
  resourceId: string;
  studentId: string;
  interactionType: InteractionType;
  progressPercent: number;
  durationSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceInteractionSchema: Schema = new Schema(
  {
    resourceId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    interactionType: {
      type: String,
      required: true,
      enum: ['viewed', 'started', 'completed', 'bookmarked', 'skipped', 'helpful', 'not_helpful', 'opened'],
    },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    durationSeconds: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

ResourceInteractionSchema.index({ studentId: 1, resourceId: 1 });

export const ResourceInteraction = mongoose.model<IResourceInteraction>(
  'ResourceInteraction',
  ResourceInteractionSchema
);
