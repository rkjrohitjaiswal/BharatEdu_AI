import mongoose, { Schema, Document } from 'mongoose';

export type OrchestrationOverallStatus = 'on_track' | 'needs_attention' | 'high_priority' | 'critical';

export interface ILearningOrchestration extends Document {
  planId: string;
  studentId: string;
  generatedAt: Date;
  date: Date;
  overallStatus: OrchestrationOverallStatus;
  topPriority: string;
  dailyMinutesAvailable: number;
  actions: any[];
  blockedActions: any[];
  completedActions: any[];
  explanationVersion: string;
  engineVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

const LearningOrchestrationSchema = new Schema<ILearningOrchestration>(
  {
    planId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true },
    generatedAt: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now, index: true },
    overallStatus: {
      type: String,
      required: true,
      enum: ['on_track', 'needs_attention', 'high_priority', 'critical'],
      default: 'on_track',
    },
    topPriority: { type: String, required: true },
    dailyMinutesAvailable: { type: Number, required: true, default: 60 },
    actions: [{ type: Schema.Types.Mixed }],
    blockedActions: [{ type: Schema.Types.Mixed }],
    completedActions: [{ type: Schema.Types.Mixed }],
    explanationVersion: { type: String, default: '1.0' },
    engineVersion: { type: String, default: '1.0' },
  },
  { timestamps: true }
);

export const LearningOrchestration = mongoose.model<ILearningOrchestration>(
  'LearningOrchestration',
  LearningOrchestrationSchema
);
export default LearningOrchestration;
