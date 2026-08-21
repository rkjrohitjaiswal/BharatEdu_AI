import { BaselineSnapshot, FollowupSnapshot } from './types.js';

export class DataQualityEngine {
  static validateOutcomeData(
    baseline?: BaselineSnapshot,
    followup?: FollowupSnapshot
  ): { isValid: boolean; reason?: string } {
    if (!baseline) {
      return { isValid: false, reason: 'Missing baseline snapshot' };
    }

    if (baseline.masteryPct < 0 || baseline.masteryPct > 100) {
      return { isValid: false, reason: 'Invalid baseline mastery range' };
    }

    if (followup) {
      if (followup.measuredAt < baseline.capturedAt) {
        return { isValid: false, reason: 'Follow-up timestamp precedes baseline timestamp' };
      }
      if (followup.masteryPct < 0 || followup.masteryPct > 100) {
        return { isValid: false, reason: 'Invalid follow-up mastery range' };
      }
    }

    return { isValid: true };
  }
}
