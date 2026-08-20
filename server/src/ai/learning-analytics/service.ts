import { generateAILearningAnalyticsAdvice } from './ai-coach.js';
import { buildStudentLearningAnalytics } from './engine.js';

export async function getLearningAnalyticsOverview(studentId: string) {
  const analytics = await buildStudentLearningAnalytics(studentId);
  return {
    studentId: analytics.studentId,
    studentName: analytics.studentName,
    overallProgress: analytics.overallProgress,
    consistency: analytics.consistency,
    riskAnalytics: analytics.riskAnalytics,
    evaluatedAt: analytics.evaluatedAt,
  };
}

export async function getLearningAnalyticsSubjects(studentId: string) {
  const analytics = await buildStudentLearningAnalytics(studentId);
  return {
    studentId: analytics.studentId,
    subjects: analytics.subjectAnalytics,
    evaluatedAt: analytics.evaluatedAt,
  };
}

export async function getLearningAnalyticsTopics(studentId: string) {
  const analytics = await buildStudentLearningAnalytics(studentId);
  return {
    studentId: analytics.studentId,
    topics: analytics.topicAnalytics,
    evaluatedAt: analytics.evaluatedAt,
  };
}

export async function getLearningAnalyticsPractice(studentId: string) {
  const analytics = await buildStudentLearningAnalytics(studentId);
  return {
    studentId: analytics.studentId,
    practice: analytics.practiceAnalytics,
    evaluatedAt: analytics.evaluatedAt,
  };
}

export async function getLearningAnalyticsWeekly(studentId: string) {
  const analytics = await buildStudentLearningAnalytics(studentId);
  return {
    studentId: analytics.studentId,
    weeklyReport: analytics.weeklyReport,
    learningGapProgress: analytics.learningGapProgress,
    goalAnalytics: analytics.goalAnalytics,
    examReadinessTrend: analytics.examReadinessTrend,
    evaluatedAt: analytics.evaluatedAt,
  };
}

export async function getLearningAnalyticsAdvice(studentId: string) {
  const analytics = await buildStudentLearningAnalytics(studentId);
  const topWin = analytics.weeklyReport.wins[0];
  const topAttentionArea = analytics.weeklyReport.areasNeedingAttention[0];

  return await generateAILearningAnalyticsAdvice(
    analytics.studentName,
    analytics.overallProgress.currentMastery,
    analytics.overallProgress.masteryTrend,
    analytics.overallProgress.practiceAccuracy,
    analytics.overallProgress.currentStreak,
    topWin,
    topAttentionArea
  );
}

export async function getLearningAnalyticsSummary(studentId: string) {
  const analytics = await buildStudentLearningAnalytics(studentId);
  const advice = await getLearningAnalyticsAdvice(studentId);

  return {
    studentName: analytics.studentName,
    currentMastery: analytics.overallProgress.currentMastery,
    masteryTrend: analytics.overallProgress.masteryTrend,
    accuracy: analytics.overallProgress.practiceAccuracy,
    streakDays: analytics.overallProgress.currentStreak,
    consistencyScore: analytics.consistency.consistencyScore,
    consistencyLevel: analytics.consistency.consistencyLevel,
    topPriorityTopic: analytics.topicAnalytics[0]?.topicName || 'Daily Concept Practice',
    summaryMessage: advice.naturalLanguageSummary,
    evaluatedAt: analytics.evaluatedAt,
  };
}
