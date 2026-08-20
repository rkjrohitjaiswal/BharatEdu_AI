import mongoose, { Document, Model, Schema } from 'mongoose';

export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'multiple_select'
  | 'short_answer'
  | 'numerical'
  | 'conceptual'
  | 'application'
  | 'scenario';

export type QuestionDifficulty = 'foundational' | 'easy' | 'medium' | 'hard' | 'advanced';

export type QuestionGeneratedBy = 'human' | 'ai';

export interface IQuestion extends Document {
  questionId: string;
  conceptId: string;
  subject: string;
  classLevel: string;
  board: string;
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  sourceType: string;
  sourceReference: string;
  generatedBy: QuestionGeneratedBy;
  verified: boolean;
  isActive: boolean;

  // Backward compatibility fields
  subjectId?: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  questionText?: string;
  status?: string;

  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema<IQuestion> = new Schema(
  {
    questionId: { type: String, required: true, unique: true, index: true },
    conceptId: { type: String, required: true, index: true },
    subject: { type: String, required: true, default: 'General' },
    classLevel: { type: String, default: 'Class 10' },
    board: { type: String, default: 'CBSE' },
    questionType: {
      type: String,
      enum: [
        'mcq',
        'true_false',
        'multiple_select',
        'short_answer',
        'numerical',
        'conceptual',
        'application',
        'scenario',
      ],
      default: 'mcq',
    },
    difficulty: {
      type: String,
      enum: ['foundational', 'easy', 'medium', 'hard', 'advanced'],
      default: 'medium',
      index: true,
    },
    stem: { type: String, required: true, trim: true },
    options: { type: [String], default: [] },
    correctAnswer: { type: String, required: true, trim: true },
    explanation: { type: String, default: '', trim: true },
    hint: { type: String, default: '', trim: true },
    sourceType: { type: String, default: 'curriculum_bank' },
    sourceReference: { type: String, default: '' },
    generatedBy: { type: String, enum: ['human', 'ai'], default: 'human' },
    verified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },

    // Backward compatibility fields
    questionText: { type: String, trim: true },
    status: { type: String, default: 'validated' },
  },
  { timestamps: true }
);

export const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
