import {
  IMentorDailyPlan,
  IMentorSuccessScoreBreakdown,
  IMentorTask,
  StudentMentorSnapshot,
} from './types.js';

export function evaluateDeterministicDailySuccessScore(
  snapshot: StudentMentorSnapshot
): IMentorSuccessScoreBreakdown {
  // 1. Planned Tasks Completed (Max 30)
  const totalTasks = snapshot.studyPlanProgress.totalTasks || 1;
  const completedTasks = snapshot.studyPlanProgress.completedTasks || 0;
  const plannedTasksScore = Math.min(30, Math.round((completedTasks / totalTasks) * 30));

  // 2. Practice Activity (Max 25)
  const accuracy = snapshot.practiceHistory.accuracy || 0;
  const practiceActivityScore = Math.min(25, Math.round((accuracy / 100) * 25));

  // 3. Study Minutes / Adherence (Max 20)
  const adherence = snapshot.studyPlanProgress.adherence || 0;
  const studyMinutesScore = Math.min(20, Math.round((adherence / 100) * 20));

  // 4. Goal Progress (Max 15)
  let goalAvg = 0;
  if (snapshot.activeGoals.length > 0) {
    const sum = snapshot.activeGoals.reduce((acc, g) => acc + (g.progress || 0), 0);
    goalAvg = sum / snapshot.activeGoals.length;
  } else {
    goalAvg = 50; // base default
  }
  const goalProgressScore = Math.min(15, Math.round((goalAvg / 100) * 15));

  // 5. Mistake Review & Consistency (Max 10)
  const streak = snapshot.practiceHistory.streakDays || 1;
  const mistakeCount = snapshot.recentMistakes.length;
  const mistakeReviewScore = Math.min(10, Math.min( streak * 2, 10 ) + (mistakeCount > 0 ? 3 : 5));

  const totalScore = Math.min(
    100,
    Math.max(0, plannedTasksScore + practiceActivityScore + studyMinutesScore + goalProgressScore + Math.min(10, mistakeReviewScore))
  );

  const explanation =
    `Score derived from: Study Tasks (${plannedTasksScore}/30), Practice Accuracy (${practiceActivityScore}/25), ` +
    `Schedule Adherence (${studyMinutesScore}/20), Goals Progress (${goalProgressScore}/15), and Practice Streak/Review (${Math.min(10, mistakeReviewScore)}/10).`;

  return {
    plannedTasksScore,
    practiceActivityScore,
    studyMinutesScore,
    goalProgressScore,
    mistakeReviewScore: Math.min(10, mistakeReviewScore),
    totalScore,
    explanation,
  };
}

