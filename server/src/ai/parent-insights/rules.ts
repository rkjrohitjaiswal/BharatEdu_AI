import { ParentProgressTrend } from './types.js';

export const ParentInsightsRulesEngine = {
  calculateProgressTrend(params: {
    overallMastery: number;
    recentAccuracy: number;
    activeGapCount: number;
    criticalGapCount: number;
    practiceStreak: number;
    completedTaskRatio: number;
  }): {
    trend: ParentProgressTrend;
    score: number;
    explanation: string;
  } {
    const {
      overallMastery,
      recentAccuracy,
      activeGapCount,
      criticalGapCount,
      practiceStreak,
      completedTaskRatio,
    } = params;

    // Mathematical Trend Score calculation (bounded 0-100)
    let score = Math.round(
      overallMastery * 0.35 +
      recentAccuracy * 0.35 +
      completedTaskRatio * 20 +
      Math.min(10, practiceStreak * 2)
    );

    score -= Math.min(30, criticalGapCount * 12 + activeGapCount * 5);
    score = Math.max(10, Math.min(100, score));

    let trend: ParentProgressTrend = 'stable';
    let explanation = 'Your child is maintaining steady learning consistency.';

    if (score >= 70 && criticalGapCount === 0) {
      trend = 'improving';
      explanation = 'Your child is demonstrating steady mastery improvements across subject topics.';
    } else if (score < 50 || criticalGapCount > 0) {
      trend = 'needs_attention';
      explanation = 'Some topics require additional practice and remediation.';
    } else {
      trend = 'stable';
      explanation = 'Consistent daily practice will help strengthen topic understanding.';
    }

    return { trend, score, explanation };
  },
};
