import { RevisionOutcome } from '../../models/revision-history.model.js';
import { RevisionPriority } from '../../models/revision-item.model.js';
import { ISpacedRepetitionNextState } from './types.js';

export function calculateSpacedRepetitionNextState(
  currentIntervalDays: number,
  currentEaseFactor: number,
  outcome: RevisionOutcome
): ISpacedRepetitionNextState {
  let newIntervalDays = currentIntervalDays;
  let newEaseFactor = currentEaseFactor || 2.5;

  if (outcome === 'again') {
    newIntervalDays = 1;
    newEaseFactor -= 0.2;
  } else if (outcome === 'hard') {
    newIntervalDays = Math.max(1, Math.round(currentIntervalDays * 1.2));
    newEaseFactor -= 0.15;
  } else if (outcome === 'good') {
    newIntervalDays = Math.max(1, Math.round(currentIntervalDays * newEaseFactor));
  } else if (outcome === 'easy') {
    newIntervalDays = Math.max(2, Math.round(currentIntervalDays * newEaseFactor * 1.3));
    newEaseFactor += 0.15;
  }

  // Strict Ease Factor Bounds: 1.3 to 3.5
  newEaseFactor = Math.min(3.5, Math.max(1.3, Math.round(newEaseFactor * 100) / 100));

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newIntervalDays);

  return {
    newIntervalDays,
    newEaseFactor,
    nextReviewAt,
    outcome,
  };
}

export function determineRevisionPriority(context: {
  isRootPrereqGap: boolean;
  isHighRisk: boolean;
  daysUntilExam?: number;
  masteryScore: number;
  hasRepeatedMistakes: boolean;
  isGoalAligned: boolean;
}): { priority: RevisionPriority; reason: string } {
  const { isRootPrereqGap, isHighRisk, daysUntilExam, masteryScore, hasRepeatedMistakes, isGoalAligned } = context;

  if (isRootPrereqGap) {
    return {
      priority: 'critical',
      reason: 'Critical Root Prerequisite Gap: Must revise before attempting downstream concepts.',
    };
  }

  if (daysUntilExam !== undefined && daysUntilExam <= 7) {
    return {
      priority: 'critical',
      reason: `Exam Urgent (<${daysUntilExam} days away): Intensive revision required.`,
    };
  }

  if (isHighRisk) {
    return {
      priority: 'critical',
      reason: 'High Academic Risk Area: Scheduled for urgent spaced reinforcement.',
    };
  }

  if (masteryScore < 50 || hasRepeatedMistakes) {
    return {
      priority: 'high',
      reason: 'Weak Mastery & Repeated Mistakes: Needs short-interval repetition.',
    };
  }

  if (daysUntilExam !== undefined && daysUntilExam <= 14) {
    return {
      priority: 'high',
      reason: `Exam Approaching (${daysUntilExam} days away): High priority review.`,
    };
  }

  if (isGoalAligned) {
    return {
      priority: 'medium',
      reason: 'Goal Alignment: Directly supports your target career & learning goal.',
    };
  }

  if (masteryScore < 75) {
    return {
      priority: 'medium',
      reason: 'Standard Spaced Repetition: Recommended for long-term retention.',
    };
  }

  return {
    priority: 'low',
    reason: 'Strong Mastery Maintenance: Periodic refresher review.',
  };
}

export function calculateEstimatedMinutes(difficulty: string): number {
  if (difficulty === 'foundational' || difficulty === 'easy' || difficulty === 'beginner') return 8;
  if (difficulty === 'hard' || difficulty === 'advanced') return 15;
  return 10;
}
