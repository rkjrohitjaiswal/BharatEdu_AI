import mongoose, { Schema, Document } from 'mongoose';

export interface IMockExamAttempt extends Document {
  attemptId: string;
  examId: string;
  studentId: string;
  attemptNumber: number;
  startedAt: Date;
  submittedAt?: Date;
  status: 'in_progress' | 'submitted' | 'evaluated' | 'expired';
  currentQuestionNumber: number;
  sectionStates: Array<{
    sectionId: string;
    completed: boolean;
    timeSpentSeconds: number;
  }>;
  answers: Array<{
    questionId: string;
    questionNumber: number;
    selectedAnswer: string;
    isCorrect?: boolean;
    marksAwarded?: number;
    timeSpentSeconds: number;
  }>;
  visitedQuestions: number[];
  markedForReview: number[];
  score: number;
  accuracy: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  timeSpentSeconds: number;
  sectionScores: Record<string, number>;
  percentileEstimate?: number;
  readinessImpact?: number;
  createdAt: Date;
  updatedAt: Date;
}

const MockExamAttemptSchema: Schema = new Schema(
  {
    attemptId: { type: String, required: true, unique: true, index: true },
    examId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    attemptNumber: { type: Number, required: true, default: 1 },
    startedAt: { type: Date, required: true, default: Date.now },
    submittedAt: { type: Date },
    status: {
      type: String,
      enum: ['in_progress', 'submitted', 'evaluated', 'expired'],
      default: 'in_progress',
    },
    currentQuestionNumber: { type: Number, default: 1 },
    sectionStates: [
      {
        sectionId: String,
        completed: Boolean,
        timeSpentSeconds: Number,
      },
    ],
    answers: [
      {
        questionId: String,
        questionNumber: Number,
        selectedAnswer: String,
        isCorrect: Boolean,
        marksAwarded: Number,
        timeSpentSeconds: Number,
      },
    ],
    visitedQuestions: [{ type: Number }],
    markedForReview: [{ type: Number }],
    score: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    attemptedCount: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    timeSpentSeconds: { type: Number, default: 0 },
    sectionScores: { type: Map, of: Number },
    percentileEstimate: { type: Number },
    readinessImpact: { type: Number },
  },
  { timestamps: true }
);

export const MockExamAttempt = mongoose.model<IMockExamAttempt>('MockExamAttempt', MockExamAttemptSchema);
