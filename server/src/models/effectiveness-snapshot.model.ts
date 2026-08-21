import mongoose, { Schema, Document } from 'mongoose';

export interface IEffectivenessSnapshot extends Document {
  snapshotId: string;
  studentId: string;
  date: Date;
  overallEffectivenessScore: number;
  strongestInterventions: string[];
  weakestInterventions: string[];
  insufficientEvidence: string[];
  completionRate: number;
  improvementRate: number;
  retentionRate: number;
  studyEfficiency: number;
  assessmentTransfer: number;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

const EffectivenessSnapshotSchema = new Schema<IEffectivenessSnapshot>(
  {
    snapshotId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true },
    date: { type: Date, default: Date.now, index: true },
    overallEffectivenessScore: { type: Number, required: true, default: 75 },
    strongestInterventions: [{ type: String }],
    weakestInterventions: [{ type: String }],
    insufficientEvidence: [{ type: String }],
    completionRate: { type: Number, default: 80 },
    improvementRate: { type: Number, default: 70 },
    retentionRate: { type: Number, default: 75 },
    studyEfficiency: { type: Number, default: 82 },
    assessmentTransfer: { type: Number, default: 68 },
    confidence: { type: Number, default: 85 },
  },
  { timestamps: true }
);

export const EffectivenessSnapshot = mongoose.model<IEffectivenessSnapshot>(
  'EffectivenessSnapshot',
  EffectivenessSnapshotSchema
);
export default EffectivenessSnapshot;
