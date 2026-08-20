export class ExamGapAnalysisEngine {
  static analyzeGaps(params: {
    masteryMap: Record<string, number>;
    prerequisiteGaps: string[];
    overdueRevisions: string[];
    recentMockAccuracyPct?: number;
  }): Array<{ gapId: string; gapType: string; topic: string; impactScore: number; description: string }> {
    const gaps: Array<{ gapId: string; gapType: string; topic: string; impactScore: number; description: string }> = [];

    params.prerequisiteGaps.forEach((concept, idx) => {
      gaps.push({
        gapId: `gap_pre_${idx}`,
        gapType: 'prerequisite',
        topic: concept.replace(/_/g, ' '),
        impactScore: 90,
        description: `Unmet prerequisite concept blocking higher-level application in ${concept.replace(/_/g, ' ')}.`,
      });
    });

    Object.entries(params.masteryMap).forEach(([concept, score], idx) => {
      if (score < 60) {
        gaps.push({
          gapId: `gap_mas_${idx}`,
          gapType: 'mastery',
          topic: concept.replace(/_/g, ' '),
          impactScore: 100 - score,
          description: `Low concept mastery (${score}%) in ${concept.replace(/_/g, ' ')}.`,
        });
      }
    });

    params.overdueRevisions.forEach((concept, idx) => {
      gaps.push({
        gapId: `gap_rev_${idx}`,
        gapType: 'revision',
        topic: concept.replace(/_/g, ' '),
        impactScore: 65,
        description: `Spaced revision overdue for ${concept.replace(/_/g, ' ')}. High risk of memory decay.`,
      });
    });

    if (params.recentMockAccuracyPct && params.recentMockAccuracyPct < 65) {
      gaps.push({
        gapId: 'gap_mock_acc',
        gapType: 'mock_time_management',
        topic: 'Exam Timing & Speed',
        impactScore: 75,
        description: `Recent mock exam accuracy (${params.recentMockAccuracyPct}%) indicates time pressure and avoidable errors.`,
      });
    }

    return gaps.sort((a, b) => b.impactScore - a.impactScore);
  }
}
