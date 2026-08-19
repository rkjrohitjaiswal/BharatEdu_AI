import mongoose, { Schema, Document, Model } from 'mongoose';

export type SessionStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface IPracticeQuestionItem {
  questionId?: mongoose.Types.ObjectId | string;
  questionText: string;
  questionType: 'mcq' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string; // Stored securely on server, stripped when sending to client before submission
  explanation: string;
  difficulty: QuestionDifficulty;
  learningObjective?: string;
  presentedAt?: Date;
  answeredAt?: Date;
  studentAnswer?: string;
  isCorrect?: boolean;
  score?: number;
  timeSpentSeconds?: number;
  confidence?: number;
  feedback?: string;
  sources?: any[];
}

export interface IPracticeSession extends Document {
  studentId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  learningGapId?: mongoose.Types.ObjectId;
  questions: IPracticeQuestionItem[];
  currentQuestionIndex: number;
  difficulty: QuestionDifficulty;
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  score: number;
  status: SessionStatus;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeQuestionItemSchema = new Schema(
  {
    questionId: { type: Schema.Types.Mixed },
    questionText: { type: String, required: true, trim: true },
    questionType: { type: String, enum: ['mcq', 'true_false', 'short_answer'], default: 'mcq' },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    learningObjective: { type: String },
    presentedAt: { type: Date, default: Date.now },
    answeredAt: { type: Date },
    studentAnswer: { type: String },
    isCorrect: { type: Boolean },
    score: { type: Number, default: 0 },
    timeSpentSeconds: { type: Number, default: 0 },
    confidence: { type: Number, default: 0.5 },
    feedback: { type: String },
    sources: [{ type: Schema.Types.Mixed }],
  },
  { _id: true }
);

const PracticeSessionSchema: Schema<IPracticeSession> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    learningGapId: {
      type: Schema.Types.ObjectId,
      ref: 'LearningGap',
    },
    questions: [PracticeQuestionItemSchema],
    currentQuestionIndex: { type: Number, default: 0 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    totalQuestions: { type: Number, default: 5 },
    completedQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
      index: true,
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

PracticeSessionSchema.index({ studentId: 1, status: 1 });
PracticeSessionSchema.index({ studentId: 1, createdAt: -1 });

export const PracticeSessionModel: Model<IPracticeSession> = mongoose.model<IPracticeSession>(
  'PracticeSession',
  PracticeSessionSchema
);
