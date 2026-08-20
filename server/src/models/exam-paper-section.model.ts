import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IExamPaperSection extends Document {
  paperId: string;
  sectionId: string;
  title: string;
  instructions: string;
  sequence: number;
  questionType: string;
  questionCount: number;
  marksPerQuestion: number;
  totalMarks: number;
  negativeMarking: boolean;
  negativeMarks: number;
  durationMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExamPaperSectionSchema = new Schema<IExamPaperSection>(
  {
    paperId: { type: String, required: true, index: true },
    sectionId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    instructions: { type: String, default: '' },
    sequence: { type: Number, required: true, default: 1 },
    questionType: { type: String, default: 'mcq' },
    questionCount: { type: Number, required: true, default: 5 },
    marksPerQuestion: { type: Number, required: true, default: 1 },
    totalMarks: { type: Number, required: true, default: 5 },
    negativeMarking: { type: Boolean, default: false },
    negativeMarks: { type: Number, default: 0 },
    durationMinutes: { type: Number },
  },
  { timestamps: true }
);

export const ExamPaperSection: Model<IExamPaperSection> =
  mongoose.models.ExamPaperSection || mongoose.model<IExamPaperSection>('ExamPaperSection', ExamPaperSectionSchema);
