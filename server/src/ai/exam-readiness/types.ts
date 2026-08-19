export type OverallReadinessClassification =
  | 'critical'
  | 'needs_attention'
  | 'developing'
  | 'ready'
  | 'strong';

export type DaysRemainingCategory =
  | 'past'
  | 'exam_day'
  | 'critical_mode' // 1-6 days
  | 'high_risk_mode' // 7-14 days
  | 'weak_focus_mode' // 15-30 days
  | 'normal_prep'; // > 30 days

export interface TopicReadinessDetail {
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectName: string;
  masteryScore: number;
  confidenceScore: number;
  readinessLevel: 'weak' | 'developing' | 'ready' | 'strong';
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  activeGapSeverity?: string;
  recentMistakesCount: number;
}

export interface SubjectReadinessDetail {
  subjectId: string;
  subjectName: string;
  readinessScore: number;
  readinessLevel: OverallReadinessClassification;
  masteryAverage: number;
  topicsCount: number;
  weakTopicsCount: number;
}

export interface ScoreBreakdown {
  masteryContribution: number; // 40%
  practiceAccuracyContribution: number; // 20%
  confidenceContribution: number; // 15%
  consistencyContribution: number; // 10%
  gapHealthContribution: number; // 10%
  studyPlanContribution: number; // 5%
}

export interface ExamReadinessResult {
  examId: string;
  studentId: string;
  title: string;
  examDate: string;
  daysRemaining: number;
  daysCategory: DaysRemainingCategory;
  readinessScore: number; // 0 - 100
  readinessLevel: OverallReadinessClassification;
  scoreBreakdown: ScoreBreakdown;
  subjectReadiness: SubjectReadinessDetail[];
  criticalTopics: TopicReadinessDetail[];
  highPriorityTopics: TopicReadinessDetail[];
  recentMistakesCount: number;
  recommendations: string[];
  explanation: string;
  aiEnhanced?: boolean;
}

export type ExamTaskType =
  | 'learn'
  | 'revise'
  | 'practice'
  | 'mistake_review'
  | 'mock_test'
  | 'quick_recall';

export interface ExamPlanTask {
  taskId: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  taskType: ExamTaskType;
  title: string;
  estimatedMinutes: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  scheduledDay: number; // Day 1, Day 2, etc.
  completed: boolean;
  completedAt?: string;
}

export interface ExamPlan {
  examId: string;
  studentId: string;
  generatedAt: string;
  availableDailyMinutes: number;
  totalDaysInPlan: number;
  tasks: ExamPlanTask[];
  completionPercentage: number;
}
