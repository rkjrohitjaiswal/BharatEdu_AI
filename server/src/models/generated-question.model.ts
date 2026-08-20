import mongoose, { Schema, Document } from 'mongoose';

export interface IGeneratedQuestion extends Document {
  questionId: string;
  generationId: string;
  studentId: string;
  conceptId: string;
  topicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  generationReason: string;
  generatedAt: Date;
  validationStatus: 'pending' | 'validated' | 'rejected';
  qualityScore: number;
  usedInSession?: string;
  expiresAt?: Date;
}

const GeneratedQuestionSchema: Schema = new Schema(
  {
    questionId: { type: String, required: true, index: true },
    generationId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true },
    conceptId: { type: String, required: true, index: true },
    topicId: { type: String, required: true, index: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    generationReason: { type: String, default: 'adaptive_practice' },
    generatedAt: { type: Date, default: Date.now },
    validationStatus: { type: String, enum: ['pending', 'validated', 'rejected'], default: 'validated' },
    qualityScore: { type: Number, default: 80 },
    usedInSession: { type: String },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export const GeneratedQuestion = mongoose.model<IGeneratedQuestion>('GeneratedQuestion', GeneratedQuestionSchema);
