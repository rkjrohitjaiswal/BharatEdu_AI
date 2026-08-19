import mongoose, { Schema, Document, Model } from 'mongoose';

export type MessageRole = 'student' | 'tutor';

export interface ISourceCitation {
  title: string;
  sourceUrl?: string;
  documentId?: string;
  page?: number;
  section?: string;
  publisher?: string;
}

export interface IMessage {
  _id?: string;
  id?: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  sources?: ISourceCitation[];
  metadata?: Record<string, any>;
}

export interface IConversation extends Document {
  studentId: mongoose.Types.ObjectId;
  title: string;
  subjectId?: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  language: 'english' | 'hindi' | 'gujarati';
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const SourceCitationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    sourceUrl: { type: String, default: '' },
    documentId: { type: String, default: '' },
    page: { type: Number },
    section: { type: String, default: '' },
    publisher: { type: String, default: 'NCERT / Verified Educational Content' },
  },
  { _id: false }
);

const MessageSchema = new Schema(
  {
    role: { type: String, enum: ['student', 'tutor'], required: true },
    content: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
    sources: [SourceCitationSchema],
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true }
);

const ConversationSchema: Schema<IConversation> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'New Learning Doubt',
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
    },
    language: {
      type: String,
      enum: ['english', 'hindi', 'gujarati'],
      default: 'english',
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ studentId: 1, updatedAt: -1 });

export const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  'Conversation',
  ConversationSchema
);
