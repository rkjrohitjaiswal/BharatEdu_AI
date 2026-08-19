import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IIntervention extends Document {
  teacherId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  classId?: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  type: 'practice' | 'tutor' | 'revision' | 'study_plan';
  title: string;
  instructions: string;
  teacherNote?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'assigned' | 'in_progress' | 'completed' | 'expired' | 'cancelled';
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterventionSchema: Schema<IIntervention> = new Schema(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
    },
    type: {
      type: String,
      enum: ['practice', 'tutor', 'revision', 'study_plan'],
      default: 'practice',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
      required: true,
      trim: true,
    },
    teacherNote: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
      required: true,
    },
    status: {
      type: String,
      enum: ['assigned', 'in_progress', 'completed', 'expired', 'cancelled'],
      default: 'assigned',
      required: true,
      index: true,
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Intervention: Model<IIntervention> = mongoose.model<IIntervention>(
  'Intervention',
  InterventionSchema
);
