import {
  RevisionSourceType,
  RevisionStatus,
  ReviewLevel,
  ReviewResultType,
} from '../../models/revision-item.model.js';

export type RevisionPriorityType = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface IRevisionItemData {
  id: string;
  studentId: string;
  subject: string;
  topic: string;
  subtopic: string;
  sourceType: RevisionSourceType;
  sourceId: string;
  masteryScore: number;
  retentionScore: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  priority: RevisionPriorityType;
  reviewLevel: ReviewLevel;
  intervalDays: number;
  repetitionCount: number;
  lastReviewedAt?: string;
  nextReviewAt: string;
  lastResult?: ReviewResultType;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  overdue: boolean;
  status: RevisionStatus;
  reason: string;
  estimatedMinutes: number;
  actionUrl: string;
}

export interface IRevisionSessionData {
  sessionId: string;
  revisionItemId: string;
  studentId: string;
  topic: string;
  startedAt: string;
  completedAt?: string;
  plannedMinutes: number;
  actualMinutes: number;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  result: ReviewResultType;
  retentionBefore: number;
  retentionAfter: number;
  nextReviewAt: string;
}

export interface IDailyRevisionData {
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  totalDue: number;
  totalOverdue: number;
  totalPlanned: number;
  plannedMinutes: number;
  availableMinutes: number;
  completionPercent: number;
  priorityItems: IRevisionItemData[];
  tasks: IRevisionItemData[];
  evaluatedAt: string;
}

export interface IWeeklyRevisionDay {
  date: string; // YYYY-MM-DD
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  plannedMinutes: number;
  dueCount: number;
  completedCount: number;
  topPriorityTopic: string;
  tasks: IRevisionItemData[];
}

export interface IWeeklyRevisionData {
  studentId: string;
  weekStart: string; // YYYY-MM-DD
  days: IWeeklyRevisionDay[];
  totalWeekPlannedMinutes: number;
  evaluatedAt: string;
}

export interface IRevisionSummaryData {
  studentName: string;
  totalActiveItems: number;
  totalDue: number;
  totalOverdue: number;
  averageRetention: number;
  masteredCount: number;
  reviewStreakDays: number;
  topPriorityItem: IRevisionItemData | null;
  summaryMessage: string;
  evaluatedAt: string;
}

export interface IRevisionAdviceData {
  dueReasoning: string;
  revisionStrategy: string;
  encouragement: string;
  aiGenerated: boolean;
  evaluatedAt: string;
}