export function generateDeterministicMentorPlan(
  snapshot: StudentMentorSnapshot
): IMentorDailyPlan {
  const candidateTasks: IMentorTask[] = [];
  const maxMinutes = snapshot.availableDailyMinutes || 45;

  // 1. Critical Risk / Recovery
  if (snapshot.riskLevel === 'critical' || snapshot.riskLevel === 'high') {
    const mainAction = snapshot.recoveryActions[0] || 'Focus on foundational concepts';
    candidateTasks.push({
      id: `task_risk_${Date.now()}_1`,
      title: 'Risk Recovery: Foundation Review',
      description: mainAction,
      category: 'coach',
      priority: 'CRITICAL',
      estimatedMinutes: 15,
      reason: `Current risk level is ${snapshot.riskLevel}. Immediate foundational review recommended.`,
      actionUrl: '/learning-coach',
    });
  }

  // 2. Critical Learning Gaps
  if (snapshot.topLearningGaps.length > 0) {
    const topGap = snapshot.topLearningGaps[0];
    candidateTasks.push({
      id: `task_gap_${Date.now()}_2`,
      title: `Resolve Gap: ${topGap.topicName}`,
      description: `Review prerequisites and complete a targeted gap resolution exercise for ${topGap.topicName}.`,
      category: 'practice',
      priority: topGap.severity === 'critical' ? 'CRITICAL' : 'HIGH',
      estimatedMinutes: 15,
      reason: `Topic ${topGap.topicName} has an active ${topGap.severity} learning gap.`,
      actionUrl: '/practice',
    });
  }

  // 3. Exam Readiness & Urgency
  if (snapshot.examStatus && snapshot.examStatus.daysRemaining <= 14) {
    const topic = snapshot.examStatus.priorityTopics[0] || snapshot.examStatus.title;
    candidateTasks.push({
      id: `task_exam_${Date.now()}_3`,
      title: `Exam Prep: ${topic}`,
      description: `Targeted revision for upcoming exam (${snapshot.examStatus.daysRemaining} days remaining).`,
      category: 'exam',
      priority: 'HIGH',
      estimatedMinutes: 15,
      reason: `Upcoming ${snapshot.examStatus.title} exam with readiness at ${snapshot.examStatus.readinessScore}%.`,
      actionUrl: '/exam-prep',
    });
  }

  // 4. Overdue / Today Study Plan Tasks
  const pendingTasks = snapshot.todayStudyPlanTasks.filter((t) => !t.completed);
  if (pendingTasks.length > 0) {
    const t = pendingTasks[0];
    candidateTasks.push({
      id: `task_plan_${Date.now()}_4`,
      title: t.title,
      description: 'Complete scheduled daily learning task from your personal study plan.',
      category: 'coach',
      priority: 'HIGH',
      estimatedMinutes: Math.min(15, t.durationMinutes || 10),
      reason: 'Scheduled task in today\'s study plan.',
      actionUrl: '/learning-coach',
    });
  }

  // 5. Mistakes Review
  if (snapshot.recentMistakes.length > 0) {
    const m = snapshot.recentMistakes[0];
    candidateTasks.push({
      id: `task_mistake_${Date.now()}_5`,
      title: `Review Mistake: ${m.concept}`,
      description: `Revisit mistake notebook to clear misconception on ${m.concept}.`,
      category: 'mistakes',
      priority: 'MEDIUM',
      estimatedMinutes: 10,
      reason: `Mistake recorded ${m.mistakeCount} times in recent practice.`,
      actionUrl: '/mistakes',
    });
  }

  // 6. Weak Mastery Topics
  const weakSubject = snapshot.subjectMastery.find((s) => s.score < 50);
  if (weakSubject) {
    candidateTasks.push({
      id: `task_mastery_${Date.now()}_6`,
      title: `Mastery Boost: ${weakSubject.subject}`,
      description: `Complete an adaptive practice set to boost mastery in ${weakSubject.subject}.`,
      category: 'practice',
      priority: 'MEDIUM',
      estimatedMinutes: 15,
      reason: `Mastery in ${weakSubject.subject} is currently at ${weakSubject.score}%.`,
      actionUrl: '/practice',
    });
  }

  // 7. Goals Progress
  if (snapshot.activeGoals.length > 0) {
    const g = snapshot.activeGoals[0];
    candidateTasks.push({
      id: `task_goal_${Date.now()}_7`,
      title: `Goal Progress: ${g.title}`,
      description: `Work towards completing your learning goal "${g.title}".`,
      category: 'goals',
      priority: 'MEDIUM',
      estimatedMinutes: 10,
      reason: `Goal progress is at ${g.progress}%. Target date: ${g.targetDate}.`,
      actionUrl: '/goals',
    });
  }

  // 8. Career Roadmap
  if (snapshot.careerRoadmap) {
    candidateTasks.push({
      id: `task_career_${Date.now()}_8`,
      title: `Career Milestone: ${snapshot.careerRoadmap.targetRole}`,
      description: `Review skill requirements and complete a milestone module for ${snapshot.careerRoadmap.targetRole}.`,
      category: 'career',
      priority: 'LOW',
      estimatedMinutes: 10,
      reason: `Career roadmap target role: ${snapshot.careerRoadmap.targetRole}.`,
      actionUrl: '/career',
    });
  }

  // 9. Scholarships
  if (snapshot.scholarshipCount > 0) {
    candidateTasks.push({
      id: `task_scholarship_${Date.now()}_9`,
      title: 'Check Scholarship Opportunities',
      description: 'Browse matched scholarships and check application deadlines.',
      category: 'scholarships',
      priority: 'LOW',
      estimatedMinutes: 5,
      reason: `${snapshot.scholarshipCount} matching scholarship opportunities available.`,
      actionUrl: '/scholarships',
    });
  }

  // 10. Achievements / General Revision
  candidateTasks.push({
    id: `task_revision_${Date.now()}_10`,
    title: 'Daily Concept Revision',
    description: 'Quick 5-minute flashcard or summary review of key concepts.',
    category: 'revision',
    priority: 'LOW',
    estimatedMinutes: 5,
    reason: 'Build long-term retention through short daily revision.',
    actionUrl: '/practice',
  });

  // Bounded daily recommendation list (never exceed maxMinutes)
  let accumulatedMinutes = 0;
  const selectedTasks: IMentorTask[] = [];

  for (const task of candidateTasks) {
    if (accumulatedMinutes + task.estimatedMinutes <= maxMinutes) {
      selectedTasks.push(task);
      accumulatedMinutes += task.estimatedMinutes;
    }
  }

  if (selectedTasks.length === 0 && candidateTasks.length > 0) {
    const fallback = { ...candidateTasks[0], estimatedMinutes: Math.min(10, maxMinutes) };
    selectedTasks.push(fallback);
    accumulatedMinutes = fallback.estimatedMinutes;
  }

  // Divide tasks into Morning, Afternoon, Evening
  const morning: IMentorTask[] = [];
  const afternoon: IMentorTask[] = [];
  const evening: IMentorTask[] = [];

  selectedTasks.forEach((t, i) => {
    if (i % 3 === 0) morning.push(t);
    else if (i % 3 === 1) afternoon.push(t);
    else evening.push(t);
  });

  return {
    morning,
    afternoon,
    evening,
    totalEstimatedMinutes: accumulatedMinutes,
    availableDailyMinutes: maxMinutes,
  };
}
