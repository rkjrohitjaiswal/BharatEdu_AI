import mongoose, { Schema, Document } from 'mongoose';

export interface IMockExamSection extends Document {
  examId: string;
  sectionId: string;
  name: string;
  subject: string;
  durationMinutes?: number;
  questionCount: number;
  totalMarks: number;
  passingMarks?: number;
  order: number;
  allowedQuestionTypes: string[];
  status: 'active' | 'completed' | 'locked';
  createdAt: Date;
  updatedAt: Date;
}

const MockExamSectionSchema: Schema = new Schema(
  {
    examId: { type: String, required: true, index: true },
    sectionId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    durationMinutes: { type: Number },
    questionCount: { type: Number, required: true, default: 10 },
    totalMarks: { type: Number, required: true, default: 20 },
    passingMarks: { type: Number, default: 7 },
    order: { type: Number, required: true, default: 1 },
    allowedQuestionTypes: [{ type: String, default: 'mcq' }],
    status: { type: String, enum: ['active', 'completed', 'locked'], default: 'active' },
  },
  { timestamps: true }
);

export const MockExamSection = mongoose.model<IMockExamSection>('MockExamSection', MockExamSectionSchema);
