import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentBlueprint extends Document {
  blueprintId: string;
  teacherId?: string;
  classId?: string;
  studentId?: string;
  subject: string;
  classLevel: number;
  board: string;
  objectives: string[];
  conceptDistribution: Record<string, number>;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  questionTypeDistribution: Record<string, number>;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  examDate?: Date;
  createdAt: Date;
}

const AssessmentBlueprintSchema = new Schema<IAssessmentBlueprint>(
  {
    blueprintId: { type: String, required: true, unique: true, index: true },
    teacherId: { type: String, index: true },
    classId: { type: String, index: true },
    studentId: { type: String, index: true },
    subject: { type: String, required: true },
    classLevel: { type: Number, required: true },
    board: { type: String, default: 'CBSE' },
    objectives: [{ type: String }],
    conceptDistribution: { type: Map, of: Number, default: {} },
    difficultyDistribution: {
      easy: { type: Number, default: 30 },
      medium: { type: Number, default: 50 },
      hard: { type: Number, default: 20 },
    },
    questionTypeDistribution: { type: Map, of: Number, default: {} },
    totalQuestions: { type: Number, default: 10 },
    totalMarks: { type: Number, default: 100 },
    durationMinutes: { type: Number, default: 30 },
    examDate: { type: Date },
  },
  { timestamps: true }
);

export const AssessmentBlueprint =
  mongoose.models.AssessmentBlueprint || mongoose.model<IAssessmentBlueprint>('AssessmentBlueprint', AssessmentBlueprintSchema);
