import mongoose, { Schema, Document } from 'mongoose';

export type ExamStatus = 'active' | 'archived' | 'draft';

export interface IExamProfile extends Document {
  examId: string;
  examName: string;
  examType: string;
  organization?: string;
  board: string;
  classLevel: number;
  subject: string;
  syllabusVersion?: string;
  officialSourceUrl?: string;
  examDate: Date;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questionCount: number;
  status: ExamStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ExamProfileSchema: Schema = new Schema(
  {
    examId: { type: String, required: true, unique: true, index: true },
    examName: { type: String, required: true },
    examType: { type: String, default: 'board' },
    organization: { type: String, default: 'CBSE' },
    board: { type: String, required: true, default: 'CBSE' },
    classLevel: { type: Number, required: true, default: 10 },
    subject: { type: String, required: true },
    syllabusVersion: { type: String, default: '2026' },
    officialSourceUrl: { type: String, default: 'https://cbse.gov.in' },
    examDate: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, default: 180 },
    totalMarks: { type: Number, required: true, default: 80 },
    passingMarks: { type: Number, required: true, default: 26 },
    questionCount: { type: Number, required: true, default: 30 },
    status: { type: String, enum: ['active', 'archived', 'draft'], default: 'active' },
  },
  { timestamps: true }
);

export const ExamProfile = mongoose.model<IExamProfile>('ExamProfile', ExamProfileSchema);
export default ExamProfile;
