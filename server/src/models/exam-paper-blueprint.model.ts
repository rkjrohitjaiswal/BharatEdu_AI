import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IExamPaperBlueprint extends Document {
  paperId: string;
  board: string;
  classLevel: string;
  subject: string;
  examType: string;
  totalMarks: number;
  durationMinutes: number;
  sectionBlueprint: {
    sectionId: string;
    title: string;
    questionType: string;
    questionCount: number;
    marksPerQuestion: number;
    negativeMarking: boolean;
  }[];
  topicDistribution: { topicId: string; topicName: string; weightagePercent: number }[];
  difficultyDistribution: { easy: number; medium: number; hard: number };
  questionTypeDistribution: Record<string, number>;
  learningObjectiveDistribution: { recall: number; understanding: number; application: number; analysis: number };
  generatedAt: Date;
}

const ExamPaperBlueprintSchema = new Schema<IExamPaperBlueprint>(
  {
    paperId: { type: String, required: true, unique: true, index: true },
    board: { type: String, default: 'CBSE' },
    classLevel: { type: String, default: 'Class 10' },
    subject: { type: String, default: 'Mathematics' },
    examType: { type: String, default: 'mock_exam' },
    totalMarks: { type: Number, default: 50 },
    durationMinutes: { type: Number, default: 60 },
    sectionBlueprint: [
      {
        sectionId: String,
        title: String,
        questionType: String,
        questionCount: Number,
        marksPerQuestion: Number,
        negativeMarking: Boolean,
      },
    ],
    topicDistribution: [
      {
        topicId: String,
        topicName: String,
        weightagePercent: Number,
      },
    ],
    difficultyDistribution: {
      easy: { type: Number, default: 30 },
      medium: { type: Number, default: 50 },
      hard: { type: Number, default: 20 },
    },
    questionTypeDistribution: { type: Schema.Types.Mixed, default: {} },
    learningObjectiveDistribution: {
      recall: { type: Number, default: 25 },
      understanding: { type: Number, default: 40 },
      application: { type: Number, default: 25 },
      analysis: { type: Number, default: 10 },
    },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ExamPaperBlueprint: Model<IExamPaperBlueprint> =
  mongoose.models.ExamPaperBlueprint || mongoose.model<IExamPaperBlueprint>('ExamPaperBlueprint', ExamPaperBlueprintSchema);
