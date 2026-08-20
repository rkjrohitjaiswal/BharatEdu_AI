import mongoose, { Document, Model, Schema } from 'mongoose';

export type ResourceProgressStatus = 'started' | 'completed';

export interface IStudentResourceProgress extends Document {
  studentId: mongoose.Types.ObjectId;
  resourceId: string;
  status: ResourceProgressStatus;
  progressPercent: number; // 0 to 100
  lastOpenedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentResourceProgressSchema = new Schema<IStudentResourceProgress>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resourceId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['started', 'completed'],
      default: 'started',
      index: true,
    },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    lastOpenedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

StudentResourceProgressSchema.index({ studentId: 1, resourceId: 1 }, { unique: true });

export const StudentResourceProgress: Model<IStudentResourceProgress> =
  mongoose.models.StudentResourceProgress ||
  mongoose.model<IStudentResourceProgress>('StudentResourceProgress', StudentResourceProgressSchema);
