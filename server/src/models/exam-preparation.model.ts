import mongoose, { Schema, Document, Model } from 'mongoose';

export type ExamType =
  | 'school_exam'
  | 'unit_test'
  | 'midterm'
  | 'final_exam'
  | 'board_exam'
  | 'competitive_exam'
  | 'custom';

export type ExamStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface IExamSubjectConfig {
  subjectId: mongoose.Types.ObjectId | string;
  subjectName: string;
  targetPercentage: number;
  includedTopicIds?: (mongoose.Types.ObjectId | string)[];
}

export interface IExamPreparation extends Document {
  studentId: mongoose.Types.ObjectId;
  title: string;
  examType: ExamType;
  board?: string;
  classLevel?: number;
  examDate: Date;
  subjects: IExamSubjectConfig[];
  targetScore: number; // e.g. 85 (%)
  status: ExamStatus;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSubjectConfigSchema = new Schema(
  {
    subjectId: { type: Schema.Types.Mixed, required: true },
    subjectName: { type: String, required: true, trim: true },
    targetPercentage: { type: Number, default: 80, min: 0, max: 100 },
    includedTopicIds: [{ type: Schema.Types.Mixed }],
  },
  { _id: false }
);

const ExamPreparationSchema: Schema<IExamPreparation> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    examType: {
      type: String,
      enum: [
        'school_exam',
        'unit_test',
        'midterm',
        'final_exam',
        'board_exam',
        'competitive_exam',
        'custom',
      ],
      default: 'school_exam',
    },
    board: { type: String, trim: true },
    classLevel: { type: Number },
    examDate: { type: Date, required: true, index: true },
    subjects: [ExamSubjectConfigSchema],
    targetScore: { type: Number, default: 80, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed', 'cancelled'],
      default: 'upcoming',
      index: true,
    },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

ExamPreparationSchema.index({ studentId: 1, examDate: 1 });
ExamPreparationSchema.index({ studentId: 1, status: 1 });

export const ExamPreparationModel: Model<IExamPreparation> = mongoose.model<IExamPreparation>(
  'ExamPreparation',
  ExamPreparationSchema
);
