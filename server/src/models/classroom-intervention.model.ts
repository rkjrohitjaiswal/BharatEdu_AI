import mongoose, { Schema, Document } from 'mongoose';

export interface IClassroomIntervention extends Document {
  interventionId: string;
  teacherId: string;
  classId: string;
  studentId?: string; // Optional if class-wide intervention
  interventionType: 'prerequisite_revision' | 'small_group_practice' | 'targeted_assignment' | 'doubt_solving_session' | 'revision_activity' | 'concept_explanation' | 'additional_resource' | 'exam_preparation' | 'personalized_learning_path' | 'study_planner_task';
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  evidence: string[];
  recommendedActions: string[];
  targetConcepts: string[];
  status: 'suggested' | 'planned' | 'active' | 'completed' | 'dismissed';
  createdAt: Date;
  completedAt?: Date;
  teacherNotes?: string;
  beforeMetrics?: {
    mastery: number;
    accuracy: number;
    assessmentScore: number;
    riskScore: number;
  };
  afterMetrics?: {
    mastery: number;
    accuracy: number;
    assessmentScore: number;
    riskScore: number;
  };
}

const ClassroomInterventionSchema: Schema = new Schema(
  {
    interventionId: { type: String, required: true, unique: true, index: true },
    teacherId: { type: String, required: true, index: true },
    classId: { type: String, required: true, index: true },
    studentId: { type: String, index: true },
    interventionType: { type: String, required: true },
    priority: { type: String, enum: ['critical', 'high', 'medium', 'low'], required: true },
    reason: { type: String, required: true },
    evidence: { type: [String], default: [] },
    recommendedActions: { type: [String], default: [] },
    targetConcepts: { type: [String], default: [] },
    status: { type: String, enum: ['suggested', 'planned', 'active', 'completed', 'dismissed'], default: 'suggested' },
    completedAt: { type: Date },
    teacherNotes: { type: String },
    beforeMetrics: {
      mastery: Number,
      accuracy: Number,
      assessmentScore: Number,
      riskScore: Number,
    },
    afterMetrics: {
      mastery: Number,
      accuracy: Number,
      assessmentScore: Number,
      riskScore: Number,
    },
  },
  { timestamps: true }
);

export const ClassroomIntervention = mongoose.model<IClassroomIntervention>(
  'ClassroomIntervention',
  ClassroomInterventionSchema
);
