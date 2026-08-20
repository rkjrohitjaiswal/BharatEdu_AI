import mongoose, { Schema, Document } from 'mongoose';

export interface IPersonalizedAttempt extends Document {
  attemptId: string;
  studentId: string;
  questionId: string;
  sessionId: string;
  selectedAnswer: any;
  isCorrect: boolean;
  responseTimeSeconds: number;
  hintUsed: number;
  attemptNumber: number;
  difficulty: 'easy' | 'medium' | 'hard';
  conceptId: string;
  submittedAt: Date;
}

const PersonalizedAttemptSchema: Schema = new Schema(
  {
    attemptId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    selectedAnswer: { type: Schema.Types.Mixed, required: true },
    isCorrect: { type: Boolean, required: true },
    responseTimeSeconds: { type: Number, default: 0 },
    hintUsed: { type: Number, default: 0 },
    attemptNumber: { type: Number, default: 1 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    conceptId: { type: String, required: true, index: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const PersonalizedAttempt = mongoose.model<IPersonalizedAttempt>('PersonalizedAttempt', PersonalizedAttemptSchema);
