import { ExamReadinessSnapshot } from './types.js';

export class ExamReadinessEngine {
  static calculateReadiness(params: {
    masteryMap: Record<string, number>;
    totalSyllabusConcepts: number;
    practiceAccuracyPct: number;
    mockScores: number[];
    revisionCompletionPct: number;
    targetExamDate: Date;
    serverNow?: Date;
  }): ExamReadinessSnapshot {
    const now = params.serverNow || new Date();
    const examTime = new Date(params.targetExamDate).getTime();
    const diffDays = Math.max(1, Math.ceil((examTime - now.getTime()) / (1000 * 3600 * 24)));

    const masteredCount = Object.values(params.masteryMap).filter((m) => m >= 70).length;
    const totalConcepts = Math.max(1, params.totalSyllabusConcepts || 10);
    const conceptMasteryPct = Math.min(100, Math.round((masteredCount / totalConcepts) * 100));

    const topicCoveragePct = Math.min(100, Math.round((Object.keys(params.masteryMap).length / totalConcepts) * 100));
    const practiceAccuracyPct = Math.min(100, Math.max(0, params.practiceAccuracyPct || 65));

    const mockPerformancePct =
      params.mockScores && params.mockScores.length > 0
        ? Math.round(params.mockScores.reduce((a, b) => a + b, 0) / params.mockScores.length)
        : 60;

    const revisionCompletionPct = Math.min(100, Math.max(0, params.revisionCompletionPct || 70));

    // Weighted Readiness Calculation (Server Authoritative)
    const rawScore =
      conceptMasteryPct * 0.35 +
      topicCoveragePct * 0.2 +
      practiceAccuracyPct * 0.15 +
      mockPerformancePct * 0.2 +
      revisionCompletionPct * 0.1;

    const readinessScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    let status: 'critical' | 'needs_improvement' | 'on_track' | 'exam_ready' = 'on_track';
    if (readinessScore < 40) status = 'critical';
    else if (readinessScore < 65) status = 'needs_improvement';
    else if (readinessScore < 85) status = 'on_track';
    else status = 'exam_ready';

    return {
      readinessScore,
      status,
      conceptMasteryPct,
      topicCoveragePct,
      practiceAccuracyPct,
      mockPerformancePct,
      revisionCompletionPct,
      daysRemaining: diffDays,
    };
  }
}
