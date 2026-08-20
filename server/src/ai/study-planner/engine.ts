import { dataRepository } from '../../repositories/data.repository.js';
import { isDBConnected } from '../../services/db.js';
import { StudyPlanner } from '../../models/study-planner.model.js';
import { evaluateStudentRisk } from '../risk/engine.js';
import { buildDeterministicDailyTasks, buildDeterministicWeeklyPlanner } from './rules.js';
import { IDailyPlannerData, IPlannerTaskData, IWeeklyPlannerData } from './types.js';

// In-Memory Storage Fallback
const inMemStudyPlanners: Map<string, any> = new Map();

function getWeekStartDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as week start
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

export async function getOrCreateTodayPlanner(
  studentId: string,
  customAvailableMinutes?: number,
  forceRefresh: boolean = false
): Promise<IDailyPlannerData> {
  const todayStr = new Date().toISOString().split('T')[0];
  const weekStartStr = getWeekStartDate(todayStr);

  const user = await dataRepository.getUserById(studentId);
  const studentName = user?.name || 'Student';

  // Check if planner already exists for today
  let existingPlanner: any = null;
  if (isDBConnected()) {
    existingPlanner = await StudyPlanner.findOne({ studentId, date: todayStr }).lean();
  } else {
    existingPlanner = inMemStudyPlanners.get(`${studentId}_${todayStr}`);
  }

  // If already exists and not forced refresh, return existing planner
  if (existingPlanner && !forceRefresh) {
    const completedMins = (existingPlanner.tasks || [])
      .filter((t: any) => t.completed)
      .reduce((acc: number, t: any) => acc + (t.estimatedMinutes || 0), 0);
    const completionPercent =
      existingPlanner.plannedMinutes > 0
        ? Math.min(100, Math.round((completedMins / existingPlanner.plannedMinutes) * 100))
        : 0;

    return {
      studentId: String(studentId),
      studentName,
      date: existingPlanner.date,
      weekStart: existingPlanner.weekStart,
      availableMinutes: customAvailableMinutes || existingPlanner.availableMinutes || 45,
      plannedMinutes: existingPlanner.plannedMinutes,
      completedMinutes: completedMins,
      completionPercent,
      tasks: existingPlanner.tasks || [],
      topPriority: existingPlanner.priority || existingPlanner.tasks?.[0]?.title || 'Daily Concept Practice',
      status: existingPlanner.status || 'active',
      generatedAt: existingPlanner.generatedAt
        ? new Date(existingPlanner.generatedAt).toISOString()
        : new Date().toISOString(),
      updatedAt: existingPlanner.updatedAt
        ? new Date(existingPlanner.updatedAt).toISOString()
        : new Date().toISOString(),
    };
  }

  // Fetch Authoritative Student Context (Features 1-17)
  const riskProfile = await evaluateStudentRisk(studentId);
  const gaps = await dataRepository.getStudentGaps(studentId);
  const activeGaps = (gaps || [])
    .filter((g: any) => g.status === 'active')
    .map((g: any) => ({
      topicName: g.topicName || g.topic || 'Core Topic',
      severity: g.severity || 'medium',
      subject: g.subject || 'Core Subject',
    }));

  const exams = await dataRepository.getExamPreparations(studentId);
  const topExam = exams?.[0]
    ? {
        title: exams[0].examName || exams[0].title || 'Upcoming Exam',
        daysRemaining: Math.max(
          0,
          Math.ceil((new Date(exams[0].examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        ),
        priorityTopics: Array.isArray(exams[0].topics) ? exams[0].topics : ['Mathematics'],
      }
    : undefined;

  const mistakes = await dataRepository.getMistakesByStudentId(studentId);
  const recentMistakes = (mistakes || []).slice(0, 3).map((m: any) => ({
    concept: m.misconception || m.concept || 'Concept Review',
    mistakeCount: Number(m.mistakeCount || m.attempts || 1),
  }));

  const masteries = await dataRepository.getTopicMastery(studentId);
  const weakSubjects = (masteries || [])
    .filter((m: any) => Number(m.masteryScore || 0) < 60)
    .map((m: any) => ({
      subject: m.subject || m.topicName || 'Mathematics',
      score: Number(m.masteryScore || 0),
    }));

  const goals = await dataRepository.getStudentGoals(studentId);
  const activeGoals = (goals || [])
    .filter((g: any) => g.status === 'active')
    .map((g: any) => ({
      title: g.title || 'Learning Goal',
      progress: Number(g.progressPercentage || g.progress || 50),
    }));

  let careerRole: string | undefined = undefined;
  const careerGoals = await dataRepository.getCareerGoals(studentId);
  if (careerGoals && careerGoals.length > 0) {
    careerRole = careerGoals[0].targetRole || careerGoals[0].roleTitle;
  }

  const recoveryActions = (riskProfile.recommendedActions || []).map(
    (a: any) => a.description || a.title || 'Review foundational concepts'
  );

  const availableMins = customAvailableMinutes || existingPlanner?.availableMinutes || 45;

  const built = buildDeterministicDailyTasks(studentName, availableMins, {
    riskLevel: riskProfile.riskLevel,
    recoveryActions,
    gaps: activeGaps,
    exam: topExam,
    mistakes: recentMistakes,
    weakSubjects,
    activeGoals,
    careerRole,
    existingCompletedTasks: existingPlanner?.tasks || [],
  });

  const completedMins = built.tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);
  const completionPercent =
    built.plannedMinutes > 0 ? Math.min(100, Math.round((completedMins / built.plannedMinutes) * 100)) : 0;

  const now = new Date();
  const plannerData: IDailyPlannerData = {
    studentId: String(studentId),
    studentName,
    date: todayStr,
    weekStart: weekStartStr,
    availableMinutes: availableMins,
    plannedMinutes: built.plannedMinutes,
    completedMinutes: completedMins,
    completionPercent,
    tasks: built.tasks,
    topPriority: built.topPriority,
    status: completionPercent === 100 ? 'completed' : 'active',
    generatedAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  // Persist Planner Data
  if (isDBConnected()) {
    await StudyPlanner.findOneAndUpdate(
      { studentId, date: todayStr },
      {
        $set: {
          weekStart: weekStartStr,
          availableMinutes: availableMins,
          plannedMinutes: built.plannedMinutes,
          completedMinutes: completedMins,
          completionPercent,
          tasks: built.tasks,
          priority: built.topPriority,
          status: plannerData.status,
          updatedAt: now,
        },
        $setOnInsert: { generatedAt: now },
      },
      { upsert: true, new: true }
    );
  } else {
    inMemStudyPlanners.set(`${studentId}_${todayStr}`, plannerData);
  }

  return plannerData;
}

export async function getWeeklyPlanner(studentId: string): Promise<IWeeklyPlannerData> {
  const todayPlanner = await getOrCreateTodayPlanner(studentId);
  const weekStart = todayPlanner.weekStart;
  const days = buildDeterministicWeeklyPlanner(studentId, weekStart, todayPlanner);

  const totalWeekPlanned = days.reduce((acc, d) => acc + d.totalPlannedMinutes, 0);
  const totalWeekCompleted = days.reduce((acc, d) => acc + d.completedMinutes, 0);

  return {
    studentId: String(studentId),
    weekStart,
    days,
    totalWeekPlannedMinutes: totalWeekPlanned,
    totalWeekCompletedMinutes: totalWeekCompleted,
    evaluatedAt: new Date().toISOString(),
  };
}

export async function completePlannerTask(
  studentId: string,
  taskId: string
): Promise<IDailyPlannerData> {
  const planner = await getOrCreateTodayPlanner(studentId);
  let updated = false;

  planner.tasks.forEach((t) => {
    if (t.taskId === taskId) {
      t.completed = true;
      t.completedAt = new Date().toISOString();
      updated = true;
    }
  });

  if (!updated) {
    throw new Error('TASK_NOT_FOUND');
  }

  const completedMins = planner.tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);

  planner.completedMinutes = completedMins;
  planner.completionPercent =
    planner.plannedMinutes > 0 ? Math.min(100, Math.round((completedMins / planner.plannedMinutes) * 100)) : 0;
  if (planner.completionPercent === 100) {
    planner.status = 'completed';
  }
  planner.updatedAt = new Date().toISOString();

  if (isDBConnected()) {
    await StudyPlanner.findOneAndUpdate(
      { studentId, date: planner.date },
      {
        $set: {
          tasks: planner.tasks,
          completedMinutes: completedMins,
          completionPercent: planner.completionPercent,
          status: planner.status,
          updatedAt: new Date(),
        },
      }
    );
  } else {
    inMemStudyPlanners.set(`${studentId}_${planner.date}`, planner);
  }

  return planner;
}
