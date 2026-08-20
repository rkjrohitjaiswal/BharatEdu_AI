import mongoose, { Schema, Document } from 'mongoose';

export type AuditAction =
  | 'submitted'
  | 'ai_evaluated'
  | 'teacher_reviewed'
  | 'score_changed'
  | 'feedback_changed'
  | 'finalized'
  | 'returned'
  | 'reopened';

export interface IAssessmentAudit extends Document {
  submissionId: string;
  actorUserId: string;
  actorRole: 'student' | 'teacher' | 'system' | 'admin';
  action: AuditAction;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentAuditSchema = new Schema<IAssessmentAudit>(
  {
    submissionId: { type: String, required: true, index: true },
    actorUserId: { type: String, required: true },
    actorRole: {
      type: String,
      enum: ['student', 'teacher', 'system', 'admin'],
      required: true,
    },
    action: {
      type: String,
      enum: [
        'submitted',
        'ai_evaluated',
        'teacher_reviewed',
        'score_changed',
        'feedback_changed',
        'finalized',
        'returned',
        'reopened',
      ],
      required: true,
    },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AssessmentAudit =
  mongoose.models.AssessmentAudit ||
  mongoose.model<IAssessmentAudit>('AssessmentAudit', AssessmentAuditSchema);
