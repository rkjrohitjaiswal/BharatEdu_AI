import mongoose, { Document, Schema } from 'mongoose';

export interface IPlannerTask {
  taskId: string;
  title: string;
  subject: string;
  topic: string;
  taskType: 'learn' | 'revise' | 'practice' | 'mistake_review' | 'goal_work' | 'exam_prep' | 'weak_topic' | 'study_plan' | 'career_skill';
  estimatedMinutes: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  sourceFeature: string;
  actionUrl: string;
  completed: boolean;
  completedAt?: Date;
}

export interface IStudyPlanner extends Document {
  studentId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  weekStart: string; // YYYY-MM-DD
  availableMinutes: number;
  plannedMinutes: number;
  completedMinutes: number;
  completionPercent: number;
  tasks: IPlannerTask[];
  priority: string;
  status: 'active' | 'completed' | 'archived';
  generatedAt: Date;
  updatedAt: Date;
}

const PlannerTaskSchema = new Schema<IPlannerTask>({
  taskId: { type: String, required: true },
  title: { type: String, required: true },
  subject: { type: String, default: 'General' },
  topic: { type: String, default: 'General Topic' },
  taskType: {
    type: String,
    enum: ['learn', 'revise', 'practice', 'mistake_review', 'goal_work', 'exam_prep', 'weak_topic', 'study_plan', 'career_skill'],
    default: 'practice',
  },
  estimatedMinutes: { type: Number, default: 15 },
  priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
  reason: { type: String, default: '' },
  sourceFeature: { type: String, default: 'Student Success System' },
  actionUrl: { type: String, default: '/practice' },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
});

const StudyPlannerSchema = new Schema<IStudyPlanner>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: { type: String, required: true, index: true },
    weekStart: { type: String, required: true },
    availableMinutes: { type: Number, default: 45 },
    plannedMinutes: { type: Number, default: 0 },
    completedMinutes: { type: Number, default: 0 },
    completionPercent: { type: Number, default: 0 },
    tasks: [PlannerTaskSchema],
    priority: { type: String, default: 'Normal' },
    status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const StudyPlanner =
  mongoose.models.StudyPlanner || mongoose.model<IStudyPlanner>('StudyPlanner', StudyPlannerSchema);
