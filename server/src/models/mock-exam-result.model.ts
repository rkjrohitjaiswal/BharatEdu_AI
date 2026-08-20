import mongoose, { Schema, Document } from 'mongoose';

export interface IMockExamResult extends Document {
  resultId: string;
  attemptId: string;
  studentId: string;
  examId: string;
  totalScore: number;
  percentage: number;
  accuracy: number;
  rankEstimate?: number;
  percentileEstimate?: number;
  sectionResults: Array<{
    sectionId: string;
    sectionName: string;
    score: number;
    totalMarks: number;
    accuracy: number;
  }>;
  topicPerformance: Array<{
    topicId: string;
    topicName: string;
    correct: number;
    total: number;
    accuracy: number;
  }>;
  conceptPerformance: Array<{
    conceptId: string;
    conceptName: string;
    correct: number;
    total: number;
    accuracy: number;
  }>;
  difficultyPerformance: {
    easy: { correct: number; total: number; accuracy: number };
    medium: { correct: number; total: number; accuracy: number };
    hard: { correct: number; total: number; accuracy: number };
  };
  timeManagementScore: number;
  completionScore: number;
  riskAreas: string[];
  strengths: string[];
  weaknesses: string[];
  recommendedActions: Array<{
    actionType: 'revision' | 'practice' | 'doubt' | 'resource' | 'study_plan';
    title: string;
    description: string;
    targetId?: string;
  }>;
  generatedAt: Date;
}

const MockExamResultSchema: Schema = new Schema(
  {
    resultId: { type: String, required: true, unique: true, index: true },
    attemptId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    examId: { type: String, required: true, index: true },
    totalScore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    rankEstimate: { type: Number },
    percentileEstimate: { type: Number },
    sectionResults: [
      {
        sectionId: String,
        sectionName: String,
        score: Number,
        totalMarks: Number,
        accuracy: Number,
      },
    ],
    topicPerformance: [
      {
        topicId: String,
        topicName: String,
        correct: Number,
        total: Number,
        accuracy: Number,
      },
    ],
    conceptPerformance: [
      {
        conceptId: String,
        conceptName: String,
        correct: Number,
        total: Number,
        accuracy: Number,
      },
    ],
    difficultyPerformance: {
      easy: { correct: Number, total: Number, accuracy: Number },
      medium: { correct: Number, total: Number, accuracy: Number },
      hard: { correct: Number, total: Number, accuracy: Number },
    },
    timeManagementScore: { type: Number, default: 80 },
    completionScore: { type: Number, default: 100 },
    riskAreas: [{ type: String }],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendedActions: [
      {
        actionType: String,
        title: String,
        description: String,
        targetId: String,
      },
    ],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MockExamResult = mongoose.model<IMockExamResult>('MockExamResult', MockExamResultSchema);
