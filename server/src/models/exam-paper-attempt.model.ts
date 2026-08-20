import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IExamPaperAttempt extends Document {
  paperId: string;
  questionId: string;
  studentId: mongoose.Types.ObjectId;
  answer: string;
  submittedAt: Date;
  responseTimeSeconds: number;
  isCorrect: boolean;
  marksAwarded: number;
  negativeMarksApplied: number;
  feedback?: string;
  createdAt: Date;
}

const ExamPaperAttemptSchema = new Schema<IExamPaperAttempt>(
  {
    paperId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    answer: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
    responseTimeSeconds: { type: Number, default: 30 },
    isCorrect: { type: Boolean, required: true },
    marksAwarded: { type: Number, required: true, default: 0 },
    negativeMarksApplied: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ExamPaperAttempt: Model<IExamPaperAttempt> =
  mongoose.models.ExamPaperAttempt || mongoose.model<IExamPaperAttempt>('ExamPaperAttempt', ExamPaperAttemptSchema);
