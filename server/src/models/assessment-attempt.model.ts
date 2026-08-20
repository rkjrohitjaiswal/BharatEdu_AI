import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentAttempt extends Document {
  attemptId: string;
  assessmentId: string;
  studentId: string;
  startedAt: Date;
  submittedAt?: Date;
  status: 'not_started' | 'in_progress' | 'submitted' | 'evaluated';
  questionCount: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  timeSpentSeconds: number;
  evaluationVersion: string;
  createdAt: Date;
}

const AssessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    attemptId: { type: String, required: true, unique: true, index: true },
    assessmentId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'submitted', 'evaluated'],
      default: 'in_progress',
      index: true,
    },
    questionCount: { type: Number, default: 0 },
    answeredCount: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    obtainedMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    timeSpentSeconds: { type: Number, default: 0 },
    evaluationVersion: { type: String, default: 'v1.0' },
  },
  { timestamps: true }
);

AssessmentAttemptSchema.index({ studentId: 1, assessmentId: 1 });

export const AssessmentAttempt =
  mongoose.models.AssessmentAttempt || mongoose.model<IAssessmentAttempt>('AssessmentAttempt', AssessmentAttemptSchema);
