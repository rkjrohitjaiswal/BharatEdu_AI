import { dataRepository } from '../../repositories/data.repository.js';
import { evaluateStudentRisk } from '../risk/engine.js';
import { StudentMentorSnapshot } from './types.js';

export async function buildStudentMentorSnapshot(
  studentId: string
): Promise<StudentMentorSnapshot> {
  const user = await dataRepository.getUserById(studentId);
  const studentName = user?.name || 'Student';
  const preferredLanguage = user?.preferredLanguage || 'english';

  // 1. Authoritative Risk Profile (Feature 13)
  const riskProfile = await evaluateStudentRisk(studentId);

  // 2. Authoritative Masteries
  const masteries = await dataRepository.getTopicMastery(studentId);
  const overallMastery = riskProfile.metricsBreakdown.overallMastery;
  const subjectMap = new Map<string, { totalScore: number; count: number }>();

  masteries.forEach((m: any) => {
    const subj = m.subject || m.subjectId || 'General';
    const score = Number(m.masteryScore || 0);
    const existing = subjectMap.get(subj) || { totalScore: 0, count: 0 };
    subjectMap.set(subj, { totalScore: existing.totalScore + score, count: existing.count + 1 });
  });

  const subjectMastery: Array<{ subject: string; score: number }> = [];
  subjectMap.forEach((val, key) => {
    subjectMastery.push({ subject: key, score: Math.round(val.totalScore / val.count) });
  });
  if (subjectMastery.length === 0) {
    subjectMastery.push({ subject: 'Mathematics', score: overallMastery });
    subjectMastery.push({ subject: 'Science', score: Math.max(0, overallMastery - 5) });
  }

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

  // 4. Mistakes
  const mistakes = await dataRepository.getMistakesByStudentId(studentId);
  const recentMistakes = (mistakes || []).slice(0, 5).map((m: any) => ({
    questionId: String(m.questionId || m._id || 'q1'),
    concept: m.misconception || m.concept || 'Concept Review',
    mistakeCount: Number(m.mistakeCount || m.attempts || 1),
  }));

  // 5. Practice History
  const practiceSessions = await dataRepository.getPracticeSessions(studentId);
  let totalAttempted = 0;
  let totalCorrect = 0;
  if (Array.isArray(practiceSessions)) {
    practiceSessions.forEach((s: any) => {
      totalAttempted += Number(s.totalQuestions || s.completedQuestions || 0);
      totalCorrect += Number(s.correctAnswers || s.score || 0);
    });
  }
  const practiceHistory = {
    totalSessions: practiceSessions.length,
    questionsAttempted: totalAttempted,
    accuracy: riskProfile.metricsBreakdown.practiceAccuracy,
    streakDays: Math.min(30, Math.max(1, practiceSessions.length)),
  };

  // 6. Study Plan & Today's Tasks
  const studyPlan = await dataRepository.getStudyPlan(studentId);
  const dailyTasks = studyPlan?.dailyTasks || [];
  const completedTasks = dailyTasks.filter((t: any) => t.completed).length;
  const studyPlanProgress = {
    totalTasks: dailyTasks.length,
    completedTasks,
    adherence: riskProfile.metricsBreakdown.planAdherencePercentage,
  };
  const todayStudyPlanTasks = dailyTasks.slice(0, 5).map((t: any) => ({
    taskId: String(t.id || t._id || `task_${Math.random()}`),
    title: t.title || t.topic || 'Daily Learning Task',
    completed: Boolean(t.completed),
    durationMinutes: Number(t.durationMinutes || t.estimatedMinutes || 15),
  }));

  // 7. Learning Coach Recommendations
  const coachRecommendations: Array<{ category: string; text: string; timeMinutes: number }> = [
    {
      category: 'Practice',
      text: 'Complete 15 minutes of adaptive practice focusing on weak topics.',
      timeMinutes: 15,
    },
  ];

  // 8. Active Goals
  const goals = await dataRepository.getStudentGoals(studentId);
  const activeGoals = (goals || []).slice(0, 3).map((g: any) => ({
    goalId: String(g._id || g.id || `goal_${Math.random()}`),
    title: g.title || 'Academic Progress Goal',
    progress: Number(g.progressPercentage || g.progress || 50),
    targetDate: g.targetDate ? new Date(g.targetDate).toISOString().split('T')[0] : '2026-12-31',
  }));

  // 9. Achievements
  const achievements = await dataRepository.getStudentAchievements(studentId);
  const achievementsCount = achievements.length;

  // 10. Exam Preparation Status
  const exams = await dataRepository.getExamPreparations(studentId);
  const topExam = exams?.[0];
  const examStatus = topExam
    ? {
        title: topExam.examName || topExam.title || 'Upcoming Assessment',
        readinessScore: Number(topExam.readinessScore || 50),
        daysRemaining: Math.max(
          0,
          Math.ceil((new Date(topExam.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        ),
        priorityTopics: Array.isArray(topExam.topics) ? topExam.topics.slice(0, 3) : ['Mathematics', 'Science'],
      }
    : undefined;

  // 11. Career Roadmap Status
  let careerRoadmap: { targetRole: string; progressPercent: number } | undefined = undefined;
  const careerGoals = await dataRepository.getCareerGoals(studentId);
  if (careerGoals && careerGoals.length > 0) {
    const career = careerGoals[0];
    careerRoadmap = {
      targetRole: career.targetRole || career.roleTitle || 'Software Engineer',
      progressPercent: Number(career.overallProgress || 35),
    };
  }

  // 12. Scholarships & Notifications
  const scholarships = await dataRepository.getScholarships();
  const scholarshipCount = (scholarships || []).length;

  const notifications = await dataRepository.getNotifications({ recipientUserId: studentId });
  const unreadNotificationCount = (notifications || []).filter((n: any) => !n.read).length;

  const recoveryActions = (riskProfile.recommendedActions || []).map(
    (a: any) => a.description || a.title || 'Review foundational concepts'
  );

  return {
    studentId,
    studentName,
    preferredLanguage,
    overallMastery,
    subjectMastery,
    topLearningGaps,
    recentMistakes,
    practiceHistory,
    studyPlanProgress,
    todayStudyPlanTasks,
    coachRecommendations,
    activeGoals,
    achievementsCount,
    examStatus,
    riskLevel: riskProfile.riskLevel,
    riskFactors: riskProfile.contributingFactors,
    recoveryActions: recoveryActions.length > 0 ? recoveryActions : ['Review foundational concepts'],
    careerRoadmap,
    scholarshipCount,
    unreadNotificationCount,
    availableDailyMinutes: 45,
    evaluatedAt: new Date().toISOString(),
  };
}
