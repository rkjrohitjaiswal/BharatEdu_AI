import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IConceptEvaluation extends Document {
  evaluationId: string;
  studentId: mongoose.Types.ObjectId;
  paperId: string;
  conceptId: string;
  prerequisiteConceptIds: string[];
  accuracy: number;
  confidence: number;
  misconceptionCount: number;
  mistakeCount: number;
  readinessScore: number;
  recommendedAction: string;
  createdAt: Date;
}

const ConceptEvaluationSchema = new Schema<IConceptEvaluation>(
  {
    evaluationId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    paperId: { type: String, required: true, index: true },
    conceptId: { type: String, required: true },
    prerequisiteConceptIds: [{ type: String }],
    accuracy: { type: Number, default: 0 },
    confidence: { type: Number, default: 75 },
    misconceptionCount: { type: Number, default: 0 },
    mistakeCount: { type: Number, default: 0 },
    readinessScore: { type: Number, default: 70 },
    recommendedAction: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ConceptEvaluation: Model<IConceptEvaluation> =
  mongoose.models.ConceptEvaluation || mongoose.model<IConceptEvaluation>('ConceptEvaluation', ConceptEvaluationSchema);
