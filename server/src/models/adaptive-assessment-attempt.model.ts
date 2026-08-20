import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAdaptiveAssessmentAttempt extends Document {
  assessmentId: string;
  questionId: string;
  studentId: mongoose.Types.ObjectId;
  selectedAnswer?: string;
  answerText?: string;
  submittedAnswer?: string;
  isCorrect: boolean;
  marksAwarded: number;
  responseTimeSeconds: number;
  confidence?: number;
  evaluatedBy: 'deterministic' | 'ai' | 'hybrid';
  feedback?: string;
  createdAt: Date;
}

const AdaptiveAssessmentAttemptSchema = new Schema<IAdaptiveAssessmentAttempt>(
  {
    assessmentId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    selectedAnswer: { type: String, default: '' },
    answerText: { type: String, default: '' },
    submittedAnswer: { type: String, default: '' },
    isCorrect: { type: Boolean, required: true },
    marksAwarded: { type: Number, required: true, default: 0 },
    responseTimeSeconds: { type: Number, default: 30 },
    confidence: { type: Number, default: 100 },
    evaluatedBy: {
      type: String,
      enum: ['deterministic', 'ai', 'hybrid'],
      default: 'deterministic',
    },
    feedback: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AdaptiveAssessmentAttempt: Model<IAdaptiveAssessmentAttempt> =
  mongoose.models.AdaptiveAssessmentAttempt ||
  mongoose.model<IAdaptiveAssessmentAttempt>('AdaptiveAssessmentAttempt', AdaptiveAssessmentAttemptSchema);
