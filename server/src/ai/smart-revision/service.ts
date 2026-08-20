import { dataRepository } from '../../repositories/data.repository.js';
import { RevisionOutcome } from '../../models/revision-history.model.js';
import { generateAIRevisionAdvice } from './ai-coach.js';
import {
  getDailyRevisionQueueEngine,
  getRevisionScheduleEngine,
  seedOrRefreshStudentRevisionQueueEngine,
} from './engine.js';
import { calculateSpacedRepetitionNextState, determineRevisionPriority } from './rules.js';

export async function getDailyRevisionQueue(studentId: string) {
  const queue = await getDailyRevisionQueueEngine(studentId);
  const user = await dataRepository.getUserById(studentId);

  const topItem = queue.revisionItems[0];

  const aiExplanation = await generateAIRevisionAdvice(
    user?.name || 'Student',
    queue.totalDue,
    queue.prioritySummary.critical,
    topItem?.conceptId
  );

  return {
    ...queue,
    aiExplanation,
  };
}

export async function getRevisionSchedule(
  studentId: string,
  daysCount: number = 7,
  subjectFilter?: string,
  priorityFilter?: string
) {
  return await getRevisionScheduleEngine(studentId, daysCount, subjectFilter, priorityFilter);
}

export async function startRevisionSession(studentId: string, revisionItemId: string) {
  const items = await dataRepository.getStudentRevisionItems(studentId);
  const cleanId = String(revisionItemId).replace(/^rev_/, '');
  const item = (items || []).find(
    (i: any) =>
      String(i._id || i.id) === String(revisionItemId) ||
      i.conceptId === revisionItemId ||
      i.conceptId === cleanId
  );

  if (!item) {
    throw new Error('Revision item not found');
  }

  // Pure status update to active session
  return await dataRepository.upsertRevisionItem(studentId, item.conceptId, {
    status: 'active',
    lastReviewedAt: new Date(),
  });
}

export async function completeRevisionOutcome(
  studentId: string,
  revisionItemId: string,
  outcome: RevisionOutcome
) {
  const validOutcomes: RevisionOutcome[] = ['again', 'hard', 'good', 'easy'];
  if (!validOutcomes.includes(outcome)) {
    throw new Error(`Invalid revision outcome: ${outcome}`);
  }

  const items = await dataRepository.getStudentRevisionItems(studentId);
  const cleanId = String(revisionItemId).replace(/^rev_/, '');
  const item = (items || []).find(
    (i: any) =>
      String(i._id || i.id) === String(revisionItemId) ||
      i.conceptId === revisionItemId ||
      i.conceptId === cleanId
  );

  if (!item) {
    throw new Error('Revision item not found');
  }

  const currentInterval = item.currentIntervalDays || item.intervalDays || 1;
  const currentEase = item.easeFactor || 2.5;

  // Server-Authoritative Spaced Repetition calculation
  const nextState = calculateSpacedRepetitionNextState(currentInterval, currentEase, outcome);

  const isSuccess = outcome === 'good' || outcome === 'easy';
  const newSuccessCount = (item.successfulReviews || 0) + (isSuccess ? 1 : 0);
  const newFailCount = (item.failedReviews || 0) + (!isSuccess ? 1 : 0);
  const newReviewCount = (item.reviewCount || 0) + 1;

  // Update Mastery Impact safely
  let newMastery = item.masteryScore || 50;
  if (outcome === 'easy') newMastery = Math.min(100, newMastery + 15);
  else if (outcome === 'good') newMastery = Math.min(100, newMastery + 8);
  else if (outcome === 'hard') newMastery = Math.max(0, newMastery - 5);
  else if (outcome === 'again') newMastery = Math.max(0, newMastery - 15);

  const { priority } = determineRevisionPriority({
    isRootPrereqGap: false,
    isHighRisk: newMastery < 40,
    masteryScore: newMastery,
    hasRepeatedMistakes: newFailCount > 1,
    isGoalAligned: true,
  });

  // Save Revision History Record
  await dataRepository.addRevisionHistory({
    studentId,
    revisionItemId: String(item._id || item.id || revisionItemId),
    conceptId: item.conceptId,
    topicId: item.topicId || item.topic,
    reviewedAt: new Date(),
    outcome,
    previousInterval: currentInterval,
    newInterval: nextState.newIntervalDays,
    previousEaseFactor: currentEase,
    newEaseFactor: nextState.newEaseFactor,
    source: 'Smart Revision Engine',
  });

  // Update Revision Item
  const updatedItem = await dataRepository.upsertRevisionItem(studentId, item.conceptId, {
    lastReviewedAt: new Date(),
    nextReviewAt: nextState.nextReviewAt,
    currentIntervalDays: nextState.newIntervalDays,
    easeFactor: nextState.newEaseFactor,
    reviewCount: newReviewCount,
    successfulReviews: newSuccessCount,
    failedReviews: newFailCount,
    masteryScore: newMastery,
    confidenceScore: newMastery,
    priority,
    status: outcome === 'easy' && newMastery >= 90 ? 'completed' : 'due',
  });

  // Create Deduplicated Notification for Critical Revisions (Feature 11 Integration)
  if (priority === 'critical') {
    await dataRepository.createNotification({
      recipientUserId: studentId,
      recipientRole: 'student',
      type: 'REVISION_ALERT',
      title: `Critical Revision Due: ${item.topic}`,
      message: `Your revision for ${item.topic} needs attention to maintain concept mastery.`,
      priority: 'high',
      sourceType: 'REVISION',
    });
  }

  return {
    item: updatedItem,
    nextState,
    masteryImpact: newMastery,
  };
}

export async function refreshStudentRevisionQueue(studentId: string) {
  await seedOrRefreshStudentRevisionQueueEngine(studentId);
  return await getDailyRevisionQueue(studentId);
}

export async function getTeacherStudentRevisionSummary(teacherId: string, studentId: string) {
  const queue = await getDailyRevisionQueueEngine(studentId);
  const history = await dataRepository.getStudentRevisionHistoryList(studentId);

  return {
    studentId,
    queueSummary: {
      totalDue: queue.totalDue,
      criticalCount: queue.prioritySummary.critical,
      highCount: queue.prioritySummary.high,
      estimatedMinutes: queue.estimatedMinutes,
    },
    recentHistory: (history || []).slice(0, 5),
    teacherRecommendation: queue.prioritySummary.critical > 0
      ? `Assign foundational exercises for critical concepts.`
      : 'Student is staying on track with daily spaced-repetition revision.',
  };
}

export async function getParentStudentRevisionSummary(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const queue = await getDailyRevisionQueueEngine(studentId);
  const history = await dataRepository.getStudentRevisionHistoryList(studentId);

  return {
    studentId,
    queueSummary: {
      totalDue: queue.totalDue,
      criticalCount: queue.prioritySummary.critical,
      estimatedMinutes: queue.estimatedMinutes,
    },
    totalCompletedReviews: (history || []).length,
    parentExplanation: queue.prioritySummary.critical > 0
      ? `Your child has ${queue.prioritySummary.critical} critical concept revisions due today.`
      : 'Your child is maintaining steady progress in their daily revision routine.',
  };
}
