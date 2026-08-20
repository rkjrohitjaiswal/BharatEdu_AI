import mongoose, { Schema, Document } from 'mongoose';

export interface IClassroomStudentProfile extends Document {
  classId: string;
  teacherId: string;
  studentId: string;
  studentName?: string;
  masteryScore: number;
  practiceAccuracy: number;
  assessmentAverage: number;
  examReadiness: number;
  riskScore: number;
  consistencyScore: number;
  completionRate: number;
  engagementScore: number;
  learningVelocity: number;
  strongestSubjects: string[];
  weakestSubjects: string[];
  topLearningGaps: string[];
  misconceptionCount: number;
  interventionPriority: 'critical' | 'high' | 'medium' | 'low';
  lastActiveAt: Date;
  updatedAt: Date;
}

const ClassroomStudentProfileSchema: Schema = new Schema(
  {
    classId: { type: String, required: true, index: true },
    teacherId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    studentName: { type: String },
    masteryScore: { type: Number, default: 0 },
    practiceAccuracy: { type: Number, default: 0 },
    assessmentAverage: { type: Number, default: 0 },
    examReadiness: { type: Number, default: 0 },
    riskScore: { type: Number, default: 0 },
    consistencyScore: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    learningVelocity: { type: Number, default: 0 },
    strongestSubjects: { type: [String], default: [] },
    weakestSubjects: { type: [String], default: [] },
    topLearningGaps: { type: [String], default: [] },
    misconceptionCount: { type: Number, default: 0 },
    interventionPriority: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'low' },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ClassroomStudentProfileSchema.index({ classId: 1, studentId: 1 }, { unique: true });

export const ClassroomStudentProfile = mongoose.model<IClassroomStudentProfile>(
  'ClassroomStudentProfile',
  ClassroomStudentProfileSchema
);
