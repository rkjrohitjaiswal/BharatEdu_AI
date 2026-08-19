import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEducationalChunk extends Document {
  documentId: mongoose.Types.ObjectId;
  chunkIndex: number;
  title: string;
  section?: string;
  page?: number;
  content: string;
  subject: string;
  topic?: string;
  language: 'english' | 'hindi' | 'gujarati';
  embedding?: number[];
  contentHash: string;
  createdAt: Date;
}

const EducationalChunkSchema: Schema<IEducationalChunk> = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'EducationalDocument',
      required: true,
      index: true,
    },
    chunkIndex: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    section: { type: String, default: '' },
    page: { type: Number },
    content: { type: String, required: true },
    subject: { type: String, required: true, index: true },
    topic: { type: String, default: '', index: true },
    language: {
      type: String,
      enum: ['english', 'hindi', 'gujarati'],
      default: 'english',
      index: true,
    },
    embedding: [{ type: Number }],
    contentHash: { type: String, required: true, index: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

EducationalChunkSchema.index({ documentId: 1, chunkIndex: 1 });

export const EducationalChunkModel: Model<IEducationalChunk> = mongoose.model<IEducationalChunk>(
  'EducationalChunk',
  EducationalChunkSchema
);
