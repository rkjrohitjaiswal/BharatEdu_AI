import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentAnswer extends Document {
  submissionId: string;
  questionId: string;
  studentId: string;
  answer: any;
  attachments?: string[];
  submittedAt: Date;
  answerType: string;
  objectiveCorrect?: boolean;
  objectiveMarks?: number;
  responseTimeSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentAnswerSchema = new Schema<IAssessmentAnswer>(
  {
    submissionId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    answer: { type: Schema.Types.Mixed },
    attachments: [{ type: String }],
    submittedAt: { type: Date, default: Date.now },
    answerType: { type: String, required: true },
    objectiveCorrect: { type: Boolean },
    objectiveMarks: { type: Number },
    responseTimeSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const AssessmentAnswer =
  mongoose.models.AssessmentAnswer ||
  mongoose.model<IAssessmentAnswer>('AssessmentAnswer', AssessmentAnswerSchema);
