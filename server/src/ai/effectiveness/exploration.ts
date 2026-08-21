export class ExplorationEngine {
  static getExplorationRatio(
    riskLevel: 'low' | 'medium' | 'high' | 'critical',
    examDaysRemaining?: number
  ): { evidenceRatio: number; explorationRatio: number } {
    if (riskLevel === 'critical' || (examDaysRemaining !== undefined && examDaysRemaining <= 7)) {
      return { evidenceRatio: 0.95, explorationRatio: 0.05 };
    }
    if (riskLevel === 'high' || (examDaysRemaining !== undefined && examDaysRemaining <= 14)) {
      return { evidenceRatio: 0.9, explorationRatio: 0.1 };
    }
    return { evidenceRatio: 0.8, explorationRatio: 0.2 };
  }
}
