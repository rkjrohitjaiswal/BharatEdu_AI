import mongoose, { Schema, Document } from 'mongoose';

export type ExamType =
  | 'full_length'
  | 'sectional'
  | 'topic_test'
  | 'revision_test'
  | 'adaptive_mock'
  | 'board_mock'
  | 'competitive_mock';

export type MockExamStatus =
  | 'draft'
  | 'ready'
  | 'in_progress'
  | 'submitted'
  | 'evaluated'
  | 'expired';

export interface IMockExam extends Document {
  examId: string;
  studentId?: string;
  title: string;
  examType: ExamType;
  board: string;
  classLevel: string;
  targetExam: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  negativeMarks: number;
  totalQuestions: number;
  sections: Array<{
    sectionId: string;
    name: string;
    subject: string;
    questionCount: number;
    totalMarks: number;
  }>;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  status: MockExamStatus;
  type?: 'diagnostic' | 'sectional' | 'full_length' | 'weak_topic' | 'final_simulation';
  questionCount?: number;
  generatedAt?: Date;
  startedAt?: Date;
  submittedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MockExamSchema: Schema = new Schema(
  {
    examId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, index: true },
    title: { type: String, required: true },
    examType: {
      type: String,
      enum: [
        'full_length',
        'sectional',
        'topic_test',
        'revision_test',
        'adaptive_mock',
        'board_mock',
        'competitive_mock',
      ],
      default: 'full_length',
    },
    board: { type: String, default: 'CBSE' },
    classLevel: { type: String, default: 'Class 10' },
    targetExam: { type: String, default: 'Class 10 Board Exam' },
    durationMinutes: { type: Number, required: true, default: 180 },
    totalMarks: { type: Number, required: true, default: 100 },
    passingMarks: { type: Number, required: true, default: 33 },
    negativeMarking: { type: Boolean, default: true },
    negativeMarks: { type: Number, default: 0.25 },
    totalQuestions: { type: Number, required: true, default: 50 },
    sections: [
      {
        sectionId: String,
        name: String,
        subject: String,
        questionCount: Number,
        totalMarks: Number,
      },
    ],
    difficultyDistribution: {
      easy: { type: Number, default: 40 },
      medium: { type: Number, default: 40 },
      hard: { type: Number, default: 20 },
    },
    status: {
      type: String,
      enum: ['draft', 'ready', 'in_progress', 'submitted', 'evaluated', 'expired'],
      default: 'ready',
    },
    startedAt: { type: Date },
    submittedAt: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export const MockExam = mongoose.model<IMockExam>('MockExam', MockExamSchema);
