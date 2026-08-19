import mongoose, { Schema, Document, Model } from 'mongoose';

export type MatchStatus = 'potential_match' | 'needs_information' | 'likely_not_match' | 'expired';

export interface IScholarshipMatch extends Document {
  studentId: mongoose.Types.ObjectId;
  scholarshipId: mongoose.Types.ObjectId;
  matchScore: number;
  matchedCriteria: string[];
  unmetCriteria: string[];
  unknownCriteria: string[];
  confidence: number;
  explanation: string;
  status: MatchStatus;
  generatedAt: Date;
  lastUpdatedAt: Date;
}

const ScholarshipMatchSchema: Schema<IScholarshipMatch> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scholarshipId: {
      type: Schema.Types.ObjectId,
      ref: 'Scholarship',
      required: true,
      index: true,
    },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    matchedCriteria: [{ type: String }],
    unmetCriteria: [{ type: String }],
    unknownCriteria: [{ type: String }],
    confidence: { type: Number, required: true, min: 0, max: 1 },
    explanation: { type: String, default: '' },
    status: {
      type: String,
      enum: ['potential_match', 'needs_information', 'likely_not_match', 'expired'],
      default: 'potential_match',
      index: true,
    },
    generatedAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

ScholarshipMatchSchema.index({ studentId: 1, scholarshipId: 1 }, { unique: true });

export const ScholarshipMatch: Model<IScholarshipMatch> = mongoose.model<IScholarshipMatch>(
  'ScholarshipMatch',
  ScholarshipMatchSchema
);
