import { ExamPrediction } from './types.js';

export class ExamImprovementEngine {
  static generateImprovementPlan(params: {
    currentReadinessScore: number;
    gapsCount: number;
    topWeakTopics: string[];
  }): ExamPrediction {
    const minEst = Math.min(95, Math.max(30, Math.round(params.currentReadinessScore * 0.85)));
    const maxEst = Math.min(98, Math.max(45, Math.round(params.currentReadinessScore * 1.15)));

    const improvementPath: string[] = [];
    if (params.topWeakTopics.length > 0) {
      improvementPath.push(`Master foundational concepts in ${params.topWeakTopics.slice(0, 2).join(', ')}.`);
    }
    improvementPath.push('Complete 2 timed mock exams with full question error analysis.');
    improvementPath.push('Fulfill scheduled daily spaced revisions to prevent memory decay.');

    return {
      expectedScoreRange: { min: minEst, max: maxEst },
      readinessPercentage: params.currentReadinessScore,
      disclaimer: 'Score estimates are projections based on server-evaluated practice data and do not guarantee official exam outcomes.',
      improvementPath,
    };
  }
}
