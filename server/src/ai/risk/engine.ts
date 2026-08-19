import { dataRepository } from '../../repositories/data.repository.js';
import { generateParentRiskSummary, generateStudentRiskExplanation, generateTeacherRiskClassSummary } from './ai-explainer.js';
import {
  IRiskRecoveryAction,
  ParentSafeRiskSummaryData,
  RiskLevel,
  RiskTrend,
  StudentRiskProfileData,
  TeacherAtRiskAnalyticsData,
} from './types.js';

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export async function evaluateStudentRisk(studentId: string): Promise<StudentRiskProfileData> {
  const user = await dataRepository.getUserById(studentId);
  const studentName = user?.name || 'Student';

  // 1. Topic Masteries
  const masteries = await dataRepository.getTopicMastery(studentId);
  const masteryScores = masteries.map((m: any) => Number(m.masteryScore || 0));
  const overallMastery = masteryScores.length
    ? clamp(masteryScores.reduce((a: number, b: number) => a + b, 0) / masteryScores.length)
    : 0;

  // 2. Practice Accuracy & Sessions
  const practiceSessions = await dataRepository.getPracticeSessions(studentId);
  let totalAttempted = 0;
  let totalCorrect = 0;
  if (Array.isArray(practiceSessions)) {
    practiceSessions.forEach((s: any) => {
      totalAttempted += Number(s.totalQuestions || s.completedQuestions || 0);
      totalCorrect += Number(s.correctAnswers || s.score || 0);
    });
  }
  const practiceAccuracy = totalAttempted ? clamp((totalCorrect / totalAttempted) * 100) : 0;

  // 3. Learning Gaps
  const gaps = await dataRepository.getStudentGaps(studentId);
  const activeGaps = (gaps || []).filter((g: any) => g.status === 'active');
  const criticalGaps = (gaps || []).filter(
    (g: any) => g.status === 'active' && (g.severity === 'critical' || g.severity === 'high')
  );

  // 4. Mistakes
  const mistakes = await dataRepository.getMistakesByStudentId(studentId);
  const unreviewedMistakes = (mistakes || []).filter((m: any) => !m.reviewed);

  // 5. Study Plan Adherence
  const studyPlan = await dataRepository.getStudyPlan(studentId);
  const dailyTasks = studyPlan?.dailyTasks || [];
  const completedTasks = dailyTasks.filter((t: any) => t.completed).length;
  const totalTasks = dailyTasks.length;
  const planAdherencePercentage = totalTasks ? clamp((completedTasks / totalTasks) * 100) : 100;

  // 6. Upcoming Exams
  const exams = await dataRepository.getExamPreparations(studentId);
  const upcomingExams = (exams || []).filter((e: any) => {
    const daysLeft = Math.ceil((new Date(e.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft >= 0 && daysLeft <= 14;
  });

  // --- DETERMINISTIC RISK SCORE CALCULATOR (0 TO 100) ---
  const masteryRisk = (100 - overallMastery) * 0.35;
  const accuracyRisk = (100 - (practiceAccuracy || overallMastery)) * 0.25;
  const gapRisk = Math.min(25, activeGaps.length * 5 + criticalGaps.length * 10);
  const mistakeRisk = Math.min(15, unreviewedMistakes.length * 3);
  const adherenceRisk = (100 - planAdherencePercentage) * 0.15;

  const rawScore = masteryRisk + accuracyRisk + gapRisk + mistakeRisk + adherenceRisk;
  const riskScore = clamp(rawScore);

  // Risk Level Mapping
  let riskLevel: RiskLevel = 'low';
  if (riskScore >= 75 || criticalGaps.length >= 3 || overallMastery < 25) {
    riskLevel = 'critical';
  } else if (riskScore >= 55 || criticalGaps.length >= 1 || overallMastery < 45) {
    riskLevel = 'high';
  } else if (riskScore >= 30 || activeGaps.length >= 2 || unreviewedMistakes.length >= 3) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }

  // Contributing Factors
  const contributingFactors: string[] = [];
  if (overallMastery < 45) {
    contributingFactors.push(`Overall topic mastery is low (${overallMastery}%)`);
  }
  if (practiceAccuracy > 0 && practiceAccuracy < 45) {
    contributingFactors.push(`Practice session accuracy is low (${practiceAccuracy}%)`);
  }
  if (criticalGaps.length > 0) {
    contributingFactors.push(`${criticalGaps.length} high-severity active learning gap(s)`);
  }
  if (unreviewedMistakes.length >= 3) {
    contributingFactors.push(`${unreviewedMistakes.length} unreviewed mistake(s)`);
  }
  if (totalTasks > 0 && planAdherencePercentage < 50) {
    contributingFactors.push(`Study plan adherence is below 50% (${planAdherencePercentage}%)`);
  }
  if (upcomingExams.length > 0 && overallMastery < 60) {
    contributingFactors.push(`Upcoming exam scheduled in <14 days with underdeveloped topic mastery`);
  }
  if (contributingFactors.length === 0) {
    contributingFactors.push('Consistent study activity and solid mastery levels');
  }

  // Risk Trend Calculation
  let riskTrend: RiskTrend = 'stable';
  if (overallMastery >= 75 && planAdherencePercentage >= 75) {
    riskTrend = 'improving';
  } else if (riskLevel === 'high' || riskLevel === 'critical') {
    riskTrend = 'worsening';
  }

  // Recommended Recovery Actions
  const recommendedActions: IRiskRecoveryAction[] = [];
  if (criticalGaps.length > 0) {
    recommendedActions.push({
      title: 'Targeted Gap Practice',
      description: `Complete an adaptive practice session focused on ${criticalGaps.length} high-priority gap(s).`,
      priority: 'urgent',
      actionUrl: '/practice',
    });
  }
  if (unreviewedMistakes.length > 0) {
    recommendedActions.push({
      title: 'Review Past Mistakes',
      description: `Resolve ${unreviewedMistakes.length} unreviewed mistake(s) in your mistake notebook.`,
      priority: 'high',
      actionUrl: '/mistakes',
    });
  }
  if (totalTasks > 0 && planAdherencePercentage < 60) {
    recommendedActions.push({
      title: 'Catch Up on Daily Tasks',
      description: 'Complete pending study tasks to regain learning momentum.',
      priority: 'medium',
      actionUrl: '/learning-coach',
    });
  }
  if (recommendedActions.length === 0) {
    recommendedActions.push({
      title: 'Advance Practice Challenge',
      description: 'Take an advanced adaptive challenge session to accelerate topic mastery.',
      priority: 'low',
      actionUrl: '/practice',
    });
  }

  // --- THRESHOLD-BASED NOTIFICATION INTEGRATION ---
  if (riskLevel === 'high' || riskLevel === 'critical') {
    const todayStr = new Date().toISOString().split('T')[0];
    const dedupeKey = `risk_alert_${studentId}_${riskLevel}_${todayStr}`;
    try {
      const existingNotif = await dataRepository.getNotificationByDedupeKey(studentId, dedupeKey);
      if (!existingNotif) {
        await dataRepository.createNotification({
          recipientUserId: studentId,
          recipientRole: 'student',
          type: 'risk_warning',
          title: `Academic Risk Alert: ${riskLevel.toUpperCase()}`,
          message: `Your learning risk level is currently ${riskLevel} (${riskScore}/100). Review recommended recovery actions to improve your progress.`,
          priority: riskLevel === 'critical' ? 'critical' : 'high',
          sourceType: 'learning_coach',
          actionUrl: '/analytics',
          isRead: false,
          dedupeKey,
        });
      }
    } catch (err) {}
  }

  const metricsBreakdown = {
    overallMastery,
    practiceAccuracy,
    activeGapsCount: activeGaps.length,
    criticalGapsCount: criticalGaps.length,
    unreviewedMistakesCount: unreviewedMistakes.length,
    planAdherencePercentage,
    upcomingExamsCount: upcomingExams.length,
  };

  const partialProfile = {
    studentId,
    studentName,
    riskScore,
    riskLevel,
    riskTrend,
    contributingFactors,
    recommendedActions,
    metricsBreakdown,
    evaluatedAt: new Date().toISOString(),
  };

  const aiExplanation = await generateStudentRiskExplanation(partialProfile);

  return {
    ...partialProfile,
    aiExplanation,
  };
}

export async function evaluateTeacherClassRisk(teacherId: string): Promise<TeacherAtRiskAnalyticsData> {
  const students = await dataRepository.getStudents();
  const totalStudents = students.length;

  const atRiskStudents: StudentRiskProfileData[] = [];
  let criticalCount = 0;
  let highCount = 0;

  for (const st of students) {
    const stId = String(st._id || st.id);
    const riskProfile = await evaluateStudentRisk(stId);
    if (riskProfile.riskLevel === 'critical') {
      criticalCount += 1;
      atRiskStudents.push(riskProfile);
    } else if (riskProfile.riskLevel === 'high') {
      highCount += 1;
      atRiskStudents.push(riskProfile);
    }
  }

  const atRiskCount = atRiskStudents.length;

  const partialData = {
    totalStudents,
    atRiskCount,
    criticalCount,
    highCount,
    atRiskStudents,
    evaluatedAt: new Date().toISOString(),
  };

  const classSummary = await generateTeacherRiskClassSummary(partialData);

  return {
    ...partialData,
    classSummary,
  };
}

export async function evaluateParentStudentRisk(
  parentId: string,
  studentId: string
): Promise<ParentSafeRiskSummaryData> {
  const isLinked = await dataRepository.checkParentStudentLinkActive(parentId, studentId);
  if (!isLinked) {
    throw new Error('Unauthorized parent-student access');
  }

  const user = await dataRepository.getUserById(studentId);
  const studentName = user?.name || 'Your Student';

  const riskProfile = await evaluateStudentRisk(studentId);

  const recommendedSupportActions = [
    'Encourage 20 minutes of daily adaptive practice',
    'Review active learning gaps together',
    'Help maintain a structured study routine',
  ];

  const partialData = {
    studentId,
    studentName,
    riskLevel: riskProfile.riskLevel,
    riskTrend: riskProfile.riskTrend,
    recommendedSupportActions,
    evaluatedAt: new Date().toISOString(),
  };

  const summaryText = await generateParentRiskSummary(partialData);

  return {
    ...partialData,
    summaryText,
  };
}
