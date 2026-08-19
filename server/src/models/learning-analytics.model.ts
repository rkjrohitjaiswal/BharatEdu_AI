import mongoose, { Document, Schema } from 'mongoose';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type AnalyticsType = 'student_snapshot' | 'class_snapshot' | 'parent_summary';

export interface ILearningAnalytics extends Document {
  studentId?: mongoose.Types.ObjectId | string;
  teacherId?: mongoose.Types.ObjectId | string;
  type: AnalyticsType;
  overallMastery: number;
  practiceAccuracy: number;
  studyTimeMinutes: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
  summaryText?: string;
  snapshotDate: Date;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const learningAnalyticsSchema = new Schema<ILearningAnalytics>(
  {
    studentId: { type: Schema.Types.Mixed, ref: 'User', index: true },
    teacherId: { type: Schema.Types.Mixed, ref: 'User', index: true },
    type: {
      type: String,
      enum: ['student_snapshot', 'class_snapshot', 'parent_summary'],
      required: true,
      index: true,
    },
    overallMastery: { type: Number, default: 0, min: 0, max: 100 },
    practiceAccuracy: { type: Number, default: 0, min: 0, max: 100 },
    studyTimeMinutes: { type: Number, default: 0 },
    riskLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      default: 'low',
      index: true,
    },
    riskFactors: [{ type: String }],
    summaryText: { type: String },
    snapshotDate: { type: Date, default: Date.now, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

learningAnalyticsSchema.index({ studentId: 1, snapshotDate: -1 });

export const LearningAnalyticsModel = mongoose.model<ILearningAnalytics>(
  'LearningAnalytics',
  learningAnalyticsSchema
);
