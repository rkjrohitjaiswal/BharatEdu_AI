export type AnalysisType = 'quiz_answer' | 'practice_attempt' | 'tutor_doubt' | 'assessment';
export type DetectedGapType = 'knowledge_gap' | 'prerequisite_gap' | 'misconception' | 'practice_gap' | 'none';
export type GapSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface LearningEvidencePayload {
  studentId: string;
  topicId: string;
  evidenceId: string;
  analysisType: AnalysisType;
  isCorrect: boolean;
  studentAnswer?: string;
  confidence?: number;
}

export interface MisconceptionAnalysisResult {
  isMisconception: boolean;
  concept: string;
  misconception: string;
  confidence: number;
  evidence: string;
  recommendedAction: string;
}

export interface LearningAnalysisResult {
  topicId: string;
  masteryScore: number;
  masteryStatus: 'not_started' | 'learning' | 'needs_review' | 'mastered';
  confidenceScore: number;
  detectedGapType: DetectedGapType;
  severity: GapSeverity;
  gapConfidence: number;
  evidenceSummary: string;
  recommendedAction: {
    type: string;
    reason: string;
  };
}
