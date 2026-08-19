export type CoachRecommendationType =
  | 'critical_gap'
  | 'high_gap'
  | 'prerequisite_gap'
  | 'misconception'
  | 'recent_mistake'
  | 'weak_mastery'
  | 'study_plan_task'
  | 'recommended_topic'
  | 'revision'
  | 'enrichment'
  | 'scholarship_alert';

export type CoachActionType =
  | 'practice'
  | 'mistake_review'
  | 'tutor'
  | 'study_plan'
  | 'revision'
  | 'scholarship';

export type CoachPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface CoachRecommendation {
  id: string;
  type: CoachRecommendationType;
  priority: CoachPriority;
  subject?: string;
  topic?: string;
  title: string;
  reason: string;
  estimatedMinutes: number;
  action: CoachActionType;
  targetRoute: string;
  payload?: any;
}

export type ReadinessLabel = 'Needs Attention' | 'Building Momentum' | 'On Track' | 'Strong Progress';

export interface ReadinessScore {
  score: number;
  label: ReadinessLabel;
  explanation: string;
}

export interface CoachPlanPayload {
  date: string;
  greeting: string;
  readiness: ReadinessScore;
  dailyGoal: string;
  availableMinutes: number;
  completedMinutes: number;
  remainingMinutes: number;
  recommendations: CoachRecommendation[];
  streak: number;
  motivation: string;
  aiEnhanced: boolean;
}
