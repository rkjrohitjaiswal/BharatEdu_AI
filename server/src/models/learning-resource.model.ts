import mongoose, { Document, Schema } from 'mongoose';

export type ResourceType =
  | 'article'
  | 'video'
  | 'practice'
  | 'assessment'
  | 'notes'
  | 'worksheet'
  | 'reference'
  | 'course'
  | 'pdf'
  | 'quiz'
  | 'flashcards'
  | 'simulation'
  | 'textbook'
  | 'revision'
  | 'exam_material'
  | 'career_resource';

export interface ILearningResource extends Document {
  resourceId: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  subject: string;
  topic: string;
  conceptId?: string;
  classLevel: string;
  board: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'foundational' | 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  provider: string;
  officialSourceUrl?: string;
  tags: string[];
  language: string;
  isVerified: boolean;
  active: boolean;

  // Backward compatibility fields
  url?: string;
  verified?: boolean;
  official?: boolean;
  sourceDomain?: string;

  createdAt: Date;
  updatedAt: Date;
}

const LearningResourceSchema = new Schema<ILearningResource>(
  {
    resourceId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    resourceType: {
      type: String,
      required: true,
      enum: [
        'article',
        'video',
        'practice',
        'assessment',
        'notes',
        'worksheet',
        'reference',
        'course',
        'pdf',
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
    conceptId: { type: String, index: true },
    classLevel: { type: String, default: 'Class 10' },
    board: { type: String, default: 'CBSE' },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'foundational', 'easy', 'medium', 'hard'],
      default: 'medium',
    },
    estimatedMinutes: { type: Number, default: 15 },
    provider: { type: String, default: 'BharatEdu Repository' },
    officialSourceUrl: { type: String, default: '' },
    tags: [{ type: String }],
    language: { type: String, default: 'English' },
    isVerified: { type: Boolean, default: true },
    active: { type: Boolean, default: true, index: true },

    // Backward compatibility fields
    url: { type: String },
    verified: { type: Boolean, default: true },
    official: { type: Boolean, default: true },
    sourceDomain: { type: String, default: 'bharatedu.ai' },
  },
  { timestamps: true }
);

export const LearningResource =
  mongoose.models.LearningResource ||
  mongoose.model<ILearningResource>('LearningResource', LearningResourceSchema);
