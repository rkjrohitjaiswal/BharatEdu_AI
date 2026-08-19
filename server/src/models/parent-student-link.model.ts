import mongoose, { Schema, Document, Model } from 'mongoose';

export type RelationshipType = 'father' | 'mother' | 'guardian' | 'other';
export type LinkStatus = 'pending' | 'active' | 'revoked';

export interface IParentStudentLink extends Document {
  parentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  relationship: RelationshipType;
  status: LinkStatus;
  invitationCode?: string;
  expiresAt?: Date;
  linkedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ParentStudentLinkSchema: Schema<IParentStudentLink> = new Schema(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relationship: {
      type: String,
      enum: ['father', 'mother', 'guardian', 'other'],
      default: 'guardian',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'revoked'],
      default: 'active',
    },
    invitationCode: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    linkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index for active links
ParentStudentLinkSchema.index(
  { parentId: 1, studentId: 1, status: 1 },
  { unique: true }
);

export const ParentStudentLink: Model<IParentStudentLink> = mongoose.model<IParentStudentLink>(
  'ParentStudentLink',
  ParentStudentLinkSchema
);
