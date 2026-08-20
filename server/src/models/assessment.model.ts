import mongoose, { Schema, Document } from 'mongoose';

export type AssessmentType =
  | 'assignment'
  | 'quiz'
  | 'subjective_test'
  | 'coding_assessment'
  | 'project'
  | 'worksheet'
  | 'mixed';

export type AssessmentStatus = 'draft' | 'published' | 'closed' | 'archived';

export interface IAssessment extends Document {
  assessmentId: string;
  teacherId: string;
  title: string;
  description?: string;
  subject: string;
  topic?: string;
  conceptIds: string[];
  classLevel: string;
  board: string;
  assessmentType: AssessmentType;
  instructions?: string;
  totalMarks: number;
  passingMarks: number;
  durationMinutes?: number;
  dueAt?: Date;
  lateSubmissionAllowed: boolean;
  latePenaltyPercent: number;
  status: AssessmentStatus;
  rubricId?: string;
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    assessmentId: { type: String, required: true, unique: true, index: true },
    teacherId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: String, required: true },
    topic: { type: String },
    conceptIds: [{ type: String }],
    classLevel: { type: String, required: true },
    board: { type: String, required: true },
    assessmentType: {
      type: String,
      enum: ['assignment', 'quiz', 'subjective_test', 'coding_assessment', 'project', 'worksheet', 'mixed'],
      default: 'assignment',
    },
    instructions: { type: String },
    totalMarks: { type: Number, required: true, default: 100 },
    passingMarks: { type: Number, required: true, default: 33 },
    durationMinutes: { type: Number },
    dueAt: { type: Date },
    lateSubmissionAllowed: { type: Boolean, default: true },
    latePenaltyPercent: { type: Number, default: 10 },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed', 'archived'],
      default: 'draft',
      index: true,
    },
    rubricId: { type: String },
    questionCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Assessment =
  mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
