import mongoose, { Document, Schema } from 'mongoose';

export type ResourceType =
  | 'video'
  | 'article'
  | 'textbook'
  | 'documentation'
  | 'notes'
  | 'exercise'
  | 'quiz'
  | 'practice'
  | 'simulation'
  | 'project'
  | 'assessment'
  | 'worksheet'
  | 'reference'
  | 'course'
  | 'pdf'
  | 'flashcards'
  | 'revision'
  | 'exam_material'
  | 'career_resource';

export interface ILearningResource extends Document {
  resourceId: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  subject: string;
  classLevel: string;
  board: string;
  topicIds: string[];
  conceptIds: string[];
  skillIds: string[];
  careerIds: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'foundational' | 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  language: string;
  provider: string;
  officialSource?: string;
  officialSourceUrl?: string;
  url?: string;
  qualityScore: number; // 0 to 100
  isVerified: boolean;
  tags: string[];
  active: boolean;

  // Backward compatibility
  topic?: string;
  conceptId?: string;
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
        'video',
        'article',
        'textbook',
        'documentation',
        'notes',
        'exercise',
        'quiz',
        'practice',
        'simulation',
        'project',
        'assessment',
        'worksheet',
        'reference',
        'course',
        'pdf',
        'flashcards',
        'revision',
        'exam_material',
        'career_resource',
      ],
      index: true,
    },
    subject: { type: String, required: true, index: true },
    classLevel: { type: String, default: 'Class 10' },
    board: { type: String, default: 'CBSE' },
    topicIds: [{ type: String }],
    conceptIds: [{ type: String }],
    skillIds: [{ type: String }],
    careerIds: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'foundational', 'easy', 'medium', 'hard'],
      default: 'medium',
    },
    estimatedMinutes: { type: Number, default: 15 },
    language: { type: String, default: 'English' },
    provider: { type: String, default: 'NCERT / Official Hub' },
    officialSource: { type: String, default: 'NCERT / Diksha' },
    officialSourceUrl: { type: String, default: '' },
    url: { type: String, default: '' },
    qualityScore: { type: Number, default: 90, min: 0, max: 100 },
    isVerified: { type: Boolean, default: true },
    tags: [{ type: String }],
    active: { type: Boolean, default: true, index: true },

    // Backward compatibility
    topic: { type: String, default: '' },
    conceptId: { type: String, default: '' },
    verified: { type: Boolean, default: true },
    official: { type: Boolean, default: true },
    sourceDomain: { type: String, default: 'ncert.nic.in' },
  },
  { timestamps: true }
);

export const LearningResource =
  mongoose.models.LearningResource ||
  mongoose.model<ILearningResource>('LearningResource', LearningResourceSchema);
