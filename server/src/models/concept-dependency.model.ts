import mongoose, { Document, Schema } from 'mongoose';

export type DependencyType = 'prerequisite' | 'foundational' | 'related' | 'advanced';

export interface IConceptDependency extends Document {
  prerequisiteConceptId: string;
  dependentConceptId: string;
  dependencyType: DependencyType;
  strength: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
  source: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConceptDependencySchema = new Schema<IConceptDependency>(
  {
    prerequisiteConceptId: { type: String, required: true, index: true },
    dependentConceptId: { type: String, required: true, index: true },
    dependencyType: {
      type: String,
      enum: ['prerequisite', 'foundational', 'related', 'advanced'],
      default: 'prerequisite',
    },
    strength: { type: Number, default: 0.9, min: 0, max: 1 },
    confidence: { type: Number, default: 0.95, min: 0, max: 1 },
    source: { type: String, default: 'curriculum_standard' },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

ConceptDependencySchema.index(
  { prerequisiteConceptId: 1, dependentConceptId: 1 },
  { unique: true }
);

export const ConceptDependency =
  mongoose.models.ConceptDependency ||
  mongoose.model<IConceptDependency>('ConceptDependency', ConceptDependencySchema);
