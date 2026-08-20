import { RevisionPriorityType } from './types.js';
import { ReviewLevel, ReviewResultType } from '../../models/revision-item.model.js';

export function calculateDeterministicRetention(
  masteryScore: number,
  lastReviewedAt?: Date | string,
  consecutiveCorrect: number = 0,
  consecutiveIncorrect: number = 0,
  mistakeCount: number = 0
): number {
  let score = masteryScore;

  // Time decay factor
  if (lastReviewedAt) {
    const daysSince = (Date.now() - new Date(lastReviewedAt).getTime()) / (1000 * 60 * 60 * 24);
    const decay = Math.min(40, Math.round(daysSince * 2.5));
    score -= decay;
  }

  // Consecutive performance bonus / penalty
  score += Math.min(20, consecutiveCorrect * 5);
  score -= Math.min(25, consecutiveIncorrect * 8 + mistakeCount * 4);

  return Math.min(100, Math.max(10, Math.round(score)));
}

export function calculateDeterministicPriorityScore(context: {
  retentionScore: number;
  masteryScore: number;
  gapSeverity?: string;
  examDaysRemaining?: number;
  mistakeCount?: number;
  isGoalRelated?: boolean;
  riskLevel?: string;
}): { score: number; priority: RevisionPriorityType; reason: string } {
  let pts = 0;
  let reason = 'Scheduled periodic revision.';

  // 1. Retention decay (Max 25 pts)
  const retentionDecayPts = Math.round((100 - context.retentionScore) * 0.25);
  pts += retentionDecayPts;
  if (context.retentionScore < 40) {
    reason = `Retention decay detected (${context.retentionScore}% retention score).`;
  }

  // 2. Learning gap severity (Max 20 pts)
  if (context.gapSeverity === 'critical') {
    pts += 20;
    reason = 'Addresses critical active learning gap.';
  } else if (context.gapSeverity === 'high') {
    pts += 15;
    reason = 'Addresses high-severity learning gap.';
  } else if (context.gapSeverity) {
    pts += 10;
  }

  // 3. Exam urgency (Max 20 pts)
  if (context.examDaysRemaining !== undefined) {
    if (context.examDaysRemaining <= 3) {
      pts += 20;
      reason = `Urgent exam revision (exam in ${context.examDaysRemaining} days).`;
    } else if (context.examDaysRemaining <= 7) {
      pts += 15;
      reason = `Upcoming exam revision (exam in ${context.examDaysRemaining} days).`;
    } else if (context.examDaysRemaining <= 14) {
      pts += 10;
    }
  }

  // 4. Mistake frequency (Max 15 pts)
  if (context.mistakeCount && context.mistakeCount > 0) {
    const mistakePts = Math.min(15, context.mistakeCount * 4);
    pts += mistakePts;
    if (!reason.includes('gap') && !reason.includes('exam')) {
      reason = `Repeated mistakes detected on this concept (${context.mistakeCount} attempts).`;
    }
  }

  // 5. Mastery weakness (Max 10 pts)
  if (context.masteryScore < 60) {
    const masteryPts = Math.round((60 - context.masteryScore) * 0.25);
    pts += masteryPts;
    if (!reason.includes('gap') && !reason.includes('exam')) {
      reason = `Low topic mastery (${context.masteryScore}%).`;
    }
  }

  // 6. Goal relevance (Max 5 pts)
  if (context.isGoalRelated) {
    pts += 5;
  }

  // 7. Risk relevance (Max 5 pts)
  if (context.riskLevel === 'critical' || context.riskLevel === 'high') {
    pts += 5;
  }

  const boundedPts = Math.min(100, Math.max(5, Math.round(pts)));

  let priority: RevisionPriorityType = 'LOW';
  if (boundedPts >= 75) priority = 'CRITICAL';
  else if (boundedPts >= 50) priority = 'HIGH';
  else if (boundedPts >= 25) priority = 'MEDIUM';

  return { score: boundedPts, priority, reason };
}

export function calculateReviewResult(
  questionsAttempted: number,
  questionsCorrect: number
): { accuracy: number; result: ReviewResultType } {
  if (questionsAttempted <= 0) {
    return { accuracy: 0, result: 'failed' };
  }

  const accuracy = Math.min(100, Math.max(0, Math.round((questionsCorrect / questionsAttempted) * 100)));

  let result: ReviewResultType = 'failed';
  if (accuracy >= 80) result = 'strong';
  else if (accuracy >= 60) result = 'passed';
  else if (accuracy >= 40) result = 'weak';

  return { accuracy, result };
}

export function updateSpacedRepetitionInterval(
  currentInterval: number,
  repetitionCount: number,
  result: ReviewResultType,
  currentRetention: number,
  consecutiveCorrect: number,
  consecutiveIncorrect: number
): {
  nextIntervalDays: number;
  newRetentionScore: number;
  newReviewLevel: ReviewLevel;
  newConsecutiveCorrect: number;
  newConsecutiveIncorrect: number;
} {
  let nextIntervalDays = currentInterval;
  let newRetention = currentRetention;
  let newConsecutiveCorrect = consecutiveCorrect;
  let newConsecutiveIncorrect = consecutiveIncorrect;

  const progressionTable = [1, 2, 4, 7, 14, 30, 60];

  switch (result) {
    case 'failed':
      nextIntervalDays = 1;
      newRetention = Math.max(10, currentRetention - 15);
      newConsecutiveCorrect = 0;
      newConsecutiveIncorrect += 1;
      break;

    case 'weak':
      nextIntervalDays = Math.max(1, Math.min(2, Math.floor(currentInterval * 0.8)));
      newRetention = Math.min(100, currentRetention + 5);
      newConsecutiveCorrect = 0;
      newConsecutiveIncorrect = 0;
      break;

    case 'passed':
      newConsecutiveCorrect += 1;
      newConsecutiveIncorrect = 0;
      nextIntervalDays = Math.min(60, Math.max(2, Math.round(currentInterval * 1.5)));
      newRetention = Math.min(100, currentRetention + 10);
      break;

    case 'strong':
      newConsecutiveCorrect += 1;
      newConsecutiveIncorrect = 0;
      const stepIndex = Math.min(progressionTable.length - 1, repetitionCount + 1);
      nextIntervalDays = progressionTable[stepIndex] || Math.min(60, currentInterval * 2);
      newRetention = Math.min(100, currentRetention + 15);
      break;
  }

  let newReviewLevel: ReviewLevel = 'learning';
  if (newRetention >= 90 && newConsecutiveCorrect >= 3) newReviewLevel = 'mastered';
  else if (newRetention >= 75) newReviewLevel = 'retained';
  else if (newRetention >= 50) newReviewLevel = 'reinforcing';
  else if (newRetention >= 30) newReviewLevel = 'learning';
  else newReviewLevel = 'new';

  return {
    nextIntervalDays,
    newRetentionScore: newRetention,
    newReviewLevel,
    newConsecutiveCorrect,
    newConsecutiveIncorrect,
  };
}
