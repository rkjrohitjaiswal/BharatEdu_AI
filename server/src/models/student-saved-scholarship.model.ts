import mongoose, { Schema, Document, Model } from 'mongoose';

export type ApplicationTrackingStatus = 'not_started' | 'planning' | 'applied' | 'submitted' | 'closed';

export interface IStudentSavedScholarship extends Document {
  studentId: mongoose.Types.ObjectId;
  scholarshipId: mongoose.Types.ObjectId;
  applicationStatus: ApplicationTrackingStatus;
  savedAt: Date;
  updatedAt: Date;
}

const StudentSavedScholarshipSchema: Schema<IStudentSavedScholarship> = new Schema(
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
    applicationStatus: {
      type: String,
      enum: ['not_started', 'planning', 'applied', 'submitted', 'closed'],
      default: 'not_started',
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

StudentSavedScholarshipSchema.index({ studentId: 1, scholarshipId: 1 }, { unique: true });

export const StudentSavedScholarship: Model<IStudentSavedScholarship> = mongoose.model<IStudentSavedScholarship>(
  'StudentSavedScholarship',
  StudentSavedScholarshipSchema
);
