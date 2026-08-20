import mongoose, { Document, Model, Schema } from 'mongoose';

export type DoubtFeedbackType = 'incorrect' | 'confusing' | 'too_easy' | 'too_hard' | 'incomplete' | 'helpful';

export interface IDoubtFeedback extends Document {
  doubtId: string;
  studentId: mongoose.Types.ObjectId;
  responseId: string;
  helpful: boolean;
  feedbackType: DoubtFeedbackType;
  comment?: string;
  createdAt: Date;
}

const DoubtFeedbackSchema = new Schema<IDoubtFeedback>(
  {
    doubtId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    responseId: { type: String, required: true },
    helpful: { type: Boolean, required: true },
    feedbackType: {
      type: String,
      enum: ['incorrect', 'confusing', 'too_easy', 'too_hard', 'incomplete', 'helpful'],
      default: 'helpful',
    },
    comment: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const DoubtFeedback: Model<IDoubtFeedback> =
  mongoose.models.DoubtFeedback || mongoose.model<IDoubtFeedback>('DoubtFeedback', DoubtFeedbackSchema);
