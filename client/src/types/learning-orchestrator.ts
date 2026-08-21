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

export interface IOrchestrationActionItemClient {
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
  createdAt: string;
  completedAt?: string;
}

export interface IBlockedActionClient {
  action: IOrchestrationActionItemClient;
  blockedByConceptId: string;
  dependencyReason: string;
}

export interface IDailyActionPlanClient {
  date: string;
  totalAvailableMinutes: number;
  totalScheduledMinutes: number;
  morning: IOrchestrationActionItemClient[];
  afternoon: IOrchestrationActionItemClient[];
  evening: IOrchestrationActionItemClient[];
  optionalOverflow: IOrchestrationActionItemClient[];
}

export interface IWeeklyActionPlanClient {
  startDate: string;
  endDate: string;
  dailyPlans: Record<string, IDailyActionPlanClient>;
  weeklyFocus: string;
}

export interface IOrchestrationInsightClient {
  headline: string;
  explanation: string;
  keyActionRecommendation: string;
  prerequisiteAlert?: string;
  examStrategyTip?: string;
}

export interface IOrchestrationPlanClient {
  planId: string;
  studentId: string;
  generatedAt: string;
  date: string;
  overallStatus: 'on_track' | 'needs_attention' | 'high_priority' | 'critical';
  topPriority: string;
  dailyMinutesAvailable: number;
  nextBestAction: IOrchestrationActionItemClient;
  actions: IOrchestrationActionItemClient[];
  blockedActions: IBlockedActionClient[];
  completedActions: IOrchestrationActionItemClient[];
  dailyPlan: IDailyActionPlanClient;
  weeklyPlan: IWeeklyActionPlanClient;
  insight: IOrchestrationInsightClient;
}
