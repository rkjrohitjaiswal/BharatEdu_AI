import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudyTask {
  topicId: mongoose.Types.ObjectId;
  title: string;
  taskType: string;
  estimatedMinutes: number;
  scheduledDate?: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface IStudyPlan extends Document {
  studentId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  targetDate?: Date;
  goals: string[];
  tasks: IStudyTask[];
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const StudyPlanSchema: Schema<IStudyPlan> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Plan title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    targetDate: {
      type: Date,
    },
    goals: {
      type: [String],
      default: [],
    },
    tasks: [
      {
        topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
        title: { type: String, required: true },
        taskType: { type: String, default: 'practice' },
        estimatedMinutes: { type: Number, default: 30, min: 0 },
        scheduledDate: { type: Date },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const StudyPlan: Model<IStudyPlan> = mongoose.model<IStudyPlan>('StudyPlan', StudyPlanSchema);
