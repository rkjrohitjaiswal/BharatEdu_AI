import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeacherProfile extends Document {
  userId: mongoose.Types.ObjectId;
  schoolName: string;
  subjects: string[];
  classLevels: number[];
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherProfileSchema: Schema<ITeacherProfile> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    schoolName: {
      type: String,
      default: '',
      trim: true,
    },
    subjects: {
      type: [String],
      default: [],
    },
    classLevels: {
      type: [Number],
      default: [],
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TeacherProfile: Model<ITeacherProfile> = mongoose.model<ITeacherProfile>(
  'TeacherProfile',
  TeacherProfileSchema
);
