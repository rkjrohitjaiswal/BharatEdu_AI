import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDoubtFollowup extends Document {
  doubtId: string;
  studentId: mongoose.Types.ObjectId;
  parentResponseId: string;
  question: string;
  responseId: string;
  answer: string;
  explanation: string;
  createdAt: Date;
}

const DoubtFollowupSchema = new Schema<IDoubtFollowup>(
  {
    doubtId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    parentResponseId: { type: String, required: true },
    question: { type: String, required: true },
    responseId: { type: String, required: true, unique: true, index: true },
    answer: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const DoubtFollowup: Model<IDoubtFollowup> =
  mongoose.models.DoubtFollowup || mongoose.model<IDoubtFollowup>('DoubtFollowup', DoubtFollowupSchema);
