export type OrchestrationPriority = 'critical' | 'high' | 'medium' | 'low';
export type OrchestrationActionStatus = 'recommended' | 'started' | 'completed' | 'skipped' | 'blocked';
export type OrchestrationActionType =
  | 'study'
  | 'practice'
  | 'revise'
  | 'assessment'
  | 'mock_exam'
  | 'doubt'
  | 'resource'
  | 'learning_path'
  | 'exam_prep'
  | 'recovery'
  | 'goal';

export interface StudentIntelligenceSnapshot {
  studentId: string;
  masteryMap: Record<string, number>;
  weakConcepts: string[];
  prerequisiteGaps: string[];
  rootGaps: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  revisionDueItems: Array<{ conceptId: string; topic: string }>;
  activeLearningPathStage?: { stageId: string; title: string; conceptId: string };
  examReadinessScore: number;
  upcomingExam?: { examId: string; examName: string; examDate: Date; daysRemaining: number };
  recentAssessmentAccuracy: number;
  mockPerformance?: { averageScorePct: number; weakTopics: string[] };
  availableDailyMinutes: number;
  doubtTopics: string[];
  learningGoals: string[];
  careerSkills: string[];
  mentorSummary?: string;
  resourceProgressCount: number;
}

export interface OrchestrationContext {
  studentId: string;
  targetDate: Date;
  availableMinutes: number;
  preferredLanguage?: string;
  examApproaching?: boolean;
}

export interface OrchestrationSignal {
  source: string;
  signalType: string;
  conceptId: string;
  topic: string;
  recommendedActionType: OrchestrationActionType;
  urgency: number; // 0 - 100
  impact: number; // 0 - 100
  confidence: number; // 0 - 100
  effortMinutes: number;
  reason: string;
  examRelevance?: boolean;
  goalRelevance?: boolean;
}

export interface PriorityScore {
  actionId: string;
  totalScore: number;
  rank: number;
  priority: OrchestrationPriority;
  explanation: string;
}

export interface OrchestrationActionItem {
  actionId: string;
  studentId: string;
  actionType: OrchestrationActionType;
  sourceFeature: string;
  conceptId: string;
  topic: string;
  title: string;
  description: string;
  priority: OrchestrationPriority;
  priorityScore: number;
  estimatedMinutes: number;
  reason: string;
  actionUrl: string;
  prerequisiteActionId?: string;
  status: OrchestrationActionStatus;
  createdAt: Date;
  completedAt?: Date;
}

export interface BlockedAction {
  action: OrchestrationActionItem;
  blockedByConceptId: string;
  dependencyReason: string;
}

export interface DailyActionPlan {
  date: Date;
  totalAvailableMinutes: number;
  totalScheduledMinutes: number;
  morning: OrchestrationActionItem[];
  afternoon: OrchestrationActionItem[];
  evening: OrchestrationActionItem[];
  optionalOverflow: OrchestrationActionItem[];
}

export interface WeeklyActionPlan {
  startDate: Date;
  endDate: Date;
  dailyPlans: Record<string, DailyActionPlan>;
  weeklyFocus: string;
}

export interface OrchestrationInsight {
  headline: string;
  explanation: string;
  keyActionRecommendation: string;
  prerequisiteAlert?: string;
  examStrategyTip?: string;
}

export interface OrchestrationPlan {
  planId: string;
  studentId: string;
  generatedAt: Date;
  date: Date;
  overallStatus: 'on_track' | 'needs_attention' | 'high_priority' | 'critical';
  topPriority: string;
  dailyMinutesAvailable: number;
  nextBestAction: OrchestrationActionItem;
  actions: OrchestrationActionItem[];
  blockedActions: BlockedAction[];
  completedActions: OrchestrationActionItem[];
  dailyPlan: DailyActionPlan;
  weeklyPlan: WeeklyActionPlan;
  insight: OrchestrationInsight;
}

export interface OrchestrationSummary {
  plan: OrchestrationPlan;
  summaryGeneratedAt: Date;
}
