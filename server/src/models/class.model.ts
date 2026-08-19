import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClass extends Document {
  name: string;
  classLevel: number;
  section: string;
  subjectIds: mongoose.Types.ObjectId[];
  teacherId: mongoose.Types.ObjectId;
  studentIds: mongoose.Types.ObjectId[];
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema<IClass> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
    },
    classLevel: {
      type: Number,
      required: [true, 'Class level is required'],
      min: 1,
      max: 12,
    },
    section: {
      type: String,
      default: 'A',
      trim: true,
    },
    subjectIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
      },
    ],
    academicYear: {
      type: String,
      default: '2026-2027',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Class: Model<IClass> = mongoose.model<IClass>('Class', ClassSchema);
