import mongoose, { Schema, Document } from 'mongoose';

export interface IRubricLevel {
  levelId: string;
  name: string; // excellent | good | developing | beginning
  description: string;
  marks: number;
}

export interface IRubricCriterion {
  criterionId: string;
  name: string;
  description: string;
  maxMarks: number;
  levels: IRubricLevel[];
  weight: number;
}

export interface IAssessmentRubric extends Document {
  rubricId: string;
  teacherId: string;
  name: string;
  description?: string;
  criteria: IRubricCriterion[];
  totalMarks: number;
  gradingScale?: string;
  version: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentRubricSchema = new Schema<IAssessmentRubric>(
  {
    rubricId: { type: String, required: true, unique: true, index: true },
    teacherId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    criteria: [
      {
        criterionId: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        maxMarks: { type: Number, required: true },
        levels: [
          {
            levelId: { type: String, required: true },
            name: { type: String, required: true },
            description: { type: String },
            marks: { type: Number, required: true },
          },
        ],
        weight: { type: Number, default: 1.0 },
      },
    ],
    totalMarks: { type: Number, required: true },
    gradingScale: { type: String },
    version: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AssessmentRubric =
  mongoose.models.AssessmentRubric ||
  mongoose.model<IAssessmentRubric>('AssessmentRubric', AssessmentRubricSchema);
