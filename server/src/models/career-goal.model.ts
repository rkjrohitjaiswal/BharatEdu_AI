import mongoose, { Document, Schema } from 'mongoose';

export type CareerGoalStatus = 'active' | 'completed' | 'paused';

export interface ICareerGoal extends Document {
  studentId: mongoose.Types.ObjectId | string;
  targetRole: string;
  targetDate?: Date;
  status: CareerGoalStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const careerGoalSchema = new Schema<ICareerGoal>({
  studentId: { type: Schema.Types.Mixed, ref: 'User', required: true, index: true },
  targetRole: { type: String, required: true, trim: true, maxlength: 120 },
  targetDate: { type: Date },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active', index: true },
  notes: { type: String, maxlength: 1000 },
}, { timestamps: true });

careerGoalSchema.index({ studentId: 1, targetRole: 1, status: 1 });

export const CareerGoal = mongoose.model<ICareerGoal>('CareerGoal', careerGoalSchema);
