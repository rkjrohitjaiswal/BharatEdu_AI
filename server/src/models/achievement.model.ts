import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  studentId: mongoose.Types.ObjectId | string;
  achievementType: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  evidenceType?: string;
  evidenceId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema: Schema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    achievementType: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true, default: 'award' },
    earnedAt: { type: Date, required: true, default: Date.now },
    evidenceType: { type: String },
    evidenceId: { type: String, default: 'system' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Compound Unique Index for Idempotency and Duplicate Protection
AchievementSchema.index({ studentId: 1, achievementType: 1, evidenceId: 1 }, { unique: true });

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);
