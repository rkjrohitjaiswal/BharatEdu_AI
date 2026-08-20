import mongoose, { Schema, Document } from 'mongoose';

export type ResourceType =
  | 'video'
  | 'article'
  | 'textbook'
  | 'ncert'
  | 'worksheet'
  | 'practice'
  | 'quiz'
  | 'assessment'
  | 'documentation'
  | 'coding_exercise'
  | 'simulation'
  | 'notes'
  | 'course';

export type ResourceDifficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'advanced';
export type ResourceLanguage = 'en' | 'hi' | 'gu';

export interface ILearningResource extends Document {
  resourceId: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  subject: string;
  topicId: string;
  conceptId: string;
  classLevel: string;
  board: string;
  language: ResourceLanguage;
  difficulty: ResourceDifficulty;
  estimatedMinutes: number;
  provider: string;
  author?: string;
  url?: string | null;
  thumbnailUrl?: string | null;
  official: boolean;
  verified: boolean;
  tags: string[];
  prerequisites: string[];
  careerTags: string[];
  examTags: string[];
  qualityScore: number;
  popularityScore: number;
  freshnessScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const LearningResourceSchema: Schema = new Schema(
  {
    resourceId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    resourceType: {
      type: String,
      required: true,
      enum: [
        'video',
        'article',
        'textbook',
        'ncert',
        'worksheet',
        'practice',
        'quiz',
        'assessment',
        'documentation',
        'coding_exercise',
        'simulation',
        'notes',
        'course',
      ],
      index: true,
    },
    subject: { type: String, required: true, index: true },
    topicId: { type: String, required: true, index: true },
    conceptId: { type: String, required: true, index: true },
    classLevel: { type: String, required: true, index: true },
    board: { type: String, required: true, index: true },
    language: { type: String, required: true, enum: ['en', 'hi', 'gu'], default: 'en', index: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'easy', 'medium', 'hard', 'advanced'],
      default: 'medium',
    },
    estimatedMinutes: { type: Number, required: true, default: 15 },
    provider: { type: String, required: true },
    author: { type: String },
    url: { type: String, default: null },
    thumbnailUrl: { type: String, default: null },
    official: { type: Boolean, default: false },
    verified: { type: Boolean, default: false, index: true },
    tags: { type: [String], default: [] },
    prerequisites: { type: [String], default: [] },
    careerTags: { type: [String], default: [] },
    examTags: { type: [String], default: [] },
    qualityScore: { type: Number, default: 80, min: 0, max: 100 },
    popularityScore: { type: Number, default: 50, min: 0, max: 100 },
    freshnessScore: { type: Number, default: 90, min: 0, max: 100 },
  },
  { timestamps: true }
);

LearningResourceSchema.index({ conceptId: 1, topicId: 1, subject: 1 });
LearningResourceSchema.index({ board: 1, classLevel: 1 });

export const LearningResource = mongoose.model<ILearningResource>('LearningResource', LearningResourceSchema);
