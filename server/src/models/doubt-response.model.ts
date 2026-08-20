import mongoose, { Document, Model, Schema } from 'mongoose';

export type DoubtResponseType = 'deterministic' | 'rag' | 'ai' | 'hybrid';

export interface IDoubtResponseStep {
  stepNumber: number;
  title: string;
  description: string;
  formula?: string;
}

export interface IDoubtSourceReference {
  sourceType: string;
  sourceId?: string;
  officialSourceUrl?: string;
  title: string;
}

export interface IDoubtResponse extends Document {
  doubtId: string;
  studentId: mongoose.Types.ObjectId;
  responseId: string;
  answer: string;
  explanation: string;
  steps: IDoubtResponseStep[];
  keyConcepts: string[];
  prerequisiteConcepts: string[];
  examples: string[];
  commonMistakes: string[];
  verificationNotes: string;
  confidence: number;
  sourceReferences: IDoubtSourceReference[];
  responseType: DoubtResponseType;
  generatedAt: Date;
  createdAt: Date;
}

const DoubtResponseSchema = new Schema<IDoubtResponse>(
  {
    doubtId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    responseId: { type: String, required: true, unique: true, index: true },
    answer: { type: String, required: true },
    explanation: { type: String, required: true },
    steps: [
      {
        stepNumber: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        formula: { type: String },
      },
    ],
    keyConcepts: [{ type: String }],
    prerequisiteConcepts: [{ type: String }],
    examples: [{ type: String }],
    commonMistakes: [{ type: String }],
    verificationNotes: { type: String, default: '' },
    confidence: { type: Number, default: 90 },
    sourceReferences: [
      {
        sourceType: { type: String, default: 'internal_explanation' },
        sourceId: { type: String },
        officialSourceUrl: { type: String },
        title: { type: String, default: 'BharatEdu AI Curriculum Bank' },
      },
    ],
    responseType: {
      type: String,
      enum: ['deterministic', 'rag', 'ai', 'hybrid'],
      default: 'hybrid',
    },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const DoubtResponse: Model<IDoubtResponse> =
  mongoose.models.DoubtResponse || mongoose.model<IDoubtResponse>('DoubtResponse', DoubtResponseSchema);
