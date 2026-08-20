import mongoose, { Schema, Document } from 'mongoose';

export interface IResourceBookmark extends Document {
  resourceId: string;
  studentId: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceBookmarkSchema: Schema = new Schema(
  {
    resourceId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

ResourceBookmarkSchema.index({ studentId: 1, resourceId: 1 }, { unique: true });

export const ResourceBookmark = mongoose.model<IResourceBookmark>(
  'ResourceBookmark',
  ResourceBookmarkSchema
);
