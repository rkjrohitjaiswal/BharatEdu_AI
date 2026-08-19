import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILearningProfile extends Document {
  studentId: mongoose.Types.ObjectId;
  overallMastery: number;
  strengths: string[];
  weaknesses: string[];
  learningGoals: string[];
  recommendedTopics: mongoose.Types.ObjectId[];
  currentLearningPath: mongoose.Types.ObjectId[];
  lastAssessmentDate?: Date;
  confidenceScore: number;
  updatedAt: Date;
}

const LearningProfileSchema: Schema<ILearningProfile> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    overallMastery: {
      type: Number,
      default: 0,
      min: [0, 'Mastery score cannot be negative'],
      max: [100, 'Mastery score cannot exceed 100'],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    learningGoals: {
      type: [String],
      default: [],
    },
    recommendedTopics: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],
    currentLearningPath: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],
    lastAssessmentDate: {
      type: Date,
    },
    confidenceScore: {
      type: Number,
      default: 0,
      min: [0, 'Confidence score cannot be negative'],
      max: [100, 'Confidence score cannot exceed 100'],
    },
  },
  {
    timestamps: true,
  }
);

export const LearningProfile: Model<ILearningProfile> = mongoose.model<ILearningProfile>(
  'LearningProfile',
  LearningProfileSchema
);
