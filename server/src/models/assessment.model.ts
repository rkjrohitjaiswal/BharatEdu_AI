import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  assessmentId: string;
  teacherId?: string;
  classId?: string;
  studentId?: string;
  title: string;
  description: string;
  subject: string;
  classLevel: number;
  board: string;
  assessmentType: 'diagnostic' | 'practice' | 'formative' | 'summative' | 'mock_exam' | 'adaptive' | 'revision' | 'remedial';
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  status: 'draft' | 'published' | 'active' | 'completed' | 'archived';
  source: 'teacher' | 'system' | 'ai';
  createdAt: Date;
  publishedAt?: Date;
  completedAt?: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    assessmentId: { type: String, required: true, unique: true, index: true },
    teacherId: { type: String, index: true },
    classId: { type: String, index: true },
    studentId: { type: String, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    subject: { type: String, required: true, index: true },
    classLevel: { type: Number, required: true, index: true },
    board: { type: String, default: 'CBSE', index: true },
    assessmentType: {
      type: String,
      enum: ['diagnostic', 'practice', 'formative', 'summative', 'mock_exam', 'adaptive', 'revision', 'remedial'],
      default: 'practice',
      index: true,
    },
    durationMinutes: { type: Number, default: 30 },
    totalQuestions: { type: Number, default: 10 },
    totalMarks: { type: Number, default: 100 },
    passingMarks: { type: Number, default: 40 },
    status: {
      type: String,
      enum: ['draft', 'published', 'active', 'completed', 'archived'],
      default: 'draft',
      index: true,
    },
    source: { type: String, enum: ['teacher', 'system', 'ai'], default: 'ai' },
    publishedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

AssessmentSchema.index({ teacherId: 1, classId: 1 });
AssessmentSchema.index({ studentId: 1, status: 1 });

export const Assessment = mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
