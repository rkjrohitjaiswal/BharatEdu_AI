import { generateAIStudentMentorAdvice } from './ai-coach.js';
import { buildStudentMentorSnapshot } from './engine.js';
import {
  evaluateDeterministicDailySuccessScore,
  generateDeterministicMentorPlan,
} from './rules.js';
import {
  IMentorDailyPlan,
  StudentMentorAdvice,
  StudentMentorSnapshot,
  StudentMentorSummary,
} from './types.js';

export async function getTodayStudentMentorSnapshot(
  studentId: string
): Promise<StudentMentorSnapshot> {
  return await buildStudentMentorSnapshot(studentId);
}

export async function getTodayStudentMentorPlan(
  studentId: string
): Promise<IMentorDailyPlan> {
  const snapshot = await buildStudentMentorSnapshot(studentId);
  return generateDeterministicMentorPlan(snapshot);
}

export async function getStudentMentorAdvice(
  studentId: string
): Promise<StudentMentorAdvice> {
  const snapshot = await buildStudentMentorSnapshot(studentId);
  return await generateAIStudentMentorAdvice(snapshot);
}

export async function getStudentMentorSummary(
  studentId: string
): Promise<StudentMentorSummary> {
  const snapshot = await buildStudentMentorSnapshot(studentId);
  const plan = generateDeterministicMentorPlan(snapshot);
  const scoreBreakdown = evaluateDeterministicDailySuccessScore(snapshot);
  const advice = await generateAIStudentMentorAdvice(snapshot);

  const allTasks = [...plan.morning, ...plan.afternoon, ...plan.evening];
  const nextRecommendedAction = allTasks[0] || null;

  return {
    studentName: snapshot.studentName,
    successScore: scoreBreakdown.totalScore,
    topPriority: nextRecommendedAction ? nextRecommendedAction.title : 'Daily Practice',
    nextRecommendedAction,
    recommendedStudyMinutes: plan.totalEstimatedMinutes,
    encouragingMessage: advice.encouragingMessage,
    evaluatedAt: new Date().toISOString(),
  };
}
