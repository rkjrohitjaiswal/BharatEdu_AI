import mongoose, { Document, Model, Schema } from 'mongoose';

export type AssessmentType =
  | 'diagnostic'
  | 'topic_check'
  | 'mastery_check'
  | 'exam_simulation'
  | 'revision_test'
  | 'learning_path_check'
  | 'doubt_followup'
  | 'custom'
  | 'adaptive_practice'
  | 'remediation'
  | 'exam_prep'
  | 'revision'
  | 'prerequisite_check';

export type AssessmentStatus = 'draft' | 'ready' | 'in_progress' | 'completed' | 'expired' | 'active' | 'abandoned';
export type AssessmentDifficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'advanced' | 'foundational';

export interface IAdaptiveAssessment extends Document {
  assessmentId: string;
  studentId: mongoose.Types.ObjectId;
  title: string;
  subject: string;
  classLevel: string;
  board: string;
  assessmentType: AssessmentType;
  targetConceptId?: string;
  prerequisiteConceptIds?: string[];
  difficulty: AssessmentDifficulty;
  questionCount: number;
  timeLimitMinutes: number;
  status: AssessmentStatus;
  currentQuestionIndex: number;
  completedQuestions?: number;
  correctAnswers?: number;
  score: number;
  accuracy: number;
  masteryImpact: number;
  startingDifficulty?: AssessmentDifficulty;
  currentDifficulty?: AssessmentDifficulty;
  readinessBefore?: number;
  readinessAfter?: number;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdaptiveAssessmentSchema = new Schema<IAdaptiveAssessment>(
  {
    assessmentId: { type: String, required: true, unique: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, default: 'Adaptive Assessment' },
    subject: { type: String, default: 'Mathematics' },
    classLevel: { type: String, default: 'Class 10' },
    board: { type: String, default: 'CBSE' },
    assessmentType: {
      type: String,
      enum: [
        'diagnostic',
        'topic_check',
        'mastery_check',
        'exam_simulation',
        'revision_test',
        'learning_path_check',
        'doubt_followup',
        'custom',
        'adaptive_practice',
        'remediation',
        'exam_prep',
        'revision',
        'prerequisite_check',
      ],
      default: 'mastery_check',
      index: true,
    },
    targetConceptId: { type: String, default: '' },
    prerequisiteConceptIds: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['beginner', 'easy', 'medium', 'hard', 'advanced', 'foundational'],
      default: 'medium',
    },
    questionCount: { type: Number, default: 5 },
    timeLimitMinutes: { type: Number, default: 15 },
    status: {
      type: String,
      enum: ['draft', 'ready', 'in_progress', 'completed', 'expired', 'active', 'abandoned'],
      default: 'ready',
      index: true,
    },
    currentQuestionIndex: { type: Number, default: 0 },
    completedQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0, min: 0, max: 100 },
    masteryImpact: { type: Number, default: 0 },
    startingDifficulty: { type: String, default: 'medium' },
    currentDifficulty: { type: String, default: 'medium' },
    readinessBefore: { type: Number, default: 50 },
    readinessAfter: { type: Number, default: 50 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const AdaptiveAssessment: Model<IAdaptiveAssessment> =
  mongoose.models.AdaptiveAssessment ||
  mongoose.model<IAdaptiveAssessment>('AdaptiveAssessment', AdaptiveAssessmentSchema);
