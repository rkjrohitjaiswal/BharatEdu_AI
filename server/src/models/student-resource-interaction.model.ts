import mongoose, { Schema, Document } from 'mongoose';

export type InteractionType = 'viewed' | 'started' | 'completed' | 'skipped' | 'bookmarked' | 'rated';

export interface IStudentResourceInteraction extends Document {
  interactionId: string;
  studentId: string;
  resourceId: string;
  interactionType: InteractionType;
  progressPercent: number;
  timeSpentSeconds: number;
  rating?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentResourceInteractionSchema = new Schema<IStudentResourceInteraction>(
  {
    interactionId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    interactionType: {
      type: String,
      required: true,
      enum: ['viewed', 'started', 'completed', 'skipped', 'bookmarked', 'rated'],
      default: 'viewed',
    },
    progressPercent: { type: Number, default: 0 },
    timeSpentSeconds: { type: Number, default: 0 },
    rating: { type: Number, min: 1, max: 5 },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const StudentResourceInteraction = mongoose.model<IStudentResourceInteraction>(
  'StudentResourceInteraction',
  StudentResourceInteractionSchema
);
export default StudentResourceInteraction;
