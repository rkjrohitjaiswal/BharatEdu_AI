import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITopicEvaluation extends Document {
  evaluationId: string;
  studentId: mongoose.Types.ObjectId;
  paperId: string;
  topicId: string;
  questionsAttempted: number;
  correctAnswers: number;
  accuracy: number;
  marksAvailable: number;
  marksEarned: number;
  averageResponseTime: number;
  difficultyPerformance: Record<string, number>;
  confidenceScore: number;
  masteryEvidence: string;
  status: 'strong' | 'developing' | 'needs_attention';
  createdAt: Date;
}

const TopicEvaluationSchema = new Schema<ITopicEvaluation>(
  {
    evaluationId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    paperId: { type: String, required: true, index: true },
    topicId: { type: String, required: true },
    questionsAttempted: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    marksAvailable: { type: Number, default: 0 },
    marksEarned: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 30 },
    difficultyPerformance: { type: Schema.Types.Mixed, default: {} },
    confidenceScore: { type: Number, default: 75 },
    masteryEvidence: { type: String, default: '' },
    status: {
      type: String,
      enum: ['strong', 'developing', 'needs_attention'],
      default: 'developing',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const TopicEvaluation: Model<ITopicEvaluation> =
  mongoose.models.TopicEvaluation || mongoose.model<ITopicEvaluation>('TopicEvaluation', TopicEvaluationSchema);
