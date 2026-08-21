export type LearningOutcomeType =
  | 'mastery_change'
  | 'accuracy_change'
  | 'assessment_change'
  | 'readiness_change'
  | 'risk_change'
  | 'revision_success'
  | 'plan_adherence'
  | 'learning_path_progress'
  | 'doubt_resolution'
  | 'resource_completion'
  | 'exam_readiness'
  | 'goal_progress';

export type OutcomeStatus = 'pending' | 'measured' | 'insufficient_evidence' | 'invalid';
export type EffectivenessClassification =
  | 'strongly_effective'
  | 'effective'
  | 'neutral'
  | 'weak_effect'
  | 'insufficient_evidence';

export interface BaselineSnapshot {
  studentId: string;
  actionId: string;
  conceptId: string;
  topic: string;
  masteryPct: number;
  accuracyPct: number;
  assessmentScorePct?: number;
  readinessScorePct?: number;
  riskScore?: number;
  capturedAt: Date;
}

export interface FollowupSnapshot {
  studentId: string;
  actionId: string;
  conceptId: string;
  masteryPct: number;
  accuracyPct: number;
  assessmentScorePct?: number;
  readinessScorePct?: number;
  riskScore?: number;
  measuredAt: Date;
}

export interface LearningOutcomeItem {
  outcomeId: string;
  studentId: string;
  actionId: string;
  sourceFeature: string;
  conceptId: string;
  topic: string;
  outcomeType: LearningOutcomeType;
  baselineSnapshot: BaselineSnapshot;
  followupSnapshot?: FollowupSnapshot;
  baselineAt: Date;
  measuredAt?: Date;
  delta: number;
  confidence: number;
  measurementWindowDays: number;
  classification: EffectivenessClassification;
  status: OutcomeStatus;
  createdAt: Date;
}

export interface ActionEffectivenessMetrics {
  actionType: string;
  attempts: number;
  completions: number;
  completionRatePct: number;
  measurableImprovements: number;
  effectivenessScore: number; // 0 - 100
  evidenceLevel: EffectivenessClassification;
  avgEstimatedMinutes: number;
  avgActualMinutes: number;
}

export interface ConceptEffectivenessAssociation {
  conceptId: string;
  topic: string;
  actionType: string;
  observedDelta: number;
  sampleSize: number;
  classification: EffectivenessClassification;
  summaryText: string;
}

export interface StudentEffectivenessProfile {
  studentId: string;
  effectiveActionTypes: string[];
  lessEffectiveActionTypes: string[];
  completionRatePct: number;
  studyTimeAccuracyPct: number;
  retentionScorePct: number;
  recoveryRatePct: number;
  assessmentTransferScore: number;
}

export interface OrchestratorFeedbackData {
  effectiveInterventions: string[];
  weakInterventions: string[];
  insufficientEvidence: string[];
  confidence: number;
  recommendedAdjustment: string;
}

export interface EffectivenessInsight {
  headline: string;
  explanation: string;
  evidenceSummary: string;
  tentativeRecommendation: string;
}
