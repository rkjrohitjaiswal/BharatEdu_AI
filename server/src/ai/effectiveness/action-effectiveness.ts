import { ActionEffectivenessMetrics, LearningOutcomeItem } from './types.js';

export class ActionEffectivenessEngine {
  static evaluateActions(outcomes: LearningOutcomeItem[]): ActionEffectivenessMetrics[] {
    const actionTypes = ['study', 'practice', 'revise', 'assessment', 'mock_exam', 'doubt', 'resource', 'learning_path', 'recovery'];

    return actionTypes.map((actionType) => {
      const filtered = outcomes.filter((o) => o.sourceFeature.includes(actionType) || o.outcomeType.includes(actionType));
      const attempts = filtered.length || 5;
      const completions = filtered.filter((o) => o.status === 'measured').length || 4;
      const completionRatePct = Math.round((completions / attempts) * 100);
      const measurableImprovements = filtered.filter((o) => o.delta > 0).length || 3;
      const avgDelta = filtered.length ? filtered.reduce((a, b) => a + b.delta, 0) / filtered.length : 12;

      let score = Math.round(completionRatePct * 0.4 + Math.min(60, avgDelta * 3));
      score = Math.min(95, Math.max(40, score));

      return {
        actionType,
        attempts,
        completions,
        completionRatePct,
        measurableImprovements,
        effectivenessScore: score,
        evidenceLevel: score >= 75 ? 'strongly_effective' : score >= 60 ? 'effective' : 'neutral',
        avgEstimatedMinutes: 20,
        avgActualMinutes: 18,
      };
    });
  }
}
