import {
  ConsistencyLevelType,
  ConsistencyScoreData,
  ProgressTrendType,
  SubjectAnalyticsData,
  SubjectStatusType,
  TopicAnalyticsData,
  WeeklyLearningReportData,
} from './types.js';

export function classifyProgressTrend(
  current: number,
  previous: number | null,
  minDifference: number = 3
): ProgressTrendType {
  if (previous === null || previous === undefined) {
    return 'insufficient_data';
  }
  const diff = current - previous;
  if (diff >= minDifference) return 'improving';
  if (diff <= -minDifference) return 'declining';
  return 'stable';
}

export function classifySubjectStatus(
  mastery: number,
  trend: ProgressTrendType,
  gapsCount: number
): SubjectStatusType {
  if (mastery === 0 && gapsCount === 0 && trend === 'insufficient_data') {
    return 'insufficient_data';
  }
  if (gapsCount > 0 && (mastery < 45 || trend === 'declining')) {
    return 'critical';
  }
  if (mastery < 60 || gapsCount > 0) {
    return 'needs_attention';
  }
  if (trend === 'improving' || mastery >= 75) {
    return 'strong';
  }
  return 'improving';
}

export function calculateDeterministicConsistencyScore(
  practiceDays: number, // out of last 7
  planAdherence: number, // 0-100
  studyMinutes: number, // total minutes
  streakDays: number
): ConsistencyScoreData {
  if (practiceDays === 0 && studyMinutes === 0 && planAdherence === 0) {
    return {
      consistencyScore: 0,
      consistencyLevel: 'insufficient_data',
      contributingFactors: ['No recent study or practice activity recorded yet.'],
    };
  }

  // 1. Practice Days (max 35)
  const daysScore = Math.min(35, Math.round((practiceDays / 7) * 35));

  // 2. Schedule Adherence (max 35)
  const adherenceScore = Math.min(35, Math.round((planAdherence / 100) * 35));

  // 3. Streak (max 15)
  const streakScore = Math.min(15, streakDays * 3);

  // 4. Study Volume (max 15)
  const volumeScore = Math.min(15, Math.round((studyMinutes / 120) * 15));

  const totalScore = Math.min(100, Math.max(0, daysScore + adherenceScore + streakScore + volumeScore));

  let level: ConsistencyLevelType = 'needs_improvement';
  if (totalScore >= 80) level = 'excellent';
  else if (totalScore >= 65) level = 'good';
  else if (totalScore >= 45) level = 'moderate';
  else level = 'needs_improvement';

  const factors: string[] = [];
  factors.push(`Practiced on ${practiceDays} of the last 7 days (${daysScore}/35 pts).`);
  factors.push(`Study plan adherence is ${planAdherence}% (${adherenceScore}/35 pts).`);
  factors.push(`Active streak of ${streakDays} days (${streakScore}/15 pts).`);

  return {
    consistencyScore: totalScore,
    consistencyLevel: level,
    contributingFactors: factors,
  };
}

export function prioritizeTopicAnalytics(topics: TopicAnalyticsData[]): TopicAnalyticsData[] {
  return [...topics].sort((a, b) => {
    // 1. Gap Severity (critical > high > medium > none)
    const severityMap: Record<string, number> = { critical: 4, high: 3, medium: 2, none: 1 };
    const sevA = severityMap[a.gapSeverity] || 1;
    const sevB = severityMap[b.gapSeverity] || 1;
    if (sevA !== sevB) return sevB - sevA;

    // 2. Declining Trend
    if (a.masteryTrend === 'declining' && b.masteryTrend !== 'declining') return -1;
    if (b.masteryTrend === 'declining' && a.masteryTrend !== 'declining') return 1;

    // 3. Low Mastery
    if (a.mastery !== b.mastery) return a.mastery - b.mastery;

    // 4. Mistake Count
    return b.mistakeCount - a.mistakeCount;
  });
}

export function buildWeeklyLearningReport(
  overallTrend: ProgressTrendType,
  questionsSolved: number,
  accuracy: number,
  studyMinutes: number,
  planCompletion: number,
  streakDays: number,
  subjects: SubjectAnalyticsData[],
  topics: TopicAnalyticsData[]
): WeeklyLearningReportData {
  const wins: string[] = [];
  const areasNeedingAttention: string[] = [];
  const nextWeekPriorities: string[] = [];

  if (streakDays >= 3) {
    wins.push(`Maintained a consistent ${streakDays}-day practice streak!`);
  }
  if (accuracy >= 70) {
    wins.push(`Achieved a solid ${accuracy}% practice accuracy this week.`);
  }

  const strongSubj = subjects.find((s) => s.status === 'strong');
  if (strongSubj) {
    wins.push(`Strong performance in ${strongSubj.subject} (${strongSubj.mastery}% mastery).`);
  }
  if (wins.length === 0) {
    wins.push('Active participation and baseline progress recorded.');
  }

  const weakSubj = subjects.find((s) => s.status === 'critical' || s.status === 'needs_attention');
  if (weakSubj) {
    areasNeedingAttention.push(`${weakSubj.subject} requires targeted revision (${weakSubj.mastery}% mastery).`);
  }
  const topGapTopic = topics.find((t) => t.gapSeverity === 'critical' || t.gapSeverity === 'high');
  if (topGapTopic) {
    areasNeedingAttention.push(`Concept gap identified in ${topGapTopic.topicName}.`);
  }
  if (areasNeedingAttention.length === 0) {
    areasNeedingAttention.push('Maintain steady daily study routine to keep momentum.');
  }

  if (topGapTopic) {
    nextWeekPriorities.push(`Resolve active gap in ${topGapTopic.topicName}.`);
  }
  if (weakSubj) {
    nextWeekPriorities.push(`Complete 2 adaptive practice sets on ${weakSubj.subject}.`);
  }
  nextWeekPriorities.push('Maintain 15 minutes of daily practice to sustain learning streak.');

  return {
    overallProgressTrend: overallTrend,
    questionsSolved,
    accuracy,
    studyMinutes,
    planCompletionPercentage: planCompletion,
    currentStreak: streakDays,
    wins,
    areasNeedingAttention,
    nextWeekPriorities,
  };
}
