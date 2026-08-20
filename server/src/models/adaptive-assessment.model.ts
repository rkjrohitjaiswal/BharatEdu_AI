import mongoose, { Document, Model, Schema } from 'mongoose';
import { QuestionDifficulty } from './question.model.js';

export type AssessmentType =
  | 'diagnostic'
  | 'adaptive_practice'
  | 'remediation'
  | 'exam_prep'
  | 'revision'
  | 'mastery_check'
  | 'prerequisite_check';

export type AssessmentStatus = 'active' | 'completed' | 'abandoned';

export interface IAdaptiveAssessment extends Document {
  assessmentId: string;
  studentId: mongoose.Types.ObjectId;
  assessmentType: AssessmentType;
  targetConceptId: string;
  prerequisiteConceptIds: string[];
  questionCount: number;
  completedQuestions: number;
  correctAnswers: number;
  accuracy: number; // 0 to 100
  startingDifficulty: QuestionDifficulty;
  currentDifficulty: QuestionDifficulty;
  readinessBefore: number;
  readinessAfter: number;
  status: AssessmentStatus;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdaptiveAssessmentSchema = new Schema<IAdaptiveAssessment>(
  {
    assessmentId: { type: String, required: true, unique: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assessmentType: {
      type: String,
      enum: [
        'diagnostic',
        'adaptive_practice',
        'remediation',
        'exam_prep',
        'revision',
        'mastery_check',
        'prerequisite_check',
      ],
      default: 'adaptive_practice',
    },
    targetConceptId: { type: String, required: true, index: true },
    prerequisiteConceptIds: [{ type: String }],
    questionCount: { type: Number, default: 5 },
    completedQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0, min: 0, max: 100 },
    startingDifficulty: {
      type: String,
      enum: ['foundational', 'easy', 'medium', 'hard', 'advanced'],
      default: 'medium',
    },
    currentDifficulty: {
      type: String,
      enum: ['foundational', 'easy', 'medium', 'hard', 'advanced'],
      default: 'medium',
    },
    readinessBefore: { type: Number, default: 50 },
    readinessAfter: { type: Number, default: 50 },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
      index: true,
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const AdaptiveAssessment: Model<IAdaptiveAssessment> =
  mongoose.models.AdaptiveAssessment ||
  mongoose.model<IAdaptiveAssessment>('AdaptiveAssessment', AdaptiveAssessmentSchema);
