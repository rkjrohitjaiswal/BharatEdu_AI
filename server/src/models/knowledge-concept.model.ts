import mongoose, { Document, Schema } from 'mongoose';

export interface IKnowledgeConcept extends Document {
  conceptId: string;
  name: string;
  subject: string;
  classLevel: string;
  board: string;
  description: string;
  aliases: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isActive: boolean;
  officialSourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeConceptSchema = new Schema<IKnowledgeConcept>(
  {
    conceptId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    classLevel: { type: String, default: 'Class 10' },
    board: { type: String, default: 'CBSE' },
    description: { type: String, default: '' },
    aliases: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    category: { type: String, default: 'General' },
    isActive: { type: Boolean, default: true, index: true },
    officialSourceUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const KnowledgeConcept =
  mongoose.models.KnowledgeConcept ||
  mongoose.model<IKnowledgeConcept>('KnowledgeConcept', KnowledgeConceptSchema);
