import mongoose, { Schema, Document, Model } from 'mongoose';

export type DocumentType = 'textbook' | 'chapter' | 'article' | 'educational_resource';
export type DocumentStatus = 'active' | 'archived';

export interface IEducationalDocument extends Document {
  title: string;
  description?: string;
  publisher: string;
  sourceUrl?: string;
  documentType: DocumentType;
  language: 'english' | 'hindi' | 'gujarati';
  subject: string;
  classLevels: number[];
  license?: string;
  attribution?: string;
  version?: string;
  contentHash: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EducationalDocumentSchema: Schema<IEducationalDocument> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    publisher: { type: String, required: true, default: 'NCERT' },
    sourceUrl: { type: String, default: '' },
    documentType: {
      type: String,
      enum: ['textbook', 'chapter', 'article', 'educational_resource'],
      default: 'educational_resource',
    },
    language: {
      type: String,
      enum: ['english', 'hindi', 'gujarati'],
      default: 'english',
    },
    subject: { type: String, required: true, trim: true },
    classLevels: [{ type: Number }],
    license: { type: String, default: 'CC-BY-NC 4.0 / Public Educational Resource' },
    attribution: { type: String, default: 'National Council of Educational Research and Training (NCERT)' },
    version: { type: String, default: '1.0' },
    contentHash: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

export const EducationalDocumentModel: Model<IEducationalDocument> = mongoose.model<IEducationalDocument>(
  'EducationalDocument',
  EducationalDocumentSchema
);
