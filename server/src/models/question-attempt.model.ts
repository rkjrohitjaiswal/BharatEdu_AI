import mongoose, { Document, Model, Schema } from 'mongoose';
import { QuestionDifficulty } from './question.model.js';

export interface IQuestionAttempt extends Document {
  studentId: mongoose.Types.ObjectId;
  questionId: string;
  conceptId: string;
  assessmentId?: string;
  selectedAnswer: string;
  isCorrect: boolean;
  responseTimeSeconds: number;
  hintsUsed: number;
  attemptNumber: number;
  difficulty: QuestionDifficulty;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionAttemptSchema = new Schema<IQuestionAttempt>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questionId: { type: String, required: true, index: true },
    conceptId: { type: String, required: true, index: true },
    assessmentId: { type: String, index: true },
    selectedAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    responseTimeSeconds: { type: Number, default: 0 },
    hintsUsed: { type: Number, default: 0 },
    attemptNumber: { type: Number, default: 1 },
    difficulty: {
      type: String,
      enum: ['foundational', 'easy', 'medium', 'hard', 'advanced'],
      default: 'medium',
    },
  },
  { timestamps: true }
);

QuestionAttemptSchema.index({ studentId: 1, questionId: 1 });

export const QuestionAttempt: Model<IQuestionAttempt> =
  mongoose.models.QuestionAttempt ||
  mongoose.model<IQuestionAttempt>('QuestionAttempt', QuestionAttemptSchema);
