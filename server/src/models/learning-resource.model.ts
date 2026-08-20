import mongoose, { Document, Schema } from 'mongoose';

export type ResourceType =
  | 'video'
  | 'article'
  | 'notes'
  | 'pdf'
  | 'practice'
  | 'quiz'
  | 'flashcards'
  | 'simulation'
  | 'textbook'
  | 'revision'
  | 'exam_material'
  | 'career_resource';

export interface ILearningResource extends Document {
  title: string;
  description: string;
  resourceType: ResourceType;
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  board: string;
  classLevel: string;
  language: string;
  url: string;
  provider: string;
  sourceDomain: string;
  thumbnailUrl?: string;
  estimatedMinutes: number;
  tags: string[];
  verified: boolean;
  official: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LearningResourceSchema = new Schema<ILearningResource>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    resourceType: {
      type: String,
      required: true,
      enum: [
        'video',
        'article',
        'notes',
        'pdf',
        'practice',
        'quiz',
        'flashcards',
        'simulation',
        'textbook',
        'revision',
        'exam_material',
        'career_resource',
      ],
      index: true,
    },
    subject: { type: String, required: true, index: true },
    topic: { type: String, required: true, index: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    board: { type: String, default: 'CBSE' },
    classLevel: { type: String, default: 'Class 10' },
    language: { type: String, default: 'English' },
    url: { type: String, required: true },
    provider: { type: String, default: 'BharatEdu Repository' },
    sourceDomain: { type: String, default: 'bharatedu.ai' },
    thumbnailUrl: { type: String, default: '' },
    estimatedMinutes: { type: Number, default: 15 },
    tags: [{ type: String }],
    verified: { type: Boolean, default: true },
    official: { type: Boolean, default: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const LearningResource =
  mongoose.models.LearningResource ||
  mongoose.model<ILearningResource>('LearningResource', LearningResourceSchema);
