import mongoose, { Schema, Document, Model } from 'mongoose';

export type SourceType = 'government' | 'official_institution' | 'official_provider' | 'trusted_public_source';
export type VerificationStatus = 'verified' | 'needs_review' | 'expired' | 'archived';

export interface IScholarshipSource extends Document {
  scholarshipId: mongoose.Types.ObjectId;
  title: string;
  publisher: string;
  sourceUrl: string;
  sourceType: SourceType;
  retrievedAt: Date;
  lastVerifiedAt: Date;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ScholarshipSourceSchema: Schema<IScholarshipSource> = new Schema(
  {
    scholarshipId: {
      type: Schema.Types.ObjectId,
      ref: 'Scholarship',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    publisher: { type: String, required: true, trim: true },
    sourceUrl: { type: String, required: true, trim: true },
    sourceType: {
      type: String,
      enum: ['government', 'official_institution', 'official_provider', 'trusted_public_source'],
      default: 'government',
    },
    retrievedAt: { type: Date, default: Date.now },
    lastVerifiedAt: { type: Date, default: Date.now },
    verificationStatus: {
      type: String,
      enum: ['verified', 'needs_review', 'expired', 'archived'],
      default: 'verified',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ScholarshipSourceModel: Model<IScholarshipSource> = mongoose.model<IScholarshipSource>(
  'ScholarshipSource',
  ScholarshipSourceSchema
);
