import { dataRepository } from '../../repositories/data.repository.js';
import { evaluateStudentRisk } from '../risk/engine.js';
import { TeacherCopilotStudentSnapshot } from './types.js';

export async function buildTeacherCopilotStudentSnapshot(
  studentId: string
): Promise<TeacherCopilotStudentSnapshot> {
  const user = await dataRepository.getUserById(studentId);
  const studentName = user?.name || 'Student';

  // 1. Authoritative Risk Profile
  const riskProfile = await evaluateStudentRisk(studentId);

  // 2. Authoritative Topic Masteries & Overall Mastery
  const masteries = await dataRepository.getTopicMastery(studentId);
  const overallMastery = riskProfile.metricsBreakdown.overallMastery;

  // 3. Learning Gaps
  const gaps = await dataRepository.getStudentGaps(studentId);
  const topLearningGaps = (gaps || [])
    .filter((g: any) => g.status === 'active')
    .slice(0, 5)
    .map((g: any) => ({
      topicId: String(g.topicId || g._id || 't1'),
      topicName: g.topicName || g.topic || 'Core Concept',
      severity: g.severity || 'medium',
    }));

  // 4. Repeated Mistakes / Misconceptions
  const mistakes = await dataRepository.getMistakesByStudentId(studentId);
  const repeatedMistakes = (mistakes || []).slice(0, 5).map((m: any) => ({
    questionId: String(m.questionId || m._id || 'q1'),
    topicId: String(m.topicId || 't1'),
    mistakeCount: Number(m.mistakeCount || m.attempts || 1),
    concept: m.misconception || m.concept || 'Prerequisite Formula',
  }));

  // 5. Practice Performance
  const practiceSessions = await dataRepository.getPracticeSessions(studentId);
  let totalAttempted = 0;
  let totalCorrect = 0;
  if (Array.isArray(practiceSessions)) {
    practiceSessions.forEach((s: any) => {
      totalAttempted += Number(s.totalQuestions || s.completedQuestions || 0);
      totalCorrect += Number(s.correctAnswers || s.score || 0);
    });
  }

  // 6. Study Plan & Adherence
  const studyPlan = await dataRepository.getStudyPlan(studentId);
  const dailyTasks = studyPlan?.dailyTasks || [];
  const completedTasks = dailyTasks.filter((t: any) => t.completed).length;

  // 7. Goals
  const goals = await dataRepository.getStudentGoals(studentId);
  const activeGoals = (goals || []).filter((g: any) => g.status === 'active').length;
  const completedGoals = (goals || []).filter((g: any) => g.status === 'completed').length;

  // 8. Exam Readiness
  const exams = await dataRepository.getExamPreparations(studentId);
  const topExam = exams?.[0];
  const examReadiness = topExam ? Number(topExam.readinessScore || 50) : undefined;

  // 9. Career Skill Progress
  const careers = await dataRepository.getCareerGoals(studentId);
  const career = careers?.[0];
  const careerSkillProgress = career ? Number(career.readinessScore || 50) : undefined;

  // Strengths & Attention Areas
  const strengths: string[] = [];
  const areasRequiringAttention: string[] = [];

  masteries.forEach((m: any) => {
    const score = Number(m.masteryScore || 0);
    const tName = m.topicName || m.topicId || 'Topic';
    if (score >= 75) strengths.push(`${tName} (${score}%)`);
    else if (score < 45) areasRequiringAttention.push(`${tName} (${score}%)`);
  });

  if (strengths.length === 0) strengths.push('Active Practice Engagement');
  if (areasRequiringAttention.length === 0) areasRequiringAttention.push('Maintaining Study Plan Consistency');

  return {
    studentId,
    studentName,
    overallMastery,
    riskLevel: riskProfile.riskLevel,
    riskTrend: riskProfile.riskTrend,
    riskReasons: riskProfile.contributingFactors,
    practiceAccuracy: riskProfile.metricsBreakdown.practiceAccuracy,
    studyConsistency: riskProfile.metricsBreakdown.planAdherencePercentage,
    examReadiness,
    careerSkillProgress,
    topLearningGaps,
    repeatedMistakes,
    recentPracticePerformance: {
      totalSessions: practiceSessions.length,
      questionsAttempted: totalAttempted,
      accuracy: riskProfile.metricsBreakdown.practiceAccuracy,
    },
    studyPlanProgress: {
      completedTasks,
      totalTasks: dailyTasks.length,
      adherence: riskProfile.metricsBreakdown.planAdherencePercentage,
    },
    goalProgress: {
      activeGoals,
      completedGoals,
    },
    strengths,
    areasRequiringAttention,
    evaluatedAt: new Date().toISOString(),
  };
}
