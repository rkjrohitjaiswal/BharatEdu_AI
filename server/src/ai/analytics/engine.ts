import { dataRepository } from '../../repositories/data.repository.js';
import { generateParentProgressSummary, generateStudentWeeklySummary, generateTeacherClassSummary } from './ai-summarizer.js';
import {
  ParentSafeProgressSummary,
  RiskLevel,
  StudentAnalyticsOverview,
  StudentRiskProfile,
  SubjectMasteryBreakdown,
  TeacherClassAnalytics,
  TopicMasteryBreakdown,
} from './types.js';

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export async function buildStudentAnalytics(studentId: string): Promise<StudentAnalyticsOverview> {
  // 1. Topic & Subject Masteries
  const masteries = await dataRepository.getTopicMastery(studentId);
  const masteryScores = masteries.map((m: any) => Number(m.masteryScore || 0));
  const overallMastery = masteryScores.length
    ? clamp(masteryScores.reduce((a: number, b: number) => a + b, 0) / masteryScores.length)
    : 0;

  const topicMastery: TopicMasteryBreakdown[] = masteries.map((m: any) => ({
    topicId: String(m.topicId?._id || m.topicId || m.id),
    topicName: String(m.topicId?.name || m.topicName || m.topicId || 'Topic'),
    score: clamp(Number(m.masteryScore || 0)),
    status: m.masteryScore >= 80 ? 'strong' : m.masteryScore >= 60 ? 'developing' : 'needs_work',
  }));

  // Group by subjects
  const subjectsMap = new Map<string, { totalScore: number; count: number; name: string }>();
  masteries.forEach((m: any) => {
    const subjName = String(m.subjectId?.name || m.subjectName || m.subjectId || 'General Subject');
    const subjId = String(m.subjectId?._id || m.subjectId || subjName);
    const existing = subjectsMap.get(subjId) || { totalScore: 0, count: 0, name: subjName };
    existing.totalScore += Number(m.masteryScore || 0);
    existing.count += 1;
    subjectsMap.set(subjId, existing);
  });

  const subjectMastery: SubjectMasteryBreakdown[] = Array.from(subjectsMap.entries()).map(
    ([subjId, val]) => {
      const avg = clamp(val.totalScore / (val.count || 1));
      return {
        subjectId: subjId,
        subjectName: val.name,
        score: avg,
        trend: avg >= 70 ? 'improving' : avg >= 50 ? 'stable' : 'declining',
      };
    }
  );

  // 2. Practice Accuracy & Sessions
  const practiceSessions = await dataRepository.getPracticeSessions(studentId);
  let totalCorrect = 0;
  let totalAttempted = 0;
  let totalMinutes = 0;

  if (Array.isArray(practiceSessions)) {
    practiceSessions.forEach((s: any) => {
      totalAttempted += Number(s.totalQuestions || s.completedQuestions || 0);
      totalCorrect += Number(s.correctAnswers || s.score || 0);
      if (s.timeSpentSeconds) {
        totalMinutes += Math.round(Number(s.timeSpentSeconds) / 60);
      }
    });
  }

  const practiceAccuracy = totalAttempted ? clamp((totalCorrect / totalAttempted) * 100) : 0;

  // 3. Learning Gaps
  const gaps = await dataRepository.getStudentGaps(studentId);
  const activeGaps = (gaps || []).filter((g: any) => g.status === 'active');
  const resolvedGaps = (gaps || []).filter((g: any) => g.status === 'resolved');
  const criticalGaps = (gaps || []).filter(
    (g: any) => g.status === 'active' && (g.severity === 'critical' || g.severity === 'high')
  );
  const gapTotal = (gaps || []).length;
  const resolutionRate = gapTotal ? clamp((resolvedGaps.length / gapTotal) * 100) : 100;

  // 4. Study Plan Adherence
  const studyPlan = await dataRepository.getStudyPlan(studentId);
  const dailyTasks = studyPlan?.dailyTasks || [];
  const completedTasks = dailyTasks.filter((t: any) => t.completed).length;
  const totalTasks = dailyTasks.length;
  const adherencePercentage = totalTasks ? clamp((completedTasks / totalTasks) * 100) : 0;

  // 5. Goals & Achievements
  const goals = await dataRepository.getStudentGoals(studentId);
  const completedGoals = (goals || []).filter((g: any) => g.status === 'completed').length;
  const activeGoals = (goals || []).filter((g: any) => g.status === 'active').length;
  const achievements = await dataRepository.getStudentAchievements(studentId);
  const unlockedAchievements = (achievements || []).filter((a: any) => a.unlocked || a.unlockedAt).length;

  // 6. Exam Readiness Progression
  const exams = await dataRepository.getExamPreparations(studentId);
  const examReadinessProgression = (exams || []).map((exam: any) => {
    const examDate = new Date(exam.examDate);
    const daysLeft = Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    // Simple deterministic score calculation for analytics overview
    const readinessScore = clamp(overallMastery * 0.6 + practiceAccuracy * 0.4);
    return {
      examId: String(exam._id || exam.id),
      title: exam.title,
      daysLeft,
      readinessScore,
      readinessLevel: readinessScore >= 75 ? 'ready' : readinessScore >= 50 ? 'developing' : 'needs_work',
    };
  });

  // 7. Career Skill Progression
  const careerGoals = await dataRepository.getCareerGoals(studentId);
  const careerSkillProgression = (careerGoals || []).map((cg: any) => ({
    goalId: String(cg._id || cg.id),
    targetRole: cg.targetRole,
    readiness: clamp(overallMastery * 0.8),
    topSkill: 'Core Competency',
    topSkillScore: clamp(overallMastery),
  }));

  // 8. Deterministic Early-Warning / Risk Indicators Engine
  const riskFactors: string[] = [];
  let riskLevel: RiskLevel = 'low';

  if (overallMastery < 35) {
    riskFactors.push(`Overall topic mastery is critically low (${overallMastery}%)`);
  }
  if (criticalGaps.length >= 2) {
    riskFactors.push(`${criticalGaps.length} active high-severity learning gap(s) detected`);
  }
  if (practiceAccuracy > 0 && practiceAccuracy < 40) {
    riskFactors.push(`Practice accuracy is low (${practiceAccuracy}%)`);
  }

  const upcomingCriticalExam = examReadinessProgression.find(
    (e) => e.daysLeft <= 7 && e.readinessScore < 50
  );
  if (upcomingCriticalExam) {
    riskFactors.push(`Upcoming exam "${upcomingCriticalExam.title}" in ${upcomingCriticalExam.daysLeft} day(s) with low readiness (${upcomingCriticalExam.readinessScore}%)`);
  }

  if (overallMastery < 35 || criticalGaps.length >= 3 || (upcomingCriticalExam && upcomingCriticalExam.daysLeft <= 3)) {
    riskLevel = 'critical';
  } else if (overallMastery < 50 || criticalGaps.length >= 1 || practiceAccuracy < 45 || upcomingCriticalExam) {
    riskLevel = 'high';
  } else if (overallMastery < 70 || activeGaps.length >= 2 || (totalTasks > 0 && adherencePercentage < 50)) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }

  const partialAnalytics = {
    overallMastery,
    masteryTrend: overallMastery >= 70 ? ('improving' as const) : overallMastery >= 50 ? ('stable' as const) : ('declining' as const),
    subjectMastery,
    topicMastery,
    practiceAccuracy,
    totalPracticeSessions: (practiceSessions || []).length,
    totalQuestionsAttempted: totalAttempted,
    studyTimeMinutes: totalMinutes,
    learningGaps: {
      total: gapTotal,
      active: activeGaps.length,
      resolved: resolvedGaps.length,
      critical: criticalGaps.length,
      resolutionRate,
    },
    studyPlanAdherence: {
      completedTasks,
      totalTasks,
      adherencePercentage,
    },
    goalsAndAchievements: {
      totalGoals: (goals || []).length,
      completedGoals,
      activeGoals,
      unlockedAchievements,
    },
    examReadinessProgression,
    careerSkillProgression,
    riskIndicators: {
      riskLevel,
      riskFactors,
    },
    generatedAt: new Date().toISOString(),
  };

  const weeklySummary = await generateStudentWeeklySummary(partialAnalytics);

  return {
    ...partialAnalytics,
    weeklySummary,
  };
}

