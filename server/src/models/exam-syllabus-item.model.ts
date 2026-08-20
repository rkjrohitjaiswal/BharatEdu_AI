import mongoose, { Schema, Document } from 'mongoose';

export interface IExamSyllabusItem extends Document {
  syllabusItemId: string;
  examId: string;
  conceptId: string;
  subject: string;
  topic: string;
  chapter?: string;
  weightage: number;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: number;
  officialSourceUrl?: string;
  syllabusVersion: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSyllabusItemSchema: Schema = new Schema(
  {
    syllabusItemId: { type: String, required: true, unique: true, index: true },
    examId: { type: String, required: true, index: true },
    conceptId: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    chapter: { type: String, default: 'General' },
    weightage: { type: Number, default: 10 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    priority: { type: Number, default: 1 },
    officialSourceUrl: { type: String, default: 'https://cbse.gov.in' },
    syllabusVersion: { type: String, default: '2026' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ExamSyllabusItem = mongoose.model<IExamSyllabusItem>('ExamSyllabusItem', ExamSyllabusItemSchema);
export default ExamSyllabusItem;
