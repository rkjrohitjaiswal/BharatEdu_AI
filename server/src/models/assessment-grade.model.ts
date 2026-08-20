import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionGrade {
  questionId: string;
  score: number;
  maxScore: number;
  isObjective: boolean;
  objectiveCorrect?: boolean;
  rubricScores?: {
    criterionId: string;
    criterionName?: string;
    score: number;
    maxScore: number;
  }[];
  teacherComment?: string;
  aiProposedScore?: number;
  aiApproved?: boolean;
}

export interface IAssessmentGrade extends Document {
  submissionId: string;
  studentId: string;
  assessmentId: string;
  questionGrades: IQuestionGrade[];
  totalScore: number;
  percentage: number;
  grade?: string;
  teacherFeedback?: string;
  finalizedBy: string;
  finalizedAt: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentGradeSchema = new Schema<IAssessmentGrade>(
  {
    submissionId: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true },
    assessmentId: { type: String, required: true, index: true },
    questionGrades: [
      {
        questionId: { type: String, required: true },
        score: { type: Number, required: true, default: 0 },
        maxScore: { type: Number, required: true, default: 0 },
        isObjective: { type: Boolean, default: false },
        objectiveCorrect: { type: Boolean },
        rubricScores: [
          {
            criterionId: { type: String },
            criterionName: { type: String },
            score: { type: Number },
            maxScore: { type: Number },
          },
        ],
        teacherComment: { type: String },
        aiProposedScore: { type: Number },
        aiApproved: { type: Boolean, default: false },
      },
    ],
    totalScore: { type: Number, required: true, default: 0 },
    percentage: { type: Number, required: true, default: 0 },
    grade: { type: String },
    teacherFeedback: { type: String },
    finalizedBy: { type: String, required: true },
    finalizedAt: { type: Date, default: Date.now },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export const AssessmentGrade =
  mongoose.models.AssessmentGrade ||
  mongoose.model<IAssessmentGrade>('AssessmentGrade', AssessmentGradeSchema);