export async function buildTeacherClassAnalytics(teacherId: string): Promise<TeacherClassAnalytics> {
  const students = await dataRepository.getStudents();
  const totalStudents = students.length;

  let totalMasterySum = 0;
  let totalAccuracySum = 0;
  const strugglingStudents: StudentRiskProfile[] = [];
  const improvingStudents: Array<{ studentId: string; name: string; mastery: number; change: number }> = [];

  for (const st of students) {
    const stId = String(st._id || st.id);
    const stAnalytics = await buildStudentAnalytics(stId);
    totalMasterySum += stAnalytics.overallMastery;
    totalAccuracySum += stAnalytics.practiceAccuracy;

    if (stAnalytics.riskIndicators.riskLevel === 'high' || stAnalytics.riskIndicators.riskLevel === 'critical') {
      strugglingStudents.push({
        studentId: stId,
        name: st.name || 'Student',
        mastery: stAnalytics.overallMastery,
        riskLevel: stAnalytics.riskIndicators.riskLevel,
        riskFactors: stAnalytics.riskIndicators.riskFactors,
      });
    } else {
      improvingStudents.push({
        studentId: stId,
        name: st.name || 'Student',
        mastery: stAnalytics.overallMastery,
        change: +5,
      });
    }
  }

  const averageMastery = totalStudents ? clamp(totalMasterySum / totalStudents) : 0;
  const averageAccuracy = totalStudents ? clamp(totalAccuracySum / totalStudents) : 0;

  // Teacher intervention effectiveness
  const interventions = await dataRepository.getTeacherInterventions(teacherId);
  const completed = (interventions || []).filter((i: any) => i.status === 'completed').length;
  const totalAssigned = (interventions || []).length;
  const effectivenessRate = totalAssigned ? clamp((completed / totalAssigned) * 100) : 100;

  const partialAnalytics = {
    totalStudents,
    averageMastery,
    averageAccuracy,
    improvingStudents,
    strugglingStudents,
    interventionEffectiveness: {
      totalAssigned,
      completed,
      effectivenessRate,
    },
    generatedAt: new Date().toISOString(),
  };

  const weeklySummary = await generateTeacherClassSummary(partialAnalytics);

  return {
    ...partialAnalytics,
    weeklySummary,
  };
}

