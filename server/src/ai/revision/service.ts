import { dataRepository } from '../../repositories/data.repository.js';
import { generateAIRevisionAdvice } from './ai-coach.js';
import {
  completeRevisionSessionEngine,
  generateOrUpdateStudentRevisionItems,
  getTodayDailyRevisionPlan,
  getWeeklyRevisionPlan,
  startRevisionSessionEngine,
} from './engine.js';
import {
  IDailyRevisionData,
  IRevisionAdviceData,
  IRevisionItemData,
  IRevisionSessionData,
  IRevisionSummaryData,
  IWeeklyRevisionData,
} from './types.js';

export async function getTodayRevisionPlan(studentId: string): Promise<IDailyRevisionData> {
  return await getTodayDailyRevisionPlan(studentId);
}

export async function getWeeklyRevisionPlanService(studentId: string): Promise<IWeeklyRevisionData> {
  return await getWeeklyRevisionPlan(studentId);
}

export async function getDueRevisionItems(studentId: string): Promise<IRevisionItemData[]> {
  const items = await generateOrUpdateStudentRevisionItems(studentId);
  return items.filter((i) => i.overdue || i.status === 'due' || i.status === 'overdue' || i.priority === 'CRITICAL' || i.priority === 'HIGH');
}

export async function getOverdueRevisionItems(studentId: string): Promise<IRevisionItemData[]> {
  const items = await generateOrUpdateStudentRevisionItems(studentId);
  return items.filter((i) => i.overdue || i.status === 'overdue');
}

export async function getRevisionItemById(
  studentId: string,
  itemId: string
): Promise<IRevisionItemData | null> {
  const items = await generateOrUpdateStudentRevisionItems(studentId);
  return items.find((i) => i.id === itemId || i.topic.toLowerCase() === itemId.toLowerCase()) || null;
}

export async function generateRevisionPlan(studentId: string): Promise<IRevisionItemData[]> {
  return await generateOrUpdateStudentRevisionItems(studentId, true);
}

export async function refreshRevisionPlan(studentId: string): Promise<IDailyRevisionData> {
  await generateOrUpdateStudentRevisionItems(studentId, true);
  return await getTodayDailyRevisionPlan(studentId);
}

export async function startReviewSession(
  studentId: string,
  itemId: string
): Promise<IRevisionSessionData> {
  return await startRevisionSessionEngine(studentId, itemId);
}

export async function completeReviewSession(
  studentId: string,
  itemId: string,
  questionsAttempted: number,
  questionsCorrect: number
): Promise<{ session: IRevisionSessionData; updatedItem: IRevisionItemData }> {
  return await completeRevisionSessionEngine(studentId, itemId, questionsAttempted, questionsCorrect);
}

export async function getRevisionSummary(studentId: string): Promise<IRevisionSummaryData> {
  const items = await generateOrUpdateStudentRevisionItems(studentId);
  const user = await dataRepository.getUserById(studentId);

  const dueItems = items.filter((i) => i.overdue || i.status === 'due' || i.status === 'overdue' || i.priority === 'CRITICAL' || i.priority === 'HIGH');
  const overdueItems = items.filter((i) => i.overdue || i.status === 'overdue');
  const masteredItems = items.filter((i) => i.status === 'mastered' || i.reviewLevel === 'mastered');

  const totalRetention = items.reduce((acc, i) => acc + i.retentionScore, 0);
  const averageRetention = items.length > 0 ? Math.round(totalRetention / items.length) : 50;

  const topPriorityItem = dueItems[0] || items[0] || null;

  let summaryMessage = `You have ${dueItems.length} topics due for revision today.`;
  if (overdueItems.length > 0) {
    summaryMessage = `${overdueItems.length} topics are overdue for review! Prioritize ${topPriorityItem?.topic} to maintain memory strength.`;
  } else if (averageRetention >= 80) {
    summaryMessage = `Excellent retention (${averageRetention}%)! Keep up daily reviews to maintain exam readiness.`;
  }

  return {
    studentName: user?.name || 'Student',
    totalActiveItems: items.length,
    totalDue: dueItems.length,
    totalOverdue: overdueItems.length,
    averageRetention,
    masteredCount: masteredItems.length,
    reviewStreakDays: 5,
    topPriorityItem,
    summaryMessage,
    evaluatedAt: new Date().toISOString(),
  };
}

export async function getRevisionAdvice(studentId: string): Promise<IRevisionAdviceData> {
  const summary = await getRevisionSummary(studentId);
  return await generateAIRevisionAdvice(
    summary.studentName,
    summary.totalDue,
    summary.topPriorityItem?.topic || 'Mathematics',
    summary.totalOverdue,
    summary.averageRetention
  );
}
