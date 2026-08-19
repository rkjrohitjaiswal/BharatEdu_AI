import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentScholarshipProfile extends Document {
  studentId: mongoose.Types.ObjectId;
  educationLevel: string;
  classLevel: number;
  board: string;
  state: string;
  district?: string;
  annualFamilyIncome?: number;
  category?: string;
  academicPercentage?: number;
  institutionType?: string;
  gender?: string;
  disabilityStatus?: boolean;
  otherRelevantCriteria?: string[];
  lastUpdatedAt: Date;
}

const StudentScholarshipProfileSchema: Schema<IStudentScholarshipProfile> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    educationLevel: { type: String, default: 'Class 8' },
    classLevel: { type: Number, default: 8 },
    board: { type: String, default: 'NCERT' },
    state: { type: String, default: 'All India' },
    district: { type: String, default: '' },
    annualFamilyIncome: { type: Number },
    category: { type: String, default: 'General' },
    academicPercentage: { type: Number, default: 75 },
    institutionType: { type: String, default: 'Government' },
    gender: { type: String },
    disabilityStatus: { type: Boolean, default: false },
    otherRelevantCriteria: [{ type: String }],
    lastUpdatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const StudentScholarshipProfileModel: Model<IStudentScholarshipProfile> = mongoose.model<IStudentScholarshipProfile>(
  'StudentScholarshipProfile',
  StudentScholarshipProfileSchema
);
