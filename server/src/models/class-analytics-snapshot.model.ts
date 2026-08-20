import mongoose, { Schema, Document } from 'mongoose';

export interface IClassAnalyticsSnapshot extends Document {
  teacherId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  mastery: number;
  practiceAccuracy: number;
  assessmentScore: number;
  examReadiness: number;
  riskScore: number;
  consistency: number;
  completionRate: number;
  engagement: number;
  learningVelocity: number;
  createdAt: Date;
}

const ClassAnalyticsSnapshotSchema: Schema = new Schema(
  {
    teacherId: { type: String, required: true, index: true },
    classId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    mastery: { type: Number, default: 0 },
    practiceAccuracy: { type: Number, default: 0 },
    assessmentScore: { type: Number, default: 0 },
    examReadiness: { type: Number, default: 0 },
    riskScore: { type: Number, default: 0 },
    consistency: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    learningVelocity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ClassAnalyticsSnapshotSchema.index({ classId: 1, date: 1 }, { unique: true });

export const ClassAnalyticsSnapshot = mongoose.model<IClassAnalyticsSnapshot>(
  'ClassAnalyticsSnapshot',
  ClassAnalyticsSnapshotSchema
);
