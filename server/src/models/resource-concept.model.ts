import mongoose, { Schema, Document } from 'mongoose';

export type ConceptRelationship = 'teaches' | 'reinforces' | 'prerequisite' | 'revision' | 'practice';

export interface IResourceConcept extends Document {
  resourceId: string;
  conceptId: string;
  relationship: ConceptRelationship;
  strength: number;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceConceptSchema = new Schema<IResourceConcept>(
  {
    resourceId: { type: String, required: true, index: true },
    conceptId: { type: String, required: true, index: true },
    relationship: {
      type: String,
      required: true,
      enum: ['teaches', 'reinforces', 'prerequisite', 'revision', 'practice'],
      default: 'teaches',
    },
    strength: { type: Number, default: 0.9 },
    confidence: { type: Number, default: 0.95 },
  },
  { timestamps: true }
);

export const ResourceConcept = mongoose.model<IResourceConcept>('ResourceConcept', ResourceConceptSchema);
export default ResourceConcept;
