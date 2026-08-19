import mongoose, { Schema, Document, Model } from 'mongoose';

export type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'long_answer';
export type QuestionGeneratedBy = 'human' | 'ai';
export type QuestionStatus = 'draft' | 'validated' | 'archived';

export interface IQuestion extends Document {
  subjectId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  questionText: string;
  questionType: QuestionType;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'easy' | 'medium' | 'hard';
  options: string[];
  correctAnswer: string;
  explanation: string;
  source: string;
  sourceReference: string;
  language: 'english' | 'hindi' | 'gujarati';
  generatedBy: QuestionGeneratedBy;
  status: QuestionStatus;
  validated: boolean;
  validationErrors?: string[];
  curriculumReference?: string;
  learningObjective?: string;
  prerequisiteTopicIds?: mongoose.Types.ObjectId[];
  sourceDocumentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema<IQuestion> = new Schema(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    questionType: {
      type: String,
      enum: ['mcq', 'true_false', 'short_answer', 'long_answer'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'easy', 'medium', 'hard'],
      default: 'medium',
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required'],
      trim: true,
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
    source: {
      type: String,
      default: 'NCERT Curriculum Resource',
      trim: true,
    },
    sourceReference: {
      type: String,
      default: '',
      trim: true,
    },
    language: {
      type: String,
      enum: ['english', 'hindi', 'gujarati'],
      default: 'english',
    },
    generatedBy: {
      type: String,
      enum: ['human', 'ai'],
      default: 'human',
    },
    status: {
      type: String,
      enum: ['draft', 'validated', 'archived'],
      default: 'validated',
      index: true,
    },
    validated: { type: Boolean, default: true },
    validationErrors: [{ type: String }],
    curriculumReference: { type: String, default: '' },
    learningObjective: { type: String, default: '' },
    prerequisiteTopicIds: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    sourceDocumentId: { type: Schema.Types.ObjectId, ref: 'EducationalDocument' },
  },
  {
    timestamps: true,
  }
);

export const Question: Model<IQuestion> = mongoose.model<IQuestion>('Question', QuestionSchema);
