import mongoose, { Schema, Document } from 'mongoose';

export interface IClassroomIntelligence extends Document {
  teacherId: string;
  classId: string;
  className: string;
  subject: string;
  classLevel: string;
  board: string;
  studentCount: number;
  activeStudentCount: number;
  averageMastery: number;
  averagePracticeAccuracy: number;
  averageAssessmentScore: number;
  averageExamReadiness: number;
  averageRiskScore: number;
  averageConsistency: number;
  completionRate: number;
  engagementScore: number;
  learningVelocity: number;
  interventionCount: number;
  generatedAt: Date;
  updatedAt: Date;
}

const ClassroomIntelligenceSchema: Schema = new Schema(
  {
    teacherId: { type: String, required: true, index: true },
    classId: { type: String, required: true, unique: true, index: true },
    className: { type: String, required: true },
    subject: { type: String, required: true },
    classLevel: { type: String, required: true },
    board: { type: String, required: true },
    studentCount: { type: Number, default: 0 },
    activeStudentCount: { type: Number, default: 0 },
    averageMastery: { type: Number, default: 0 },
    averagePracticeAccuracy: { type: Number, default: 0 },
    averageAssessmentScore: { type: Number, default: 0 },
    averageExamReadiness: { type: Number, default: 0 },
    averageRiskScore: { type: Number, default: 0 },
    averageConsistency: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    learningVelocity: { type: Number, default: 0 },
    interventionCount: { type: Number, default: 0 },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ClassroomIntelligence = mongoose.model<IClassroomIntelligence>(
  'ClassroomIntelligence',
  ClassroomIntelligenceSchema
);
