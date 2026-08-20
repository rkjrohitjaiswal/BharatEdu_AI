export type ProgressTrendType = 'improving' | 'stable' | 'declining' | 'insufficient_data';
export type RiskTrendType = 'improving' | 'stable' | 'worsening';
export type SubjectStatusType = 'strong' | 'improving' | 'needs_attention' | 'critical' | 'insufficient_data';
export type ConsistencyLevelType = 'excellent' | 'good' | 'moderate' | 'needs_improvement' | 'insufficient_data';

export interface OverallProgressMetrics {
  currentMastery: number;
  previousMastery: number | null;
  masteryChange: number;
  masteryTrend: ProgressTrendType;
  practiceAccuracy: number;
  accuracyChange: number;
  accuracyTrend: ProgressTrendType;
  questionsSolved: number;
  studyMinutes: number;
  planCompletionPercentage: number;
  currentStreak: number;
  longestStreak: number;
  activeGoals: number;
  completedGoals: number;
  achievementsEarned: number;
}

export interface SubjectAnalyticsData {
  subject: string;
  mastery: number;
  accuracy: number;
  questionsSolved: number;
  practiceMinutes: number;
  trend: ProgressTrendType;
  gapsCount: number;
  strongestTopics: string[];
  weakestTopics: string[];
  status: SubjectStatusType;
}

export interface TopicAnalyticsData {
  topicName: string;
  subject: string;
  mastery: number;
  masteryTrend: ProgressTrendType;
  practiceCount: number;
  accuracy: number;
  gapSeverity: 'critical' | 'high' | 'medium' | 'none';
  mistakeCount: number;
  recommendation: string;
}

export interface LearningGapProgressData {
  totalActiveGaps: number;
  criticalGaps: number;
  highGaps: number;
  mediumGaps: number;
  resolvedOrReducedGaps: number;
  gapClosureTrend: ProgressTrendType;
}

export interface DailyActivityPoint {
  date: string;
  questions: number;
  accuracy: number;
  minutes: number;
}

export interface PracticeAnalyticsData {
  totalQuestionsSolved: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  practiceSessionsCount: number;
  averageSessionSize: number;
  practiceStreak: number;
  dailyActivity: DailyActivityPoint[];
  mostPracticedSubjects: string[];
  leastPracticedSubjects: string[];
}

export interface ConsistencyScoreData {
  consistencyScore: number;
  consistencyLevel: ConsistencyLevelType;
  contributingFactors: string[];
}

export interface GoalAnalyticsData {
  activeGoalsCount: number;
  completedGoalsCount: number;
  averageProgress: number;
  goalsNearingCompletion: number;
  overdueGoalsCount: number;
  goalTrend: ProgressTrendType;
}

export interface ExamReadinessTrendData {
  examName?: string;
  daysRemaining?: number;
  currentReadiness?: number;
  readinessLevel?: string;
  previousReadiness?: number | null;
  readinessTrend: ProgressTrendType;
  priorityTopics?: string[];
  riskMode?: boolean;
}

export interface RiskAnalyticsData {
  currentRiskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskTrend: RiskTrendType;
  contributingFactors: string[];
  recoveryActions: string[];
}

export interface WeeklyLearningReportData {
  overallProgressTrend: ProgressTrendType;
  questionsSolved: number;
  accuracy: number;
  studyMinutes: number;
  planCompletionPercentage: number;
  currentStreak: number;
  wins: string[];
  areasNeedingAttention: string[];
  nextWeekPriorities: string[];
}

export interface AnalyticsAdviceData {
  naturalLanguageSummary: string;
  trendExplanation: string;
  encouragingFeedback: string;
  studyStrategy: string;
  prioritizationReason: string;
  aiGenerated: boolean;
  evaluatedAt: string;
}
