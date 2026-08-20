import mongoose, { Schema, Document } from 'mongoose';

export interface IResourceTag extends Document {
  resourceId: string;
  conceptId: string;
  subject: string;
  topic: string;
  classLevel: number;
  board: string;
  difficulty: string;
  learningObjective: string;
  examType?: string;
  careerSkill?: string;
  prerequisiteConceptId?: string;
  language: string;
  tags: string[];
}

const ResourceTagSchema = new Schema<IResourceTag>(
  {
    resourceId: { type: String, required: true, index: true },
    conceptId: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    topic: { type: String, required: true, index: true },
    classLevel: { type: Number, required: true, index: true },
    board: { type: String, required: true, index: true },
    difficulty: { type: String, required: true },
    learningObjective: { type: String, required: true },
    examType: { type: String },
    careerSkill: { type: String },
    prerequisiteConceptId: { type: String },
    language: { type: String, required: true, default: 'en' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ResourceTagSchema.index({ resourceId: 1, conceptId: 1 });

export const ResourceTag = mongoose.models.ResourceTag || mongoose.model<IResourceTag>('ResourceTag', ResourceTagSchema);
