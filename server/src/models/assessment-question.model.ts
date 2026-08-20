import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentQuestion extends Document {
  questionId: string;
  assessmentId: string;
  conceptId: string;
  subject: string;
  topic: string;
  questionType: 'mcq' | 'multiple_select' | 'true_false' | 'short_answer' | 'numerical' | 'coding' | 'assertion_reason' | 'case_based';
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  options?: string[];
  correctAnswer: any;
  explanation: string;
  solutionSteps?: string[];
  marks: number;
  negativeMarks: number;
  learningObjective?: string;
  prerequisiteConcepts?: string[];
  sourceReference?: string;
  generationMethod?: 'manual' | 'template' | 'ai_draft' | 'ai_validated';
  validationStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: Date;
}

const AssessmentQuestionSchema = new Schema<IAssessmentQuestion>(
  {
    questionId: { type: String, required: true, unique: true, index: true },
    assessmentId: { type: String, required: true, index: true },
    conceptId: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    questionType: {
      type: String,
      enum: ['mcq', 'multiple_select', 'true_false', 'short_answer', 'numerical', 'coding', 'assertion_reason', 'case_based'],
      default: 'mcq',
      index: true,
    },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium', index: true },
    questionText: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String, default: '' },
    solutionSteps: [{ type: String }],
    marks: { type: Number, default: 4 },
    negativeMarks: { type: Number, default: 0 },
    learningObjective: { type: String },
    prerequisiteConcepts: [{ type: String }],
    sourceReference: { type: String, default: 'NCERT' },
    generationMethod: { type: String, enum: ['manual', 'template', 'ai_draft', 'ai_validated'], default: 'ai_validated' },
    validationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AssessmentQuestionSchema.index({ assessmentId: 1, isActive: 1 });
AssessmentQuestionSchema.index({ conceptId: 1, difficulty: 1 });

export const AssessmentQuestion =
  mongoose.models.AssessmentQuestion || mongoose.model<IAssessmentQuestion>('AssessmentQuestion', AssessmentQuestionSchema);
