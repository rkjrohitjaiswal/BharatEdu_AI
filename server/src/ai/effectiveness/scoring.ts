import { BaselineSnapshot, FollowupSnapshot } from './types.js';

export class EffectivenessScoringEngine {
  static calculateScore(
    baseline: BaselineSnapshot,
    followup?: FollowupSnapshot,
    actionCompleted: boolean = true
  ): {
    effectivenessScore: number;
    delta: number;
    confidence: number;
  } {
    if (!followup) {
      return {
        effectivenessScore: actionCompleted ? 45 : 20,
        delta: 0,
        confidence: 30,
      };
    }

    const masteryDelta = followup.masteryPct - baseline.masteryPct;
    const accuracyDelta = followup.accuracyPct - baseline.accuracyPct;
    const avgDelta = (masteryDelta + accuracyDelta) / 2;

    // Weighting: 30% completion, 50% delta improvement, 20% assessment transfer
    let score = (actionCompleted ? 30 : 0) + Math.max(0, avgDelta) * 3 + 20;
    score = Math.min(100, Math.max(0, Math.round(score)));

    const confidence = Math.min(95, Math.max(40, Math.round(60 + Math.abs(avgDelta) * 1.5)));

    return {
      effectivenessScore: score,
      delta: Math.round(avgDelta * 10) / 10,
      confidence,
    };
  }
}
