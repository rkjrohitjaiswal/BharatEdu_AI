import mongoose, { Document, Model, Schema } from 'mongoose';

export type MisconceptionCategoryType =
  | 'prerequisite_gap'
  | 'concept_confusion'
  | 'formula_error'
  | 'calculation_error'
  | 'terminology_error'
  | 'reasoning_gap'
  | 'careless_error'
  | 'time_management'
  | 'incomplete_answer'
  | 'repeated_pattern';

export type MisconceptionSeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type MisconceptionStatus = 'active' | 'improving' | 'resolved';

export interface IStudentMisconception extends Document {
  studentId: mongoose.Types.ObjectId;
  topicId: string;
  conceptId: string;
  misconceptionType: MisconceptionCategoryType;
  description: string;
  evidenceCount: number;
  firstDetectedAt: Date;
  lastDetectedAt: Date;
  severity: MisconceptionSeverityLevel;
  status: MisconceptionStatus;
  sourceEvaluationId?: string;
  recommendedAction: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentMisconceptionSchema = new Schema<IStudentMisconception>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topicId: { type: String, required: true },
    conceptId: { type: String, required: true, index: true },
    misconceptionType: {
      type: String,
      enum: [
        'prerequisite_gap',
        'concept_confusion',
        'formula_error',
        'calculation_error',
        'terminology_error',
        'reasoning_gap',
        'careless_error',
        'time_management',
        'incomplete_answer',
        'repeated_pattern',
      ],
      default: 'concept_confusion',
      index: true,
    },
    description: { type: String, required: true },
    evidenceCount: { type: Number, default: 1 },
    firstDetectedAt: { type: Date, default: Date.now },
    lastDetectedAt: { type: Date, default: Date.now },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['active', 'improving', 'resolved'],
      default: 'active',
      index: true,
    },
    sourceEvaluationId: { type: String },
    recommendedAction: { type: String, default: '' },
  },
  { timestamps: true }
);

export const StudentMisconception: Model<IStudentMisconception> =
  mongoose.models.StudentMisconception || mongoose.model<IStudentMisconception>('StudentMisconception', StudentMisconceptionSchema);
