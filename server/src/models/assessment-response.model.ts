import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentResponse extends Document {
  responseId: string;
  attemptId: string;
  questionId: string;
  studentId: string;
  answer: any;
  isCorrect?: boolean;
  marksAwarded?: number;
  timeSpentSeconds: number;
  confidence?: 'low' | 'medium' | 'high';
  isFlagged?: boolean;
  submittedAt: Date;
}

const AssessmentResponseSchema = new Schema<IAssessmentResponse>(
  {
    responseId: { type: String, required: true, unique: true, index: true },
    attemptId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    answer: { type: Schema.Types.Mixed },
    isCorrect: { type: Boolean },
    marksAwarded: { type: Number, default: 0 },
    timeSpentSeconds: { type: Number, default: 0 },
    confidence: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    isFlagged: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AssessmentResponseSchema.index({ attemptId: 1, questionId: 1 });

export const AssessmentResponse =
  mongoose.models.AssessmentResponse || mongoose.model<IAssessmentResponse>('AssessmentResponse', AssessmentResponseSchema);
