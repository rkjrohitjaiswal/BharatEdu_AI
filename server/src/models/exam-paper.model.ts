import mongoose, { Document, Model, Schema } from 'mongoose';

export type ExamPaperType =
  | 'school_exam'
  | 'unit_test'
  | 'midterm'
  | 'preboard'
  | 'board_style'
  | 'mock_exam'
  | 'practice_paper'
  | 'custom';

export type ExamPaperStatus = 'draft' | 'generated' | 'ready' | 'in_progress' | 'completed' | 'expired';

export interface IExamPaper extends Document {
  paperId: string;
  studentId: mongoose.Types.ObjectId;
  title: string;
  board: string;
  classLevel: string;
  subject: string;
  academicYear: string;
  examType: ExamPaperType;
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  difficultyDistribution: { easy: number; medium: number; hard: number };
  sectionCount: number;
  status: ExamPaperStatus;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExamPaperSchema = new Schema<IExamPaper>(
  {
    paperId: { type: String, required: true, unique: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    board: { type: String, default: 'CBSE' },
    classLevel: { type: String, default: 'Class 10' },
    subject: { type: String, default: 'Mathematics' },
    academicYear: { type: String, default: '2025-2026' },
    examType: {
      type: String,
      enum: [
        'school_exam',
        'unit_test',
        'midterm',
        'preboard',
        'board_style',
        'mock_exam',
        'practice_paper',
        'custom',
      ],
      default: 'mock_exam',
      index: true,
    },
    durationMinutes: { type: Number, default: 60 },
    totalMarks: { type: Number, default: 50 },
    questionCount: { type: Number, default: 15 },
    difficultyDistribution: {
      easy: { type: Number, default: 30 },
      medium: { type: Number, default: 50 },
      hard: { type: Number, default: 20 },
    },
    sectionCount: { type: Number, default: 3 },
    status: {
      type: String,
      enum: ['draft', 'generated', 'ready', 'in_progress', 'completed', 'expired'],
      default: 'ready',
      index: true,
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const ExamPaper: Model<IExamPaper> =
  mongoose.models.ExamPaper || mongoose.model<IExamPaper>('ExamPaper', ExamPaperSchema);
