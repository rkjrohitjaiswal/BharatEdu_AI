import { generateAIStudyPlannerAdvice } from './ai-coach.js';
import {
  completePlannerTask,
  getOrCreateTodayPlanner,
  getWeeklyPlanner,
} from './engine.js';
import {
  IDailyPlannerData,
  IPlannerAdviceData,
  IPlannerSummaryData,
  IWeeklyPlannerData,
} from './types.js';

export async function getTodayPlanner(
  studentId: string,
  availableMinutes?: number
): Promise<IDailyPlannerData> {
  return await getOrCreateTodayPlanner(studentId, availableMinutes, false);
}

export async function getWeekPlanner(studentId: string): Promise<IWeeklyPlannerData> {
  return await getWeeklyPlanner(studentId);
}

export async function generatePlanner(
  studentId: string,
  availableMinutes?: number
): Promise<IDailyPlannerData> {
  return await getOrCreateTodayPlanner(studentId, availableMinutes, true);
}

export async function refreshPlanner(
  studentId: string,
  availableMinutes?: number
): Promise<IDailyPlannerData> {
  return await getOrCreateTodayPlanner(studentId, availableMinutes, true);
}

export async function completeTask(
  studentId: string,
  taskId: string
): Promise<IDailyPlannerData> {
  return await completePlannerTask(studentId, taskId);
}

export async function getPlannerSummary(studentId: string): Promise<IPlannerSummaryData> {
  const planner = await getOrCreateTodayPlanner(studentId);
  const nextTask = planner.tasks.find((t) => !t.completed) || null;
  const completedTasksCount = planner.tasks.filter((t) => t.completed).length;

  const advice = await generateAIStudyPlannerAdvice(
    planner.studentName,
    planner.availableMinutes,
    planner.plannedMinutes,
    planner.topPriority,
    'low',
    0
  );

  return {
    studentName: planner.studentName,
    todayDate: planner.date,
    availableMinutes: planner.availableMinutes,
    plannedMinutes: planner.plannedMinutes,
    completedMinutes: planner.completedMinutes,
    completionPercent: planner.completionPercent,
    topPriority: planner.topPriority,
    nextTask,
    tasksCount: planner.tasks.length,
    completedTasksCount,
    encouragingMessage: advice.encouragement,
    evaluatedAt: new Date().toISOString(),
  };
}

export async function getPlannerAdvice(studentId: string): Promise<IPlannerAdviceData> {
  const planner = await getOrCreateTodayPlanner(studentId);
  return await generateAIStudyPlannerAdvice(
    planner.studentName,
    planner.availableMinutes,
    planner.plannedMinutes,
    planner.topPriority,
    'low',
    0
  );
}
