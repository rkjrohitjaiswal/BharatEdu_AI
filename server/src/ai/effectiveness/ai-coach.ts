import { EffectivenessInsight } from './types.js';

export class AIEffectivenessCoach {
  static generateInsight(
    strongestIntervention: string,
    overallEffectivenessScore: number
  ): EffectivenessInsight {
    return {
      headline: `Evidence Insights: ${strongestIntervention} is your top performing approach`,
      explanation: `Historical data shows that ${strongestIntervention.toLowerCase()} is associated with higher mastery retention and assessment score gains.`,
      evidenceSummary: `Overall learning effectiveness index is currently ${overallEffectivenessScore}%. Measured across completed practice, revision, and assessment sets.`,
      tentativeRecommendation: `Continue leveraging ${strongestIntervention} for challenging concepts while more evidence is collected on alternative approaches.`,
    };
  }
}
