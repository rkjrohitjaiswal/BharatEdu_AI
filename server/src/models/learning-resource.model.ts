import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningResource extends Document {
  resourceId: string;
  title: string;
  description: string;
  resourceType: 'textbook' | 'chapter' | 'article' | 'video' | 'course' | 'practice_set' | 'worksheet' | 'assessment' | 'simulation' | 'documentation' | 'reference';
  subject: string;
  topic: string;
  conceptId: string;
  classLevel: number;
  board: string;
  language: 'en' | 'hi' | 'gu';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  provider: string;
  officialSource: string;
  sourceUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  careerRelevance?: string[];
  examRelevance?: string[];
  isVerified: boolean;
  isActive: boolean;
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
      enum: ['textbook', 'chapter', 'article', 'video', 'course', 'practice_set', 'worksheet', 'assessment', 'simulation', 'documentation', 'reference'],
      index: true,
    },
    subject: { type: String, required: true, index: true },
    topic: { type: String, required: true, index: true },
    conceptId: { type: String, required: true, index: true },
    classLevel: { type: Number, required: true, index: true },
    board: { type: String, required: true, default: 'CBSE', index: true },
    language: { type: String, required: true, enum: ['en', 'hi', 'gu'], default: 'en', index: true },
    difficulty: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    estimatedMinutes: { type: Number, required: true, default: 15 },
    provider: { type: String, required: true },
    officialSource: { type: String, required: true },
    sourceUrl: { type: String },
    thumbnailUrl: { type: String },
    tags: [{ type: String }],
    prerequisites: [{ type: String }],
    learningObjectives: [{ type: String }],
    careerRelevance: [{ type: String }],
    examRelevance: [{ type: String }],
    isVerified: { type: Boolean, required: true, default: true },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

LearningResourceSchema.index({ subject: 1, topic: 1, conceptId: 1 });
LearningResourceSchema.index({ classLevel: 1, board: 1, language: 1 });

export const LearningResource = mongoose.models.LearningResource || mongoose.model<ILearningResource>('LearningResource', LearningResourceSchema);