export async function buildParentProgressSummary(
  parentId: string,
  studentId: string
): Promise<ParentSafeProgressSummary> {
  // Authorization check: verify parent is linked to studentId
  const isLinked = await dataRepository.checkParentStudentLinkActive(parentId, studentId);
  if (!isLinked) {
    throw new Error('Unauthorized parent-student access');
  }

  const student = await dataRepository.getUserById(studentId);
  const studentName = student?.name || 'Your Student';

  const analytics = await buildStudentAnalytics(studentId);

  const highlights = [
    `Overall topic mastery: ${analytics.overallMastery}%`,
    `Practice accuracy: ${analytics.practiceAccuracy}%`,
    `Completed ${analytics.goalsAndAchievements.completedGoals} learning goal(s)`,
    `Unlocked ${analytics.goalsAndAchievements.unlockedAchievements} achievement badge(s)`,
  ];

  const partialSummary = {
    studentId,
    studentName,
    overallMastery: analytics.overallMastery,
    studyTimeMinutes: analytics.studyTimeMinutes,
    activeGapsCount: analytics.learningGaps.active,
    goalProgressPercentage: analytics.goalsAndAchievements.totalGoals
      ? clamp((analytics.goalsAndAchievements.completedGoals / analytics.goalsAndAchievements.totalGoals) * 100)
      : 100,
    riskLevel: analytics.riskIndicators.riskLevel,
    highlights,
    generatedAt: new Date().toISOString(),
  };

  const weeklySummary = await generateParentProgressSummary(partialSummary);

  return {
    ...partialSummary,
    weeklySummary,
  };
}
