export interface IExamProfileClient {
  examId: string;
  examName: string;
  board: string;
  classLevel: number;
  subject: string;
  examDate: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questionCount: number;
  officialSourceUrl?: string;
}

export interface IStudentExamPlanClient {
  planId: string;
  studentId: string;
  examId: string;
  targetScore: number;
  currentReadinessScore: number;
  currentRiskLevel: string;
  targetExamDate: string;
  availableDailyMinutes: number;
  status: string;
}

export interface IExamReadinessClient {
  readinessScore: number;
  status: 'critical' | 'needs_improvement' | 'on_track' | 'exam_ready';
  conceptMasteryPct: number;
  topicCoveragePct: number;
  practiceAccuracyPct: number;
  mockPerformancePct: number;
  revisionCompletionPct: number;
  daysRemaining: number;
}

export interface IExamPriorityClient {
  conceptId: string;
  subject: string;
  topic: string;
  priorityRank: number;
  reason: string;
  weightage: number;
  masteryPct: number;
  isPrerequisiteGap: boolean;
  isHighRisk: boolean;
}

export interface IExamTaskClient {
  taskId: string;
  conceptId: string;
  topic: string;
  activityType: string;
  durationMinutes: number;
  priority: string;
  reason: string;
  actionUrl: string;
  prerequisiteStatus: string;
}

export interface IExamDayClient {
  date: string;
  dayTitle: string;
  totalMinutes: number;
  tasks: IExamTaskClient[];
}

export interface IExamWeekClient {
  weekNumber: number;
  title: string;
  days: IExamDayClient[];
}

export interface IExamRiskClient {
  riskId: string;
  riskType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  mitigationAction: string;
}
