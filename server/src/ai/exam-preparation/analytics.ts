export class ExamAnalyticsEngine {
  static calculateAnalytics(params: {
    masteryMap: Record<string, number>;
    mockHistory: Array<{ score: number; date: Date }>;
    daysRemaining: number;
  }): {
    syllabusCoveragePct: number;
    readinessTrend: 'improving' | 'stable' | 'declining';
    preparationVelocity: number; // concepts/week
    estimatedCompletionDays: number;
  } {
    const totalConcepts = 10;
    const coveredConcepts = Object.keys(params.masteryMap).length;
    const syllabusCoveragePct = Math.min(100, Math.round((coveredConcepts / totalConcepts) * 100));

    let readinessTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (params.mockHistory && params.mockHistory.length >= 2) {
      const last = params.mockHistory[params.mockHistory.length - 1].score;
      const prev = params.mockHistory[params.mockHistory.length - 2].score;
      if (last > prev + 5) readinessTrend = 'improving';
      else if (last < prev - 5) readinessTrend = 'declining';
    }

    const preparationVelocity = Math.max(1, Math.round(coveredConcepts * 0.8));
    const remainingConcepts = totalConcepts - coveredConcepts;
    const estimatedCompletionDays = Math.ceil((remainingConcepts / Math.max(1, preparationVelocity)) * 7);

    return {
      syllabusCoveragePct,
      readinessTrend,
      preparationVelocity,
      estimatedCompletionDays,
    };
  }
}
