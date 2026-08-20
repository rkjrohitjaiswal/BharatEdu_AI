import { dataRepository } from '../../repositories/data.repository.js';
import { isDBConnected } from '../../services/db.js';
import { RevisionItem } from '../../models/revision-item.model.js';
import { getStudentConceptReadinessList, getStudentRootLearningGaps } from '../knowledge-graph/engine.js';
import { getAllCatalogResources } from '../resource-recommendation/engine.js';
import { calculateEstimatedMinutes, determineRevisionPriority } from './rules.js';
import { IDailyRevisionQueueData, IRevisionItemDTO, IRevisionScheduleDay } from './types.js';

export async function seedOrRefreshStudentRevisionQueueEngine(studentId: string): Promise<void> {
  // 1. Gather Knowledge Graph Gaps (Feature 21)
  const rootGaps = await getStudentRootLearningGaps(studentId);
  const readinessList = await getStudentConceptReadinessList(studentId);

  // 2. Starter Concept Seed List if student has no items
  const starterItems = [
    {
      conceptId: 'math_linear_eq',
      topicId: 'Linear Equations',
      topic: 'Linear Equations',
      subject: 'Mathematics',
      difficulty: 'medium',
      masteryScore: 45,
    },
    {
      conceptId: 'math_algebra_fund',
      topicId: 'Algebraic Fundamentals',
      topic: 'Algebraic Fundamentals',
      subject: 'Mathematics',
      difficulty: 'foundational',
      masteryScore: 60,
    },
    {
      conceptId: 'cs_variables',
      topicId: 'Variables & Data Types',
      topic: 'Variables & Data Types',
      subject: 'Computer Science',
      difficulty: 'easy',
      masteryScore: 70,
    },
    {
      conceptId: 'phy_light_refl',
      topicId: 'Light Reflection',
      topic: 'Light Reflection',
      subject: 'Physics',
      difficulty: 'medium',
      masteryScore: 50,
    },
  ];

  // Merge starter items with readiness list
  const allConceptIds = new Set(starterItems.map((s) => s.conceptId));
  readinessList.forEach((r) => allConceptIds.add(r.conceptId));

  const catalogResources = await getAllCatalogResources();

  for (const conceptId of allConceptIds) {
    const readiness = readinessList.find((r) => r.conceptId === conceptId);
    const starter = starterItems.find((s) => s.conceptId === conceptId);
    const rootGap = rootGaps.find((g) => g.rootGapConceptId === conceptId);

    const subject = readiness?.subject || starter?.subject || 'Mathematics';
    const topic = readiness?.conceptName || starter?.topic || conceptId;
    const masteryScore = readiness?.directMastery ?? starter?.masteryScore ?? 50;
    const difficulty = readiness?.readinessLevel === 'blocked' ? 'foundational' : starter?.difficulty || 'medium';

    const { priority } = determineRevisionPriority({
      isRootPrereqGap: Boolean(rootGap),
      isHighRisk: rootGap?.severity === 'critical',
      masteryScore,
      hasRepeatedMistakes: masteryScore < 50,
      isGoalAligned: true,
    });

    const matchedResource = catalogResources.find((res) => res.conceptId === conceptId);

    const nextReviewAt = new Date();
    if (priority === 'critical') {
      nextReviewAt.setDate(nextReviewAt.getDate() - 1); // Overdue / due today
    }

    await dataRepository.upsertRevisionItem(studentId, conceptId, {
      subject,
      topicId: topic,
      topic,
      conceptId,
      sourceType: rootGap ? 'prerequisite' : 'practice',
      masteryScore,
      confidenceScore: masteryScore,
      difficulty,
      priority,
      status: 'due',
      nextReviewAt,
      currentIntervalDays: 1,
      easeFactor: 2.5,
    });
  }
}

