import { IDailyPlannerData, IPlannerTaskData, IWeeklyPlannerDay } from './types.js';

export function buildDeterministicDailyTasks(
  studentName: string,
  availableMinutes: number,
  context: {
    riskLevel: string;
    recoveryActions: string[];
    gaps: Array<{ topicName: string; severity: string; subject: string }>;
    exam?: { title: string; daysRemaining: number; priorityTopics: string[] };
    mistakes: Array<{ concept: string; mistakeCount: number }>;
    weakSubjects: Array<{ subject: string; score: number }>;
    activeGoals: Array<{ title: string; progress: number }>;
    careerRole?: string;
    existingCompletedTasks?: IPlannerTaskData[];
  }
): { tasks: IPlannerTaskData[]; plannedMinutes: number; topPriority: string } {
  const candidates: IPlannerTaskData[] = [];
  const maxMinutes = Math.max(10, availableMinutes);

  // Preserve existing completed tasks so completion history is retained
  const completedTasks = (context.existingCompletedTasks || []).filter((t) => t.completed);
  let completedMinutesUsed = completedTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);

  // Remaining budget available for new uncompleted tasks
  let remainingBudget = Math.max(0, maxMinutes - completedMinutesUsed);

  // 1. High-Risk Recovery Actions
  if ((context.riskLevel === 'critical' || context.riskLevel === 'high') && context.recoveryActions.length > 0) {
    const act = context.recoveryActions[0];
    candidates.push({
      taskId: `task_risk_${Date.now()}_1`,
      title: 'Risk Recovery: Foundation Review',
      subject: 'Core Academic',
      topic: 'Foundational Review',
      taskType: 'weak_topic',
      estimatedMinutes: 15,
      priority: 'CRITICAL',
      reason: `Current risk level is ${context.riskLevel}. Action: ${act}`,
      sourceFeature: 'Risk Engine',
      actionUrl: '/learning-coach',
      completed: false,
    });
  }

  // 2. Critical & High Learning Gaps
  context.gaps.slice(0, 3).forEach((gap, idx) => {
    candidates.push({
      taskId: `task_gap_${Date.now()}_${idx + 2}`,
      title: `Resolve Gap: ${gap.topicName}`,
      subject: gap.subject || 'Core Subject',
      topic: gap.topicName,
      taskType: 'practice',
      estimatedMinutes: 15,
      priority: gap.severity === 'critical' ? 'CRITICAL' : 'HIGH',
      reason: `Active ${gap.severity} gap in ${gap.topicName}.`,
      sourceFeature: 'Learning Gaps',
      actionUrl: '/practice',
      completed: false,
    });
  });

  // 3. Exam Urgency
  if (context.exam && context.exam.daysRemaining <= 14) {
    const topic = context.exam.priorityTopics[0] || context.exam.title;
    candidates.push({
      taskId: `task_exam_${Date.now()}_e`,
      title: `Exam Prep: ${topic}`,
      subject: 'Exam Assessment',
      topic,
      taskType: 'exam_prep',
      estimatedMinutes: 15,
      priority: 'HIGH',
      reason: `Upcoming ${context.exam.title} in ${context.exam.daysRemaining} days.`,
      sourceFeature: 'Exam Readiness',
      actionUrl: '/exam-prep',
      completed: false,
    });
  }

  // 4. Mistakes Review
  if (context.mistakes.length > 0) {
    const m = context.mistakes[0];
    candidates.push({
      taskId: `task_mistake_${Date.now()}_m`,
      title: `Mistake Notebook: ${m.concept}`,
      subject: 'Misconception Review',
      topic: m.concept,
      taskType: 'mistake_review',
      estimatedMinutes: 10,
      priority: 'MEDIUM',
      reason: `Unresolved misconception on ${m.concept} (${m.mistakeCount} attempts).`,
      sourceFeature: 'Mistake Review',
      actionUrl: '/mistakes',
      completed: false,
    });
  }

  // 5. Weak Topics & Revision
  context.weakSubjects.slice(0, 2).forEach((subj, idx) => {
    candidates.push({
      taskId: `task_weak_${Date.now()}_w${idx}`,
      title: `Mastery Boost: ${subj.subject}`,
      subject: subj.subject,
      topic: subj.subject,
      taskType: 'revise',
      estimatedMinutes: 15,
      priority: 'MEDIUM',
      reason: `Mastery in ${subj.subject} is currently at ${subj.score}%.`,
      sourceFeature: 'Topic Mastery',
      actionUrl: '/practice',
      completed: false,
    });
  });

  // 6. Active Goals
  if (context.activeGoals.length > 0) {
    const g = context.activeGoals[0];
    candidates.push({
      taskId: `task_goal_${Date.now()}_g`,
      title: `Goal Progress: ${g.title}`,
      subject: 'Learning Goals',
      topic: g.title,
      taskType: 'goal_work',
      estimatedMinutes: 10,
      priority: 'MEDIUM',
      reason: `Working on active goal (progress: ${g.progress}%).`,
      sourceFeature: 'Learning Goals',
      actionUrl: '/goals',
      completed: false,
    });
  }

  // 7. Career Skill
  if (context.careerRole) {
    candidates.push({
      taskId: `task_career_${Date.now()}_c`,
      title: `Career Skill: ${context.careerRole}`,
      subject: 'Career Roadmap',
      topic: context.careerRole,
      taskType: 'career_skill',
      estimatedMinutes: 10,
      priority: 'LOW',
      reason: `Skill milestone for target role: ${context.careerRole}.`,
      sourceFeature: 'Career Roadmap',
      actionUrl: '/career',
      completed: false,
    });
  }

  // Beginner Fallback Schedule if no activity exists
  if (candidates.length === 0) {
    candidates.push({
      taskId: `task_beginner_${Date.now()}_b1`,
      title: 'Daily Practice Warmup',
      subject: 'Mathematics',
      topic: 'Foundational Operations',
      taskType: 'practice',
      estimatedMinutes: 15,
      priority: 'MEDIUM',
      reason: 'Kickstart your daily study momentum with a relaxed practice set.',
      sourceFeature: 'Adaptive Practice',
      actionUrl: '/practice',
      completed: false,
    });
    candidates.push({
      taskId: `task_beginner_${Date.now()}_b2`,
      title: 'Explore AI Learning Coach',
      subject: 'General',
      topic: 'Study Schedule',
      taskType: 'study_plan',
      estimatedMinutes: 10,
      priority: 'LOW',
      reason: 'Check out today\'s recommended study plan and daily focus goals.',
      sourceFeature: 'Learning Coach',
      actionUrl: '/learning-coach',
      completed: false,
    });
  }

  // Bounded Task Selection for uncompleted tasks (never exceed remainingBudget)
  const selectedUncompleted: IPlannerTaskData[] = [];
  let uncompletedMinutesUsed = 0;

  for (const task of candidates) {
    if (uncompletedMinutesUsed + task.estimatedMinutes <= remainingBudget) {
      selectedUncompleted.push(task);
      uncompletedMinutesUsed += task.estimatedMinutes;
    }
  }

  // Handle case where remainingBudget is small but positive
  if (selectedUncompleted.length === 0 && remainingBudget >= 5 && candidates.length > 0) {
    const single = { ...candidates[0], estimatedMinutes: Math.min(10, remainingBudget) };
    selectedUncompleted.push(single);
    uncompletedMinutesUsed = single.estimatedMinutes;
  }

  const finalTasks = [...completedTasks, ...selectedUncompleted];
  const totalPlannedMinutes = completedMinutesUsed + uncompletedMinutesUsed;
  const topPriority = finalTasks[0]?.title || 'Daily Concept Practice';

  return {
    tasks: finalTasks,
    plannedMinutes: totalPlannedMinutes,
    topPriority,
  };
}

