import mongoose, { Document, Schema } from 'mongoose';

export type ConceptMasteryStatus = 'unknown' | 'weak' | 'developing' | 'ready' | 'strong';

export interface IStudentConceptMastery extends Document {
  studentId: mongoose.Types.ObjectId;
  conceptId: string;
  masteryScore: number;
  confidenceScore: number;
  evidenceCount: number;
  lastPracticedAt?: Date;
  lastAssessedAt?: Date;
  status: ConceptMasteryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const StudentConceptMasterySchema = new Schema<IStudentConceptMastery>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    conceptId: { type: String, required: true, index: true },
    masteryScore: { type: Number, min: 0, max: 100, default: 50 },
    confidenceScore: { type: Number, min: 0, max: 100, default: 70 },
    evidenceCount: { type: Number, default: 1 },
    lastPracticedAt: { type: Date },
    lastAssessedAt: { type: Date },
    status: {
      type: String,
      enum: ['unknown', 'weak', 'developing', 'ready', 'strong'],
      default: 'developing',
      index: true,
    },
  },
  { timestamps: true }
);

StudentConceptMasterySchema.index({ studentId: 1, conceptId: 1 }, { unique: true });

export const StudentConceptMastery =
  mongoose.models.StudentConceptMastery ||
  mongoose.model<IStudentConceptMastery>('StudentConceptMastery', StudentConceptMasterySchema);
