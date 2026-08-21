import { EffectivenessClassification } from './types.js';

export class OutcomeClassificationEngine {
  static classify(
    effectivenessScore: number,
    delta: number,
    hasFollowup: boolean
  ): EffectivenessClassification {
    if (!hasFollowup) return 'insufficient_evidence';

    if (effectivenessScore >= 80 && delta >= 10) {
      return 'strongly_effective';
    }
    if (effectivenessScore >= 65 && delta > 2) {
      return 'effective';
    }
    if (effectivenessScore >= 45 && delta >= 0) {
      return 'neutral';
    }
    if (delta < 0) {
      return 'weak_effect';
    }

    return 'neutral';
  }
}
