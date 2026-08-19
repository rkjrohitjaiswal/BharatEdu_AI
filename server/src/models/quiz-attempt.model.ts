import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuizAnswer {
  questionId: mongoose.Types.ObjectId;
  studentAnswer: string;
  isCorrect: boolean;
  timeTakenSeconds: number;
}

export interface IQuizAttempt extends Document {
  studentId: mongoose.Types.ObjectId;
  questionIds: mongoose.Types.ObjectId[];
  answers: IQuizAnswer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSeconds: number;
  subjectId?: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  difficulty: string;
  startedAt: Date;
  completedAt: Date;
}

const QuizAttemptSchema: Schema<IQuizAttempt> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questionIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        studentAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        timeTakenSeconds: { type: Number, default: 0, min: 0 },
      },
    ],
    score: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    totalQuestions: {
      type: Number,
      default: 0,
      min: [0, 'Total questions cannot be negative'],
    },
    correctAnswers: {
      type: Number,
      default: 0,
      min: [0, 'Correct answers cannot be negative'],
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
      min: [0, 'Time spent cannot be negative'],
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
    },
    difficulty: {
      type: String,
      default: 'intermediate',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const QuizAttempt: Model<IQuizAttempt> = mongoose.model<IQuizAttempt>(
  'QuizAttempt',
  QuizAttemptSchema
);
