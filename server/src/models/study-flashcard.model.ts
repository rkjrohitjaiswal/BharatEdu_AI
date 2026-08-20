import mongoose, { Document, Model, Schema } from 'mongoose';

export type FlashcardStatus = 'active' | 'archived' | 'due' | 'mastered';
export type FlashcardDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface IStudyFlashcard extends Document {
  materialId: string;
  studentId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  explanation: string;
  conceptId?: string;
  topicId?: string;
  difficulty: FlashcardDifficulty;
  order: number;
  status: FlashcardStatus;
  createdAt: Date;
  updatedAt: Date;
}

const StudyFlashcardSchema = new Schema<IStudyFlashcard>(
  {
    materialId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    explanation: { type: String, default: '' },
    conceptId: { type: String, default: '', index: true },
    topicId: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    order: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['active', 'archived', 'due', 'mastered'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

export const StudyFlashcard: Model<IStudyFlashcard> =
  mongoose.models.StudyFlashcard || mongoose.model<IStudyFlashcard>('StudyFlashcard', StudyFlashcardSchema);
