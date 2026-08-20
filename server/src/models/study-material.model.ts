import mongoose, { Document, Model, Schema } from 'mongoose';

export type MaterialType =
  | 'summary'
  | 'detailed_notes'
  | 'quick_notes'
  | 'flashcards'
  | 'key_points'
  | 'examples'
  | 'formula_sheet'
  | 'revision_sheet'
  | 'practice_guide'
  | 'exam_notes';

export type MaterialDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type MaterialGeneratedBy = 'ai' | 'deterministic' | 'hybrid';
export type MaterialStatus = 'draft' | 'ready' | 'archived';

export interface IStudyMaterialSection {
  title: string;
  content: string;
  bullets?: string[];
  examples?: string[];
  keyTerms?: string[];
  order: number;
}

export interface IStudyMaterial extends Document {
  materialId: string;
  studentId: mongoose.Types.ObjectId;
  title: string;
  subject: string;
  classLevel: string;
  board: string;
  topicIds: string[];
  conceptIds: string[];
  learningPathId?: string;
  stageId?: string;
  itemId?: string;
  materialType: MaterialType;
  difficulty: MaterialDifficulty;
  language: string;
  estimatedMinutes: number;
  content: string;
  sections: IStudyMaterialSection[];
  sourceReferences: string[];
  generatedBy: MaterialGeneratedBy;
  status: MaterialStatus;
  createdAt: Date;
  updatedAt: Date;
}

const StudyMaterialSectionSchema = new Schema<IStudyMaterialSection>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    bullets: [{ type: String }],
    examples: [{ type: String }],
    keyTerms: [{ type: String }],
    order: { type: Number, default: 1 },
  },
  { _id: false }
);

const StudyMaterialSchema = new Schema<IStudyMaterial>(
  {
    materialId: { type: String, required: true, unique: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, index: true },
    classLevel: { type: String, default: 'Class 10' },
    board: { type: String, default: 'CBSE' },
    topicIds: [{ type: String }],
    conceptIds: [{ type: String }],
    learningPathId: { type: String, default: '' },
    stageId: { type: String, default: '' },
    itemId: { type: String, default: '' },
    materialType: {
      type: String,
      enum: [
        'summary',
        'detailed_notes',
        'quick_notes',
        'flashcards',
        'key_points',
        'examples',
        'formula_sheet',
        'revision_sheet',
        'practice_guide',
        'exam_notes',
      ],
      default: 'detailed_notes',
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    language: { type: String, default: 'English' },
    estimatedMinutes: { type: Number, default: 15 },
    content: { type: String, default: '' },
    sections: [StudyMaterialSectionSchema],
    sourceReferences: [{ type: String }],
    generatedBy: {
      type: String,
      enum: ['ai', 'deterministic', 'hybrid'],
      default: 'hybrid',
    },
    status: {
      type: String,
      enum: ['draft', 'ready', 'archived'],
      default: 'ready',
      index: true,
    },
  },
  { timestamps: true }
);

export const StudyMaterial: Model<IStudyMaterial> =
  mongoose.models.StudyMaterial || mongoose.model<IStudyMaterial>('StudyMaterial', StudyMaterialSchema);
