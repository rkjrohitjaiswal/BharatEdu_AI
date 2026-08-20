import mongoose, { Schema, Document } from 'mongoose';

export interface IResourceInteraction extends Document {
  studentId: string;
  resourceId: string;
  action: 'viewed' | 'started' | 'completed' | 'skipped' | 'saved' | 'rated';
  durationSeconds?: number;
  rating?: number;
  helpful?: boolean;
  createdAt: Date;
  completedAt?: Date;
}

const ResourceInteractionSchema = new Schema<IResourceInteraction>(
  {
    studentId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    action: {
      type: String,
      required: true,
      enum: ['viewed', 'started', 'completed', 'skipped', 'saved', 'rated'],
      index: true,
    },
    durationSeconds: { type: Number, default: 0 },
    rating: { type: Number, min: 1, max: 5 },
    helpful: { type: Boolean },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

ResourceInteractionSchema.index({ studentId: 1, resourceId: 1, action: 1 });

export const ResourceInteraction = mongoose.models.ResourceInteraction || mongoose.model<IResourceInteraction>('ResourceInteraction', ResourceInteractionSchema);
