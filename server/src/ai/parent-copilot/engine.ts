import { dataRepository } from '../../repositories/data.repository.js';
import { evaluateStudentRisk } from '../risk/engine.js';
import { ParentCopilotStudentSnapshot } from './types.js';

export async function buildParentCopilotStudentSnapshot(
  studentId: string
): Promise<ParentCopilotStudentSnapshot> {
  const user = await dataRepository.getUserById(studentId);
  const studentName = user?.name || 'Your Child';

  // 1. Authoritative Risk Profile (Feature 13)
  const riskProfile = await evaluateStudentRisk(studentId);

  // 2. Authoritative Masteries
  const masteries = await dataRepository.getTopicMastery(studentId);
  const overallMastery = riskProfile.metricsBreakdown.overallMastery;

  // 3. Learning Gaps
  const gaps = await dataRepository.getStudentGaps(studentId);
  const topLearningGaps = (gaps || [])
    .filter((g: any) => g.status === 'active')
    .slice(0, 5)
    .map((g: any) => ({
      topicId: String(g.topicId || g._id || 't1'),
      topicName: g.topicName || g.topic || 'Core Topic',
      severity: g.severity || 'medium',
    }));

  // 4. Repeated Mistakes
  const mistakes = await dataRepository.getMistakesByStudentId(studentId);
  const repeatedMistakes = (mistakes || []).slice(0, 5).map((m: any) => ({
    questionId: String(m.questionId || m._id || 'q1'),
    topicId: String(m.topicId || 't1'),
    mistakeCount: Number(m.mistakeCount || m.attempts || 1),
    concept: m.misconception || m.concept || 'Foundational Step',
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

  // 6. Study Plan
  const studyPlan = await dataRepository.getStudyPlan(studentId);
  const dailyTasks = studyPlan?.dailyTasks || [];
  const completedTasks = dailyTasks.filter((t: any) => t.completed).length;

  // 7. Goals & Achievements
  const goals = await dataRepository.getStudentGoals(studentId);
  const activeGoals = (goals || []).filter((g: any) => g.status === 'active').length;
  const completedGoals = (goals || []).filter((g: any) => g.status === 'completed').length;

  const achievementsData = await dataRepository.getStudentAchievements(studentId);
  const achievements = (achievementsData || []).slice(0, 5).map((a: any) => ({
    title: a.title || a.name || 'Learning Milestone',
    category: a.category || 'Academic Effort',
  }));

  // 8. Exam Readiness
  const exams = await dataRepository.getExamPreparations(studentId);
  const topExam = exams?.[0];
  const examReadiness = topExam ? Number(topExam.readinessScore || 50) : undefined;
  const examCountdownDays = topExam
    ? Math.max(0, Math.ceil((new Date(topExam.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : undefined;

  // 9. Teacher Interventions (Parent-Safe: Excludes private notes)
  const interventions = await dataRepository.getStudentInterventions(studentId);
  const teacherInterventions = (interventions || []).slice(0, 5).map((i: any) => ({
    topic: i.topicName || i.topicId || 'Academic Support',
    priority: i.priority || 'medium',
    dueDate: i.dueDate ? new Date(i.dueDate).toISOString().split('T')[0] : undefined,
    isCompleted: i.status === 'completed',
  }));

  // 10. Scholarships Summary
  const scholarshipsData = await dataRepository.getScholarships();
  const scholarships = (scholarshipsData || []).slice(0, 3).map((s: any) => ({
    title: s.title || s.name || 'Educational Grant Opportunity',
    status: 'Available',
    url: s.officialLink || '/scholarships',
  }));

  // Strengths & Attention Areas
  const strengths: string[] = [];
  const areasRequiringAttention: string[] = [];

  masteries.forEach((m: any) => {
    const score = Number(m.masteryScore || 0);
    const tName = m.topicName || m.topicId || 'Topic';
    if (score >= 75) strengths.push(`${tName} (${score}%)`);
    else if (score < 45) areasRequiringAttention.push(`${tName} (${score}%)`);
  });

  if (strengths.length === 0) strengths.push('Active Practice Participation');
  if (areasRequiringAttention.length === 0) areasRequiringAttention.push('Building Daily Study Routine');

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
    examCountdownDays,
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
    achievements,
    teacherInterventions,
    scholarships,
    strengths,
    areasRequiringAttention,
    evaluatedAt: new Date().toISOString(),
  };
}
