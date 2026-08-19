import {
  OverallReadinessClassification,
  DaysRemainingCategory,
  TopicReadinessDetail,
  ScoreBreakdown,
} from './types.js';

export class ExamReadinessRules {
  /**
   * Calculates days remaining from target exam date
   */
  static calculateDaysRemaining(examDate: Date | string): {
    daysRemaining: number;
    category: DaysRemainingCategory;
  } {
    const target = new Date(examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let category: DaysRemainingCategory = 'normal_prep';
    if (daysRemaining < 0) {
      category = 'past';
    } else if (daysRemaining === 0) {
      category = 'exam_day';
    } else if (daysRemaining <= 6) {
      category = 'critical_mode';
    } else if (daysRemaining <= 14) {
      category = 'high_risk_mode';
    } else if (daysRemaining <= 30) {
      category = 'weak_focus_mode';
    }

    return { daysRemaining, category };
  }

  /**
   * Classifies numerical readiness score into 5 levels
   */
  static classifyReadinessScore(score: number): OverallReadinessClassification {
    if (score >= 90) return 'strong';
    if (score >= 75) return 'ready';
    if (score >= 60) return 'developing';
    if (score >= 40) return 'needs_attention';
    return 'critical';
  }

  /**
   * Weighted formula:
   * Mastery: 40%
   * Practice accuracy: 20%
   * Confidence: 15%
   * Recent practice consistency: 10%
   * Learning-gap health: 10%
   * Study-plan completion: 5%
   */
  static calculateWeightedScore(data: {
    averageMastery: number; // 0-100
    practiceAccuracy: number; // 0-100
    averageConfidence: number; // 0-1
    consistencyScore: number; // 0-10
    activeGapsCount: { critical: number; high: number; medium: number };
    studyPlanCompletionPercent: number; // 0-100
  }): { score: number; breakdown: ScoreBreakdown } {
    const masteryContribution = Math.min(40, Math.max(0, (data.averageMastery / 100) * 40));
    const practiceAccuracyContribution = Math.min(20, Math.max(0, (data.practiceAccuracy / 100) * 20));
    const confidenceContribution = Math.min(15, Math.max(0, data.averageConfidence * 15));
    const consistencyContribution = Math.min(10, Math.max(0, data.consistencyScore));

    // Gap Health: start at 10, subtract 3 per critical, 2 per high, 1 per medium
    let gapHealth = 10 - (data.activeGapsCount.critical * 3 + data.activeGapsCount.high * 2 + data.activeGapsCount.medium * 1);
    const gapHealthContribution = Math.min(10, Math.max(0, gapHealth));

    const studyPlanContribution = Math.min(5, Math.max(0, (data.studyPlanCompletionPercent / 100) * 5));

    const rawTotal =
      masteryContribution +
      practiceAccuracyContribution +
      confidenceContribution +
      consistencyContribution +
      gapHealthContribution +
      studyPlanContribution;

    const score = Math.min(100, Math.max(0, Math.round(rawTotal)));

    return {
      score,
      breakdown: {
        masteryContribution: Math.round(masteryContribution * 10) / 10,
        practiceAccuracyContribution: Math.round(practiceAccuracyContribution * 10) / 10,
        confidenceContribution: Math.round(confidenceContribution * 10) / 10,
        consistencyContribution: Math.round(consistencyContribution * 10) / 10,
        gapHealthContribution: Math.round(gapHealthContribution * 10) / 10,
        studyPlanContribution: Math.round(studyPlanContribution * 10) / 10,
      },
    };
  }

  /**
   * Deterministically evaluates topic priority and human-readable reason
   */
  static evaluateTopicPriority(params: {
    masteryScore: number;
    confidenceScore: number;
    gapSeverity?: string;
    recentMistakesCount: number;
    daysRemaining: number;
  }): { priority: 'critical' | 'high' | 'medium' | 'low'; readinessLevel: 'weak' | 'developing' | 'ready' | 'strong'; reason: string } {
    const { masteryScore, confidenceScore, gapSeverity, recentMistakesCount, daysRemaining } = params;

    let readinessLevel: 'weak' | 'developing' | 'ready' | 'strong' = 'strong';
    if (masteryScore < 50) readinessLevel = 'weak';
    else if (masteryScore < 70) readinessLevel = 'developing';
    else if (masteryScore < 85) readinessLevel = 'ready';

    let priority: 'critical' | 'high' | 'medium' | 'low' = 'low';
    const reasons: string[] = [];

    if (gapSeverity === 'critical') {
      priority = 'critical';
      reasons.push('active critical learning gap');
    } else if (gapSeverity === 'high') {
      priority = 'high';
      reasons.push('active high-priority gap');
    }

    if (masteryScore < 50) {
      if ((priority as any) !== 'critical') priority = 'high';
      reasons.push(`mastery is low (${masteryScore}%)`);
    } else if (masteryScore < 70 && (priority as any) !== 'critical' && (priority as any) !== 'high') {
      priority = 'medium';
      reasons.push(`mastery is developing (${masteryScore}%)`);
    }

    if (recentMistakesCount > 0) {
      if (priority !== 'critical') priority = 'high';
      reasons.push(`${recentMistakesCount} recent unreviewed mistake(s)`);
    }

    if (confidenceScore < 0.5) {
      reasons.push('low self-reported confidence');
    }

    if (daysRemaining <= 6 && (priority as any) !== 'low') {
      priority = 'critical';
      reasons.push(`exam is in ${daysRemaining} day(s) (critical mode)`);
    } else if (daysRemaining <= 14 && (priority as any) === 'medium') {
      priority = 'high';
      reasons.push(`exam is in ${daysRemaining} day(s)`);
    }

    if (reasons.length === 0) {
      reasons.push('on track for exam target score');
    }

    const priorityLabel = priority.toUpperCase();
    const reason = `${priorityLabel} priority because ${reasons.join(', ')}.`;

    return { priority, readinessLevel, reason };
  }
}
