import mongoose, { Schema, Document, Model } from 'mongoose';

export type ScholarshipSource = 'official' | 'ai_aggregated';
export type ScholarshipStatus = 'active' | 'closed' | 'upcoming';

export interface IScholarship extends Document {
  name: string;
  provider: string;
  description: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationUrl: string;
  deadline?: Date;
  deadlineType?: 'fixed' | 'rolling' | 'unknown';
  deadlineVerified?: boolean;
  deadlineSourceUrl?: string;
  deadlineVerifiedAt?: Date;
  educationLevels: string[];
  locations: string[];
  incomeCriteria: string;
  categoryCriteria: string[];
  status: ScholarshipStatus;
  source: ScholarshipSource;
  createdAt: Date;
  updatedAt: Date;
}

const ScholarshipSchema: Schema<IScholarship> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Scholarship name is required'],
      trim: true,
    },
    provider: {
      type: String,
      required: [true, 'Provider name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    eligibilityCriteria: {
      type: [String],
      default: [],
    },
    requiredDocuments: {
      type: [String],
      default: [],
    },
    applicationUrl: {
      type: String,
      default: '',
      trim: true,
    },
    deadline: {
      type: Date,
      index: true,
    },
    deadlineType: {
      type: String,
      enum: ['fixed', 'rolling', 'unknown'],
      default: 'fixed',
    },
    deadlineVerified: {
      type: Boolean,
      default: true,
    },
    deadlineSourceUrl: {
      type: String,
      default: '',
      trim: true,
    },
    deadlineVerifiedAt: {
      type: Date,
    },
    educationLevels: {
      type: [String],
      default: [],
    },
    locations: {
      type: [String],
      default: ['All India'],
    },
    incomeCriteria: {
      type: String,
      default: '',
      trim: true,
    },
    categoryCriteria: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'upcoming'],
      default: 'active',
      index: true,
    },
    source: {
      type: String,
      enum: ['official', 'ai_aggregated'],
      default: 'official',
    },
  },
  {
    timestamps: true,
  }
);

export const Scholarship: Model<IScholarship> = mongoose.model<IScholarship>(
  'Scholarship',
  ScholarshipSchema
);
