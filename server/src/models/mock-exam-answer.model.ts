import mongoose, { Schema, Document } from 'mongoose';

export interface IMockExamAnswer extends Document {
  attemptId: string;
  questionId: string;
  studentId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  marksAwarded: number;
  timeSpentSeconds: number;
  submittedAt: Date;
}

const MockExamAnswerSchema: Schema = new Schema(
  {
    attemptId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    selectedAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    marksAwarded: { type: Number, required: true },
    timeSpentSeconds: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MockExamAnswer = mongoose.model<IMockExamAnswer>('MockExamAnswer', MockExamAnswerSchema);
