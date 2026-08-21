import mongoose, { Schema, Document } from 'mongoose';

export type LearningOutcomeType =
  | 'mastery_change'
  | 'accuracy_change'
  | 'assessment_change'
  | 'readiness_change'
  | 'risk_change'
  | 'revision_success'
  | 'plan_adherence'
  | 'learning_path_progress'
  | 'doubt_resolution'
  | 'resource_completion'
  | 'exam_readiness'
  | 'goal_progress';

export type LearningOutcomeStatus = 'pending' | 'measured' | 'insufficient_evidence' | 'invalid';

export interface ILearningOutcome extends Document {
  outcomeId: string;
  studentId: string;
  actionId: string;
  sourceFeature: string;
  conceptId: string;
  topic: string;
  outcomeType: LearningOutcomeType;
  baselineSnapshot: Record<string, any>;
  followupSnapshot?: Record<string, any>;
  baselineAt: Date;
  measuredAt?: Date;
  delta: number;
  confidence: number;
  measurementWindowDays: number;
  status: LearningOutcomeStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LearningOutcomeSchema = new Schema<ILearningOutcome>(
  {
    outcomeId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true },
    actionId: { type: String, required: true, index: true },
    sourceFeature: { type: String, required: true },
    conceptId: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    outcomeType: {
      type: String,
      required: true,
      enum: [
        'mastery_change',
        'accuracy_change',
        'assessment_change',
        'readiness_change',
        'risk_change',
        'revision_success',
        'plan_adherence',
        'learning_path_progress',
        'doubt_resolution',
        'resource_completion',
        'exam_readiness',
        'goal_progress',
      ],
      default: 'mastery_change',
    },
    baselineSnapshot: { type: Schema.Types.Mixed, required: true },
    followupSnapshot: { type: Schema.Types.Mixed },
    baselineAt: { type: Date, default: Date.now },
    measuredAt: { type: Date },
    delta: { type: Number, default: 0 },
    confidence: { type: Number, default: 50 },
    measurementWindowDays: { type: Number, default: 7 },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'measured', 'insufficient_evidence', 'invalid'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

export const LearningOutcome = mongoose.model<ILearningOutcome>(
  'LearningOutcome',
  LearningOutcomeSchema
);
export default LearningOutcome;
