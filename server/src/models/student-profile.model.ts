import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  classLevel: number;
  educationBoard: string;
  schoolName: string;
  dateOfBirth?: Date;
  location: string;
  preferredLanguage: 'english' | 'hindi' | 'gujarati';
  learningGoals: string[];
  interests: string[];
  learningPreferences: string[];
  currentStreak: number;
  totalLearningMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema: Schema<IStudentProfile> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    classLevel: {
      type: Number,
      default: 8,
      min: [1, 'Class level must be at least 1'],
      max: [12, 'Class level cannot exceed 12'],
    },
    educationBoard: {
      type: String,
      default: 'NCERT',
      trim: true,
    },
    schoolName: {
      type: String,
      default: '',
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    location: {
      type: String,
      default: 'India',
      trim: true,
    },
    preferredLanguage: {
      type: String,
      enum: ['english', 'hindi', 'gujarati'],
      default: 'english',
    },
    learningGoals: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    learningPreferences: {
      type: [String],
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: [0, 'Streak cannot be negative'],
    },
    totalLearningMinutes: {
      type: Number,
      default: 0,
      min: [0, 'Learning minutes cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

export const StudentProfile: Model<IStudentProfile> = mongoose.model<IStudentProfile>(
  'StudentProfile',
  StudentProfileSchema
);
