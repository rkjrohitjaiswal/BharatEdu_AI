import mongoose, { Schema, Document, Model } from 'mongoose';

export type GapType = 'knowledge_gap' | 'prerequisite_gap' | 'misconception' | 'practice_gap';
export type GapSeverity = 'low' | 'medium' | 'high' | 'critical';
export type GapStatus = 'active' | 'improving' | 'resolved';

export interface ILearningGap extends Document {
  studentId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  gapType: GapType;
  severity: GapSeverity;
  confidence: number;
  evidence: string;
  detectedAt: Date;
  resolvedAt?: Date;
  status: GapStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LearningGapSchema: Schema<ILearningGap> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    gapType: {
      type: String,
      enum: ['knowledge_gap', 'prerequisite_gap', 'misconception', 'practice_gap'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    confidence: {
      type: Number,
      default: 50,
      min: [0, 'Confidence score cannot be negative'],
      max: [100, 'Confidence score cannot exceed 100'],
    },
    evidence: {
      type: String,
      default: '',
      trim: true,
    },
    detectedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'improving', 'resolved'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
LearningGapSchema.index({ studentId: 1, status: 1 });
LearningGapSchema.index({ topicId: 1, status: 1 });

export const LearningGap: Model<ILearningGap> = mongoose.model<ILearningGap>(
  'LearningGap',
  LearningGapSchema
);
