import mongoose, { Schema, Document } from 'mongoose';

export type ResourceType =
  | 'video'
  | 'article'
  | 'textbook'
  | 'notes'
  | 'worksheet'
  | 'quiz'
  | 'practice'
  | 'simulation'
  | 'coding'
  | 'course';

export type ResourceLanguage = 'en' | 'hi' | 'gu';
export type ResourceDifficulty = 'beginner' | 'standard' | 'advanced';
export type ResourceStatus = 'active' | 'inactive' | 'pending_review';

export interface ILearningResource extends Document {
  resourceId: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  subject: string;
  topic: string;
  conceptId: string;
  classLevel: number;
  board: string;
  language: ResourceLanguage;
  difficulty: ResourceDifficulty;
  durationMinutes: number;
  provider: string;
  url: string;
  thumbnailUrl?: string;
  author?: string;
  officialSource?: string;
  verified: boolean;
  verificationDate?: Date;
  tags: string[];
  syllabusVersion?: string;
  status: ResourceStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LearningResourceSchema = new Schema<ILearningResource>(
  {
    resourceId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    resourceType: {
      type: String,
      required: true,
      enum: ['video', 'article', 'textbook', 'notes', 'worksheet', 'quiz', 'practice', 'simulation', 'coding', 'course'],
      default: 'article',
      index: true,
    },
    subject: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    conceptId: { type: String, required: true, index: true },
    classLevel: { type: Number, required: true, default: 10 },
    board: { type: String, required: true, default: 'CBSE' },
    language: { type: String, enum: ['en', 'hi', 'gu'], default: 'en' },
    difficulty: { type: String, enum: ['beginner', 'standard', 'advanced'], default: 'standard' },
    durationMinutes: { type: Number, required: true, default: 15 },
    provider: { type: String, required: true, default: 'NCERT Official' },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    author: { type: String, default: 'NCERT' },
    officialSource: { type: String, default: 'https://ncert.nic.in' },
    verified: { type: Boolean, default: true, index: true },
    verificationDate: { type: Date, default: Date.now },
    tags: [{ type: String }],
    syllabusVersion: { type: String, default: '2026' },
    status: { type: String, enum: ['active', 'inactive', 'pending_review'], default: 'active', index: true },
  },
  { timestamps: true }
);

export const LearningResource = mongoose.model<ILearningResource>('LearningResource', LearningResourceSchema);
export default LearningResource;
