import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  description: string;
  classLevels: number[];
  language: 'english' | 'hindi' | 'gujarati';
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema<ISubject> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    classLevels: {
      type: [Number],
      default: [6, 7, 8, 9, 10, 11, 12],
    },
    language: {
      type: String,
      enum: ['english', 'hindi', 'gujarati'],
      default: 'english',
    },
  },
  {
    timestamps: true,
  }
);

export const Subject: Model<ISubject> = mongoose.model<ISubject>('Subject', SubjectSchema);
