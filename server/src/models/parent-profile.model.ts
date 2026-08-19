import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IParentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  parentName: string;
  phone?: string;
  preferredLanguage: 'english' | 'hindi' | 'gujarati';
  linkedStudentIds: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ParentProfileSchema: Schema<IParentProfile> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    preferredLanguage: {
      type: String,
      enum: ['english', 'hindi', 'gujarati'],
      default: 'english',
    },
    linkedStudentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ParentProfile: Model<IParentProfile> = mongoose.model<IParentProfile>(
  'ParentProfile',
  ParentProfileSchema
);
