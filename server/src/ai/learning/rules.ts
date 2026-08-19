import { DetectedGapType, GapSeverity } from './types.js';

export const MASTERY_THRESHOLDS = {
  NOT_STARTED_MAX_ATTEMPTS: 0,
  LEARNING_MAX_SCORE: 49,
  NEEDS_REVIEW_MAX_SCORE: 79,
  MASTERED_MIN_SCORE: 80,
};

export const calculateMasteryScore = (
  currentMastery: number,
  attempts: number,
  correctAttempts: number,
  isCorrect: boolean
): { masteryScore: number; status: 'not_started' | 'learning' | 'needs_review' | 'mastered' } => {
  if (attempts <= 0) {
    return { masteryScore: 0, status: 'not_started' };
  }

  const accuracy = (correctAttempts / attempts) * 100;
  // Transparent bounded mastery formula: 80% accuracy weight + 20% recent performance boost
  const rawScore = Math.round(accuracy * 0.8 + (isCorrect ? 20 : -10));
  const masteryScore = Math.min(100, Math.max(0, rawScore));

  let status: 'not_started' | 'learning' | 'needs_review' | 'mastered' = 'learning';
  if (masteryScore >= MASTERY_THRESHOLDS.MASTERED_MIN_SCORE) {
    status = 'mastered';
  } else if (masteryScore >= 50) {
    status = 'needs_review';
  } else {
    status = 'learning';
  }

  return { masteryScore, status };
};

export const calculateConfidenceScore = (attempts: number, consistencyAccuracy: number): number => {
  if (attempts <= 0) return 0.1;
  // Bounded confidence score (0.10 to 1.00) based on sample size and consistency
  const sampleFactor = Math.min(attempts, 10) / 10;
  const consistencyFactor = Math.max(0.5, consistencyAccuracy / 100);
  const score = Math.round(sampleFactor * consistencyFactor * 100) / 100;
  return Math.min(1.0, Math.max(0.1, score));
};

export const determineGapSeverity = (
  masteryScore: number,
  incorrectAttempts: number,
  hasPrerequisiteWeakness: boolean
): GapSeverity => {
  if (masteryScore < 30 && incorrectAttempts >= 3 && hasPrerequisiteWeakness) {
    return 'critical';
  }
  if (masteryScore < 45 && incorrectAttempts >= 2) {
    return 'high';
  }
  if (masteryScore < 60) {
    return 'medium';
  }
  return 'low';
};
