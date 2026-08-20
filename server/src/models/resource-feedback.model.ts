import mongoose, { Schema, Document } from 'mongoose';

export interface IResourceFeedback extends Document {
  feedbackId: string;
  studentId: string;
  resourceId: string;
  rating: number;
  helpful: boolean;
  difficultyFeedback?: 'too_easy' | 'just_right' | 'too_hard';
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceFeedbackSchema = new Schema<IResourceFeedback>(
  {
    feedbackId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    helpful: { type: Boolean, required: true, default: true },
    difficultyFeedback: { type: String, enum: ['too_easy', 'just_right', 'too_hard'], default: 'just_right' },
    comment: { type: String },
  },
  { timestamps: true }
);

export const ResourceFeedback = mongoose.model<IResourceFeedback>('ResourceFeedback', ResourceFeedbackSchema);
export default ResourceFeedback;
