export type EffectivenessClassificationClient =
  | 'strongly_effective'
  | 'effective'
  | 'neutral'
  | 'weak_effect'
  | 'insufficient_evidence';

export interface IActionEffectivenessMetricsClient {
  actionType: string;
  attempts: number;
  completions: number;
  completionRatePct: number;
  measurableImprovements: number;
  effectivenessScore: number;
  evidenceLevel: EffectivenessClassificationClient;
  avgEstimatedMinutes: number;
  avgActualMinutes: number;
}

export interface IConceptEffectivenessAssociationClient {
  conceptId: string;
  topic: string;
  actionType: string;
  observedDelta: number;
  sampleSize: number;
  classification: EffectivenessClassificationClient;
  summaryText: string;
}

export interface IEffectivenessSummaryClient {
  studentId: string;
  overallEffectivenessScore: number;
  confidence: number;
  classification: EffectivenessClassificationClient;
  actionMetrics: IActionEffectivenessMetricsClient[];
  conceptAssociations: IConceptEffectivenessAssociationClient[];
  strongestInterventions: string[];
  weakestInterventions: string[];
  insufficientEvidence: string[];
  completionRatePct: number;
  improvementRatePct: number;
  retentionRatePct: number;
  studyEfficiencyPct: number;
  assessmentTransferScore: number;
}
