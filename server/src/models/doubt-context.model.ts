import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDoubtContext extends Document {
  studentId: mongoose.Types.ObjectId;
  sessionId: string;
  conceptId?: string;
  topicId?: string;
  masteryScore: number;
  confidenceScore: number;
  riskLevel: string;
  examUrgency: boolean;
  learningPathStage: number;
  prerequisiteConceptIds: string[];
  learningGapIds: string[];
  revisionDue: boolean;
  recommendedDifficulty: string;
  capturedAt: Date;
}

const DoubtContextSchema = new Schema<IDoubtContext>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionId: { type: String, required: true, index: true },
    conceptId: { type: String, default: '' },
    topicId: { type: String, default: '' },
    masteryScore: { type: Number, default: 50 },
    confidenceScore: { type: Number, default: 70 },
    riskLevel: { type: String, default: 'LOW' },
    examUrgency: { type: Boolean, default: false },
    learningPathStage: { type: Number, default: 1 },
    prerequisiteConceptIds: [{ type: String }],
    learningGapIds: [{ type: String }],
    revisionDue: { type: Boolean, default: false },
    recommendedDifficulty: { type: String, default: 'intermediate' },
    capturedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const DoubtContext: Model<IDoubtContext> =
  mongoose.models.DoubtContext || mongoose.model<IDoubtContext>('DoubtContext', DoubtContextSchema);
