import mongoose, { Schema, Document } from 'mongoose';

export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'late'
  | 'under_review'
  | 'ai_evaluated'
  | 'teacher_reviewed'
  | 'returned';

export interface IAssessmentSubmission extends Document {
  submissionId: string;
  assessmentId: string;
  studentId: string;
  submittedAt?: Date;
  status: SubmissionStatus;
  attemptNumber: number;
  totalQuestions: number;
  answeredQuestions: number;
  completionPercent: number;
  lateByMinutes: number;
  finalScore: number;
  percentage: number;
  teacherFinalized: boolean;
  returnedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSubmissionSchema = new Schema<IAssessmentSubmission>(
  {
    submissionId: { type: String, required: true, unique: true, index: true },
    assessmentId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    submittedAt: { type: Date },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'late', 'under_review', 'ai_evaluated', 'teacher_reviewed', 'returned'],
      default: 'draft',
      index: true,
    },
    attemptNumber: { type: Number, default: 1 },
    totalQuestions: { type: Number, default: 0 },
    answeredQuestions: { type: Number, default: 0 },
    completionPercent: { type: Number, default: 0 },
    lateByMinutes: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    teacherFinalized: { type: Boolean, default: false },
    returnedAt: { type: Date },
  },
  { timestamps: true }
);

export const AssessmentSubmission =
  mongoose.models.AssessmentSubmission ||
  mongoose.model<IAssessmentSubmission>('AssessmentSubmission', AssessmentSubmissionSchema);
