import {
  CoachRecommendation,
  CoachPriority,
  ReadinessScore,
  ReadinessLabel,
} from './types.js';

export const CoachRulesEngine = {
  calculateReadiness(params: {
    overallMastery: number;
    recentAccuracy: number;
    criticalGapsCount: number;
    highGapsCount: number;
    streak: number;
  }): ReadinessScore {
    const { overallMastery, recentAccuracy, criticalGapsCount, highGapsCount, streak } = params;

    let score = Math.round(overallMastery * 0.4 + recentAccuracy * 0.4);
    const gapPenalty = Math.min(35, criticalGapsCount * 15 + highGapsCount * 8);
    score -= gapPenalty;
    const streakBonus = Math.min(15, streak * 3);
    score += streakBonus;

    score = Math.max(10, Math.min(100, score));

    let label: ReadinessLabel = 'On Track';
    let explanation = 'You are maintaining solid learning progress across your curriculum.';

    if (score < 50) {
      label = 'Needs Attention';
      explanation = `You have ${criticalGapsCount + highGapsCount} active learning gaps that need remediation before starting new topics.`;
    } else if (score < 70) {
      label = 'Building Momentum';
      explanation = 'Consistent daily practice will help strengthen your topic mastery.';
    } else if (score < 90) {
      label = 'On Track';
      explanation = 'Your recent accuracy and mastery show steady learning growth.';
    } else {
      label = 'Strong Progress';
      explanation = `Outstanding performance! You have a ${streak}-day study streak and high topic mastery.`;
    }

    return { score, label, explanation };
  },

  prioritizeAndPack(candidateList: CoachRecommendation[], availableMinutes: number = 30): CoachRecommendation[] {
    const priorityWeight: Record<CoachPriority, number> = {
      CRITICAL: 1,
      HIGH: 2,
      MEDIUM: 3,
      LOW: 4,
    };

    // Sort strictly by priority weight
    candidateList.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);

    const packed: CoachRecommendation[] = [];
    let usedMinutes = 0;

    for (const item of candidateList) {
      if (usedMinutes + item.estimatedMinutes <= availableMinutes) {
        packed.push(item);
        usedMinutes += item.estimatedMinutes;
      } else {
        // Try trimming if item can fit partially or if time remains for smaller task
        const remaining = availableMinutes - usedMinutes;
        if (remaining >= 5) {
          packed.push({
            ...item,
            estimatedMinutes: remaining,
          });
          usedMinutes += remaining;
          break;
        }
      }
    }

    return packed;
  },
};