export function buildDeterministicWeeklyPlanner(
  studentId: string,
  weekStart: string,
  todayPlanner: IDailyPlannerData
): IWeeklyPlannerDay[] {
  const daysOfWeek: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'> = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const startDate = new Date(weekStart);

  return daysOfWeek.map((dayName, idx) => {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + idx);
    const dateStr = current.toISOString().split('T')[0];

    // If day is today, reuse today's exact tasks
    if (dateStr === todayPlanner.date) {
      const completedTasksCount = todayPlanner.tasks.filter((t) => t.completed).length;
      return {
        date: dateStr,
        dayName,
        totalPlannedMinutes: todayPlanner.plannedMinutes,
        completedMinutes: todayPlanner.completedMinutes,
        tasksCount: todayPlanner.tasks.length,
        completedTasksCount,
        topPriority: todayPlanner.topPriority,
        tasks: todayPlanner.tasks,
      };
    }

    // Otherwise generate balanced weekday/weekend tasks (weekends lighter)
    const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';
    const dayAvailable = isWeekend ? 30 : 45;
    const taskCount = isWeekend ? 2 : 3;

    const sampleTasks: IPlannerTaskData[] = todayPlanner.tasks.slice(0, taskCount).map((t, i) => ({
      ...t,
      taskId: `task_${dateStr}_${i}`,
      completed: false,
      completedAt: undefined,
    }));

    const totalPlanned = sampleTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);

    return {
      date: dateStr,
      dayName,
      totalPlannedMinutes: Math.min(dayAvailable, totalPlanned),
      completedMinutes: 0,
      tasksCount: sampleTasks.length,
      completedTasksCount: 0,
      topPriority: sampleTasks[0]?.title || 'Scheduled Practice',
      tasks: sampleTasks,
    };
  });
}
