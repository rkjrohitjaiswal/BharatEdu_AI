import mongoose, { Document, Model, Schema } from 'mongoose';

export type DoubtRole = 'student' | 'tutor';
export type ExplanationLevel = 'simple' | 'standard' | 'detailed' | 'exam' | 'coding';
export type DoubtGeneratedBy = 'ai' | 'deterministic' | 'hybrid';

export interface IDoubtMessage extends Document {
  messageId: string;
  sessionId: string;
  studentId: mongoose.Types.ObjectId;
  role: DoubtRole;
  content: string;
  explanationLevel: ExplanationLevel;
  referencedConceptIds: string[];
  referencedTopicIds: string[];
  sourceReferences: string[];
  generatedBy: DoubtGeneratedBy;
  isHelpful?: boolean;
  createdAt: Date;
}

const DoubtMessageSchema = new Schema<IDoubtMessage>(
  {
    messageId: { type: String, required: true, unique: true, index: true },
    sessionId: { type: String, required: true, index: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['student', 'tutor'],
      required: true,
    },
    content: { type: String, required: true },
    explanationLevel: {
      type: String,
      enum: ['simple', 'standard', 'detailed', 'exam', 'coding'],
      default: 'standard',
    },
    referencedConceptIds: [{ type: String }],
    referencedTopicIds: [{ type: String }],
    sourceReferences: [{ type: String }],
    generatedBy: {
      type: String,
      enum: ['ai', 'deterministic', 'hybrid'],
      default: 'hybrid',
    },
    isHelpful: { type: Boolean },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const DoubtMessage: Model<IDoubtMessage> =
  mongoose.models.DoubtMessage || mongoose.model<IDoubtMessage>('DoubtMessage', DoubtMessageSchema);
