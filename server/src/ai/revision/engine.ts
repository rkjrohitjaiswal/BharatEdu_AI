import { dataRepository } from '../../repositories/data.repository.js';
import { isDBConnected } from '../../services/db.js';
import { RevisionItem } from '../../models/revision-item.model.js';
import { RevisionSession } from '../../models/revision-session.model.js';
import { evaluateStudentRisk } from '../risk/engine.js';
import { getOrCreateTodayPlanner } from '../study-planner/engine.js';
import {
  calculateDeterministicPriorityScore,
  calculateDeterministicRetention,
  calculateReviewResult,
  updateSpacedRepetitionInterval,
} from './rules.js';
import { IDailyRevisionData, IRevisionItemData, IRevisionSessionData, IWeeklyRevisionData } from './types.js';

// In-Memory Storage Fallback
const inMemRevisionItems: Map<string, IRevisionItemData> = new Map();
const inMemRevisionSessions: Map<string, IRevisionSessionData> = new Map();

function getWeekStartDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

export async function generateOrUpdateStudentRevisionItems(
  studentId: string,
  forceRefresh: boolean = false
): Promise<IRevisionItemData[]> {
  const user = await dataRepository.getUserById(studentId);
  const studentName = user?.name || 'Student';

  // Gather Authoritative Student Context (Features 1-19)
  const riskProfile = await evaluateStudentRisk(studentId);
  const gaps = await dataRepository.getStudentGaps(studentId);
  const activeGaps = (gaps || []).filter((g: any) => g.status === 'active');

  const mistakes = await dataRepository.getMistakesByStudentId(studentId);
  const recentMistakes = mistakes || [];

  const masteries = await dataRepository.getTopicMastery(studentId);
  const weakMasteries = (masteries || []).filter((m: any) => Number(m.masteryScore || 0) < 75);

  const goals = await dataRepository.getStudentGoals(studentId);
  const activeGoals = (goals || []).filter((g: any) => g.status === 'active');

  const exams = await dataRepository.getExamPreparations(studentId);
  const topExam = exams?.[0]
    ? {
        daysRemaining: Math.max(
          0,
          Math.ceil((new Date(exams[0].examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        ),
        priorityTopics: Array.isArray(exams[0].topics) ? exams[0].topics : [],
      }
    : undefined;

  // Build candidate topics for revision from gaps, mistakes, weak masteries, and exams
  const topicMap: Map<string, { subject: string; topic: string; sourceType: string; sourceId: string }> = new Map();

  recentMistakes.forEach((m: any) => {
    const topic = m.misconception || m.concept || 'Algebra';
    const key = topic.toLowerCase();
    if (!topicMap.has(key)) {
      topicMap.set(key, {
        subject: m.subject || 'Mathematics',
        topic,
        sourceType: 'mistake',
        sourceId: String(m._id || m.id || 'm1'),
      });
    }
  });

  activeGaps.forEach((g: any) => {
    const topic = g.topicName || g.topic || 'Physics Optics';
    const key = topic.toLowerCase();
    if (!topicMap.has(key)) {
      topicMap.set(key, {
        subject: g.subject || 'Physics',
        topic,
        sourceType: 'learning_gap',
        sourceId: String(g._id || g.id || 'g1'),
      });
    }
  });

  weakMasteries.forEach((wm: any) => {
    const topic = wm.topicName || wm.subject || 'Chemistry';
    const key = topic.toLowerCase();
    if (!topicMap.has(key)) {
      topicMap.set(key, {
        subject: wm.subject || 'Chemistry',
        topic,
        sourceType: 'practice',
        sourceId: String(wm._id || wm.id || 'w1'),
      });
    }
  });

  // Default fallback topics if zero activity
  if (topicMap.size === 0) {
    topicMap.set('quadratic equations', {
      subject: 'Mathematics',
      topic: 'Quadratic Equations',
      sourceType: 'manual',
      sourceId: 'fallback_1',
    });
    topicMap.set('light reflection and refraction', {
      subject: 'Physics',
      topic: 'Light - Reflection and Refraction',
      sourceType: 'manual',
      sourceId: 'fallback_2',
    });
  }

  const items: IRevisionItemData[] = [];
  const now = new Date();

  for (const [_, info] of topicMap.entries()) {
    const itemId = `rev_${studentId}_${info.topic.replace(/\s+/g, '_')}`;

    // Existing item check
    let existingItem: any = null;
    if (isDBConnected()) {
      existingItem = await RevisionItem.findOne({ studentId, topic: info.topic }).lean();
    } else {
      existingItem = inMemRevisionItems.get(itemId);
    }

    const masteryScore = existingItem?.masteryScore || 50;
    const lastReviewedAt = existingItem?.lastReviewedAt ? new Date(existingItem.lastReviewedAt) : undefined;
    const consecutiveCorrect = existingItem?.consecutiveCorrect || 0;
    const consecutiveIncorrect = existingItem?.consecutiveIncorrect || 0;

    const matchedMistake = recentMistakes.find(
      (m: any) => (m.concept || '').toLowerCase().includes(info.topic.toLowerCase())
    );
    const mistakeCount = matchedMistake ? Number(matchedMistake.mistakeCount || 1) : 0;

    const retentionScore = calculateDeterministicRetention(
      masteryScore,
      lastReviewedAt,
      consecutiveCorrect,
      consecutiveIncorrect,
      mistakeCount
    );

    const matchedGap = activeGaps.find(
      (g: any) => (g.topicName || '').toLowerCase().includes(info.topic.toLowerCase())
    );
    const matchedGoal = activeGoals.find(
      (g: any) => (g.title || '').toLowerCase().includes(info.topic.toLowerCase())
    );

    const { score: priorityScore, priority, reason } = calculateDeterministicPriorityScore({
      retentionScore,
      masteryScore,
      gapSeverity: matchedGap?.severity,
      examDaysRemaining: topExam?.daysRemaining,
      mistakeCount,
      isGoalRelated: Boolean(matchedGoal),
      riskLevel: riskProfile.riskLevel,
    });

    const intervalDays = existingItem?.intervalDays || (priority === 'CRITICAL' ? 1 : 2);
    let nextReviewAt = existingItem?.nextReviewAt ? new Date(existingItem.nextReviewAt) : new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

    // Overdue check
    const isOverdue = nextReviewAt.getTime() <= now.getTime();
    const status = isOverdue ? 'overdue' : existingItem?.status || 'active';

    const itemData: IRevisionItemData = {
      id: itemId,
      studentId: String(studentId),
      subject: info.subject,
      topic: info.topic,
      subtopic: 'General Review',
      sourceType: (existingItem?.sourceType || info.sourceType) as any,
      sourceId: existingItem?.sourceId || info.sourceId,
      masteryScore,
      retentionScore,
      difficulty: existingItem?.difficulty || 'intermediate',
      priority,
      reviewLevel: existingItem?.reviewLevel || (retentionScore >= 75 ? 'retained' : retentionScore >= 50 ? 'reinforcing' : 'learning'),
      intervalDays,
      repetitionCount: existingItem?.repetitionCount || 0,
      lastReviewedAt: lastReviewedAt ? lastReviewedAt.toISOString() : undefined,
      nextReviewAt: nextReviewAt.toISOString(),
      lastResult: existingItem?.lastResult,
      consecutiveCorrect,
      consecutiveIncorrect,
      overdue: isOverdue,
      status: status as any,
      reason,
      estimatedMinutes: 15,
      actionUrl: '/practice',
    };

    items.push(itemData);

    // Persist to DB or Memory
    if (isDBConnected()) {
      await RevisionItem.findOneAndUpdate(
        { studentId, topic: info.topic },
        {
          $set: {
            subject: info.subject,
            subtopic: itemData.subtopic,
            sourceType: itemData.sourceType,
            sourceId: itemData.sourceId,
            masteryScore,
            retentionScore,
            difficulty: itemData.difficulty,
            priority: itemData.priority,
            reviewLevel: itemData.reviewLevel,
            intervalDays: itemData.intervalDays,
            repetitionCount: itemData.repetitionCount,
            nextReviewAt,
            overdue: isOverdue,
            status,
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true, new: true }
      );
    } else {
      inMemRevisionItems.set(itemId, itemData);
    }
  }

  // Sort by priority rank & retentionScore ascending
  items.sort((a, b) => b.retentionScore - a.retentionScore);
  items.sort((a, b) => {
    const rank: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    return rank[b.priority] - rank[a.priority];
  });

  return items;
}

export async function getTodayDailyRevisionPlan(studentId: string): Promise<IDailyRevisionData> {
  const items = await generateOrUpdateStudentRevisionItems(studentId);
  const todayStr = new Date().toISOString().split('T')[0];

  const user = await dataRepository.getUserById(studentId);
  const studentName = user?.name || 'Student';

  const dueItems = items.filter((i) => i.overdue || i.status === 'due' || i.status === 'overdue' || i.priority === 'CRITICAL' || i.priority === 'HIGH');
  const overdueItems = items.filter((i) => i.overdue || i.status === 'overdue');

  const planner = await getOrCreateTodayPlanner(studentId);
  const availableMinutes = planner.availableMinutes || 45;

  const totalPlannedMinutes = dueItems.reduce((acc, i) => acc + (i.estimatedMinutes || 15), 0);
  const plannedMinutes = Math.min(availableMinutes, totalPlannedMinutes);

  return {
    studentId: String(studentId),
    studentName,
    date: todayStr,
    totalDue: dueItems.length,
    totalOverdue: overdueItems.length,
    totalPlanned: dueItems.length,
    plannedMinutes,
    availableMinutes,
    completionPercent: 0,
    priorityItems: dueItems.slice(0, 3),
    tasks: dueItems.slice(0, 10),
    evaluatedAt: new Date().toISOString(),
  };
}

export async function getWeeklyRevisionPlan(studentId: string): Promise<IWeeklyRevisionData> {
  const todayPlan = await getTodayDailyRevisionPlan(studentId);
  const weekStartStr = getWeekStartDate(todayPlan.date);

  const daysOfWeek: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'> = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const startDate = new Date(weekStartStr);

  const days = daysOfWeek.map((dayName, idx) => {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + idx);
    const dateStr = current.toISOString().split('T')[0];

    if (dateStr === todayPlan.date) {
      return {
        date: dateStr,
        dayName,
        plannedMinutes: todayPlan.plannedMinutes,
        dueCount: todayPlan.totalDue,
        completedCount: 0,
        topPriorityTopic: todayPlan.tasks[0]?.topic || 'Scheduled Revision',
        tasks: todayPlan.tasks,
      };
    }

    const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';
    const taskCount = isWeekend ? 2 : 3;
    const sampleTasks = todayPlan.tasks.slice(0, taskCount).map((t, i) => ({
      ...t,
      id: `rev_${dateStr}_${i}`,
      nextReviewAt: dateStr,
    }));

    return {
      date: dateStr,
      dayName,
      plannedMinutes: sampleTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 15), 0),
      dueCount: sampleTasks.length,
      completedCount: 0,
      topPriorityTopic: sampleTasks[0]?.topic || 'Scheduled Revision',
      tasks: sampleTasks,
    };
  });

  const totalWeekPlannedMinutes = days.reduce((acc, d) => acc + d.plannedMinutes, 0);

  return {
    studentId: String(studentId),
    weekStart: weekStartStr,
    days,
    totalWeekPlannedMinutes,
    evaluatedAt: new Date().toISOString(),
  };
}

export async function startRevisionSessionEngine(
  studentId: string,
  itemId: string
): Promise<IRevisionSessionData> {
  const items = await generateOrUpdateStudentRevisionItems(studentId);
  const item = items.find((i) => i.id === itemId || i.topic.toLowerCase() === itemId.toLowerCase()) || items[0];

  const sessionId = `rev_sess_${Date.now()}`;
  const now = new Date();
  const nextReviewDate = new Date(now.getTime() + item.intervalDays * 24 * 60 * 60 * 1000);

  const sessionData: IRevisionSessionData = {
    sessionId,
    revisionItemId: item.id,
    studentId: String(studentId),
    topic: item.topic,
    startedAt: now.toISOString(),
    plannedMinutes: item.estimatedMinutes || 15,
    actualMinutes: 0,
    questionsAttempted: 0,
    questionsCorrect: 0,
    accuracy: 0,
    result: 'passed',
    retentionBefore: item.retentionScore,
    retentionAfter: item.retentionScore,
    nextReviewAt: nextReviewDate.toISOString(),
  };

  if (isDBConnected()) {
    await RevisionSession.create({
      studentId,
      revisionItemId: item.id,
      topic: item.topic,
      startedAt: now,
      plannedMinutes: sessionData.plannedMinutes,
      retentionBefore: item.retentionScore,
      retentionAfter: item.retentionScore,
      nextReviewAt: nextReviewDate,
    });
  } else {
    inMemRevisionSessions.set(sessionId, sessionData);
  }

  return sessionData;
}

export async function completeRevisionSessionEngine(
  studentId: string,
  itemId: string,
  questionsAttempted: number,
  questionsCorrect: number
): Promise<{ session: IRevisionSessionData; updatedItem: IRevisionItemData }> {
  const items = await generateOrUpdateStudentRevisionItems(studentId);
  const item = items.find((i) => i.id === itemId || i.topic.toLowerCase() === itemId.toLowerCase()) || items[0];

  const { accuracy, result } = calculateReviewResult(questionsAttempted, questionsCorrect);

  const {
    nextIntervalDays,
    newRetentionScore,
    newReviewLevel,
    newConsecutiveCorrect,
    newConsecutiveIncorrect,
  } = updateSpacedRepetitionInterval(
    item.intervalDays,
    item.repetitionCount,
    result,
    item.retentionScore,
    item.consecutiveCorrect,
    item.consecutiveIncorrect
  );

  const now = new Date();
  const nextReviewAt = new Date(now.getTime() + nextIntervalDays * 24 * 60 * 60 * 1000);
  const status = newRetentionScore >= 90 ? 'mastered' : 'active';

  const updatedItem: IRevisionItemData = {
    ...item,
    retentionScore: newRetentionScore,
    reviewLevel: newReviewLevel,
    intervalDays: nextIntervalDays,
    repetitionCount: item.repetitionCount + 1,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReviewAt.toISOString(),
    lastResult: result,
    consecutiveCorrect: newConsecutiveCorrect,
    consecutiveIncorrect: newConsecutiveIncorrect,
    overdue: false,
    status: status as any,
  };

  const sessionId = `rev_sess_${Date.now()}`;
  const sessionData: IRevisionSessionData = {
    sessionId,
    revisionItemId: item.id,
    studentId: String(studentId),
    topic: item.topic,
    startedAt: now.toISOString(),
    completedAt: now.toISOString(),
    plannedMinutes: item.estimatedMinutes,
    actualMinutes: item.estimatedMinutes,
    questionsAttempted,
    questionsCorrect,
    accuracy,
    result,
    retentionBefore: item.retentionScore,
    retentionAfter: newRetentionScore,
    nextReviewAt: nextReviewAt.toISOString(),
  };

  // Persist Updates to DB or Memory
  if (isDBConnected()) {
    await RevisionItem.findOneAndUpdate(
      { studentId, topic: item.topic },
      {
        $set: {
          retentionScore: newRetentionScore,
          reviewLevel: newReviewLevel,
          intervalDays: nextIntervalDays,
          repetitionCount: updatedItem.repetitionCount,
          lastReviewedAt: now,
          nextReviewAt,
          lastResult: result,
          consecutiveCorrect: newConsecutiveCorrect,
          consecutiveIncorrect: newConsecutiveIncorrect,
          overdue: false,
          status,
          updatedAt: now,
        },
      }
    );

    await RevisionSession.create({
      studentId,
      revisionItemId: item.id,
      topic: item.topic,
      startedAt: now,
      completedAt: now,
      plannedMinutes: item.estimatedMinutes,
      actualMinutes: item.estimatedMinutes,
      questionsAttempted,
      questionsCorrect,
      accuracy,
      result,
      retentionBefore: item.retentionScore,
      retentionAfter: newRetentionScore,
      nextReviewAt,
    });
  } else {
    inMemRevisionItems.set(item.id, updatedItem);
    inMemRevisionSessions.set(sessionId, sessionData);
  }

  // Trigger Notification (Feature 11) for mastery milestone or overdue clearance
  if (status === 'mastered') {
    await dataRepository.createNotification({
      recipientUserId: studentId,
      recipientRole: 'student',
      title: 'Revision Mastery Milestone!',
      message: `Congratulations! You have reached Mastered retention level in ${item.topic}.`,
      type: 'system',
      priority: 'high',
      sourceFeature: 'Smart Revision',
      dedupeKey: `revision_mastery_${studentId}_${item.topic.replace(/\s+/g, '_')}`,
    });
  }

  return { session: sessionData, updatedItem };
}