export async function getDailyRevisionQueueEngine(studentId: string): Promise<IDailyRevisionQueueData> {
  await seedOrRefreshStudentRevisionQueueEngine(studentId);
  const items = await dataRepository.getStudentRevisionItems(studentId);

  // Feature 18 Study Planner available time budget integration (default 60 min cap)
  const studyPlan = await dataRepository.getStudentStudyPlan(studentId);
  const availableDailyMinutes = studyPlan?.availableDailyMinutes || 60;

  const catalogResources = await getAllCatalogResources();
  const rootGaps = await getStudentRootLearningGaps(studentId);

  let accumulatedMinutes = 0;
  const dtoItems: IRevisionItemDTO[] = [];

  const summary = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const raw of items || []) {
    const rootGap = rootGaps.find((g) => g.rootGapConceptId === raw.conceptId);
    const matchedRes = catalogResources.find((r) => r.conceptId === raw.conceptId);

    const { priority, reason } = determineRevisionPriority({
      isRootPrereqGap: Boolean(rootGap),
      isHighRisk: raw.priority === 'critical' || raw.priority === 'CRITICAL',
      masteryScore: raw.masteryScore || 50,
      hasRepeatedMistakes: (raw.failedReviews || 0) > 0,
      isGoalAligned: true,
    });

    const estMin = calculateEstimatedMinutes(raw.difficulty || 'medium');
    const normPriority = (priority.toLowerCase() as keyof typeof summary) || 'medium';

    summary[normPriority] = (summary[normPriority] || 0) + 1;

    // Respect study planner daily time limit
    if (accumulatedMinutes + estMin <= availableDailyMinutes) {
      accumulatedMinutes += estMin;

      dtoItems.push({
        id: String(raw._id || raw.id || `rev_${raw.conceptId}`),
        studentId: String(studentId),
        topicId: raw.topicId || raw.topic,
        topic: raw.topic,
        conceptId: raw.conceptId,
        subject: raw.subject,
        sourceType: raw.sourceType || 'practice',
        sourceId: raw.sourceId,
        lastReviewedAt: raw.lastReviewedAt ? new Date(raw.lastReviewedAt).toISOString() : undefined,
        nextReviewAt: raw.nextReviewAt ? new Date(raw.nextReviewAt).toISOString() : new Date().toISOString(),
        reviewCount: raw.reviewCount || 0,
        successfulReviews: raw.successfulReviews || 0,
        failedReviews: raw.failedReviews || 0,
        currentIntervalDays: raw.currentIntervalDays || raw.intervalDays || 1,
        easeFactor: raw.easeFactor || 2.5,
        difficulty: raw.difficulty || 'medium',
        masteryScore: raw.masteryScore || 50,
        confidenceScore: raw.confidenceScore || 50,
        priority: normPriority as any,
        status: raw.status || 'due',
        reason,
        recommendedAction: `Complete 10-min practice session on ${raw.topic}.`,
        estimatedMinutes: estMin,
        recommendedResourceTitle: matchedRes?.title,
        recommendedResourceUrl: matchedRes?.officialSourceUrl || '/resources',
      });
    }
  }

  const dueItems = dtoItems.filter((i) => i.status === 'due' || i.status === 'active');

  return {
    date: new Date().toISOString().split('T')[0],
    totalDue: dueItems.length,
    totalUpcoming: Math.max(0, dtoItems.length - dueItems.length),
    estimatedMinutes: accumulatedMinutes,
    prioritySummary: summary,
    revisionItems: dtoItems,
  };
}

export async function getRevisionScheduleEngine(
  studentId: string,
  daysCount: number = 7,
  subjectFilter?: string,
  priorityFilter?: string
): Promise<IRevisionScheduleDay[]> {
  const queue = await getDailyRevisionQueueEngine(studentId);
  const safeDays = Math.min(30, Math.max(1, daysCount));

  let filtered = queue.revisionItems;
  if (subjectFilter && subjectFilter !== 'all') {
    filtered = filtered.filter((i) => i.subject.toLowerCase() === subjectFilter.toLowerCase());
  }
  if (priorityFilter && priorityFilter !== 'all') {
    filtered = filtered.filter((i) => i.priority.toLowerCase() === priorityFilter.toLowerCase());
  }

  const scheduleDays: IRevisionScheduleDay[] = [];
  const now = new Date();

  for (let d = 0; d < safeDays; d++) {
    const dayDate = new Date(now);
    dayDate.setDate(dayDate.getDate() + d);
    const dateStr = dayDate.toISOString().split('T')[0];

    const dayItems = filtered.filter((item) => {
      const nextDate = new Date(item.nextReviewAt).toISOString().split('T')[0];
      return d === 0 ? nextDate <= dateStr : nextDate === dateStr;
    });

    const estMin = dayItems.reduce((acc, curr) => acc + curr.estimatedMinutes, 0);

    scheduleDays.push({
      date: dateStr,
      dueCount: dayItems.length,
      estimatedMinutes: estMin,
      items: dayItems,
    });
  }

  return scheduleDays;
}
