import mongoose, { Schema, Document } from 'mongoose';

export type ExamPlanStatus = 'planning' | 'active' | 'paused' | 'completed';

export interface IStudentExamPlan extends Document {
  planId: string;
  studentId: string;
  examId: string;
  targetScore: number;
  currentReadinessScore: number;
  currentRiskLevel: string;
  preparationStartDate: Date;
  targetExamDate: Date;
  availableDailyMinutes: number;
  preferredStudyWindow: string;
  status: ExamPlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

const StudentExamPlanSchema: Schema = new Schema(
  {
    planId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true },
    examId: { type: String, required: true, index: true },
    targetScore: { type: Number, required: true, default: 90 },
    currentReadinessScore: { type: Number, default: 0 },
    currentRiskLevel: { type: String, default: 'low' },
    preparationStartDate: { type: Date, default: Date.now },
    targetExamDate: { type: Date, required: true },
    availableDailyMinutes: { type: Number, default: 120 },
    preferredStudyWindow: { type: String, default: 'evening' },
    status: { type: String, enum: ['planning', 'active', 'paused', 'completed'], default: 'active' },
  },
  { timestamps: true }
);

export const StudentExamPlan = mongoose.model<IStudentExamPlan>('StudentExamPlan', StudentExamPlanSchema);
export default StudentExamPlan;
