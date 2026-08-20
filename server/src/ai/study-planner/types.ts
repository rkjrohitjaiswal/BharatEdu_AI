export type PlannerPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type PlannerTaskType =
  | 'learn'
  | 'revise'
  | 'practice'
  | 'mistake_review'
  | 'goal_work'
  | 'exam_prep'
  | 'weak_topic'
  | 'study_plan'
  | 'career_skill';

export interface IPlannerTaskData {
  taskId: string;
  title: string;
  subject: string;
  topic: string;
  taskType: PlannerTaskType;
  estimatedMinutes: number;
  priority: PlannerPriority;
  reason: string;
  sourceFeature: string;
  actionUrl: string;
  completed: boolean;
  completedAt?: string;
}

export interface IDailyPlannerData {
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  weekStart: string; // YYYY-MM-DD
  availableMinutes: number;
  plannedMinutes: number;
  completedMinutes: number;
  completionPercent: number;
  tasks: IPlannerTaskData[];
  topPriority: string;
  status: 'active' | 'completed' | 'archived';
  generatedAt: string;
  updatedAt: string;
}

export interface IWeeklyPlannerDay {
  date: string; // YYYY-MM-DD
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  totalPlannedMinutes: number;
  completedMinutes: number;
  tasksCount: number;
  completedTasksCount: number;
  topPriority: string;
  tasks: IPlannerTaskData[];
}

export interface IWeeklyPlannerData {
  studentId: string;
  weekStart: string; // YYYY-MM-DD
  days: IWeeklyPlannerDay[];
  totalWeekPlannedMinutes: number;
  totalWeekCompletedMinutes: number;
  evaluatedAt: string;
}

export interface IPlannerSummaryData {
  studentName: string;
  todayDate: string;
  availableMinutes: number;
  plannedMinutes: number;
  completedMinutes: number;
  completionPercent: number;
  topPriority: string;
  nextTask: IPlannerTaskData | null;
  tasksCount: number;
  completedTasksCount: number;
  encouragingMessage: string;
  evaluatedAt: string;
}

export interface IPlannerAdviceData {
  selectionReason: string;
  encouragement: string;
  summaryMessage: string;
  studyStrategies: string[];
  aiGenerated: boolean;
  evaluatedAt: string;
}
