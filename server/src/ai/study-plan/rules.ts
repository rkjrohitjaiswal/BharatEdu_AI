import { PrioritizedTopicItem, StudyPlanDuration, TaskActivityType } from './types.js';

export class StudyPlanRulesEngine {
  /**
   * Deterministically prioritizes topics based on student's actual learning state:
   * 1. Critical learning gaps
   * 2. High learning gaps
   * 3. Prerequisite gaps
   * 4. Misconceptions
   * 5. Weak mastery (<60%)
   * 6. Recommended topics
   * 7. Revision of recently learned topics
   */
  public static prioritizeTopics(
    masteries: any[],
    learningGaps: any[],
    recommendedTopics: any[],
    allSubjects: any[]
  ): PrioritizedTopicItem[] {
    const candidateMap = new Map<string, PrioritizedTopicItem>();

    // 1. Process Active Learning Gaps (Highest Priority)
    learningGaps.forEach((gap) => {
      if (gap.status !== 'active') return;

      const topicObj = typeof gap.topicId === 'object' && gap.topicId !== null ? gap.topicId : null;
      const topicId = String(topicObj?._id || gap.topicId || '');
      if (!topicId) return;

      const topicName = topicObj?.name || 'Curriculum Topic';
      const subjectObj = typeof topicObj?.subjectId === 'object' ? topicObj.subjectId : null;
      const subjectId = String(subjectObj?._id || topicObj?.subjectId || '');
      const subjectName = subjectObj?.name || 'General Subject';

      let priorityScore = 50;
      let priorityLevel: 'critical' | 'high' | 'medium' | 'low' = 'medium';
      let activityType: TaskActivityType = 'practice';
      let reason = `Active learning gap detected in ${topicName}. Targeted practice required.`;

      if (gap.severity === 'critical') {
        priorityScore = 100;
        priorityLevel = 'critical';
        activityType = 'tutor';
        reason = `Critical conceptual gap in ${topicName}. Review with AI Tutor and complete targeted practice.`;
      } else if (gap.severity === 'high') {
        priorityScore = 85;
        priorityLevel = 'high';
        activityType = 'practice';
        reason = `High-severity gap in ${topicName}. Practice recommended to build competency.`;
      } else if (gap.gapType === 'prerequisite_gap') {
        priorityScore = 75;
        priorityLevel = 'high';
        activityType = 'learn';
        reason = `Prerequisite gap identified in ${topicName}. Strengthen foundational concepts.`;
      } else if (gap.gapType === 'misconception') {
        priorityScore = 70;
        priorityLevel = 'medium';
        activityType = 'tutor';
        reason = `Misconception detected in ${topicName}. Review core principles to correct understanding.`;
      }

      candidateMap.set(topicId, {
        topicId,
        topicName,
        subjectId,
        subjectName,
        priorityScore,
        priorityLevel,
        activityType,
        suggestedMinutes: activityType === 'tutor' ? 20 : 15,
        reason,
        gapSeverity: gap.severity,
      });
    });

    // 2. Process Weak Topic Masteries (<60%)
    masteries.forEach((m) => {
      const topicObj = typeof m.topicId === 'object' && m.topicId !== null ? m.topicId : null;
      const topicId = String(topicObj?._id || m.topicId || '');
      if (!topicId) return;

      const topicName = topicObj?.name || 'Curriculum Topic';
      const subjectObj = typeof topicObj?.subjectId === 'object' ? topicObj.subjectId : null;
      const subjectId = String(subjectObj?._id || topicObj?.subjectId || '');
      const subjectName = subjectObj?.name || 'General Subject';
      const score = m.masteryScore || 0;

      if (score < 60 && !candidateMap.has(topicId)) {
        candidateMap.set(topicId, {
          topicId,
          topicName,
          subjectId,
          subjectName,
          priorityScore: Math.round(60 + (60 - score) * 0.4),
          priorityLevel: score < 40 ? 'high' : 'medium',
          activityType: 'practice',
          suggestedMinutes: 20,
          reason: `Current mastery is ${score}%. Practice to improve competency above 60%.`,
          masteryScore: score,
        });
      } else if (score >= 80 && !candidateMap.has(topicId)) {
        // Revision opportunity for mastered topics
        candidateMap.set(topicId, {
          topicId,
          topicName,
          subjectId,
          subjectName,
          priorityScore: 30,
          priorityLevel: 'low',
          activityType: 'revision',
          suggestedMinutes: 10,
          reason: `Mastery is ${score}%. Quick 10-minute revision to maintain retention.`,
          masteryScore: score,
        });
      }
    });

    // 3. Process Recommended Next Topics
    recommendedTopics.forEach((rec) => {
      const topicId = String(rec._id || rec.id || '');
      if (!topicId || candidateMap.has(topicId)) return;

      const topicName = rec.name || 'Recommended Topic';
      const subjectObj = typeof rec.subjectId === 'object' ? rec.subjectId : null;
      const subjectId = String(subjectObj?._id || rec.subjectId || '');
      const subjectName = subjectObj?.name || 'General Subject';

      candidateMap.set(topicId, {
        topicId,
        topicName,
        subjectId,
        subjectName,
        priorityScore: 45,
        priorityLevel: 'medium',
        activityType: 'learn',
        suggestedMinutes: 20,
        reason: `Recommended next step in curriculum path: ${topicName}.`,
      });
    });

    // Sort descending by priorityScore
    return Array.from(candidateMap.values()).sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * Partitions prioritized topics into daily/weekly tasks respecting daily study time bounds
   */
  public static allocateTime(
    prioritizedItems: PrioritizedTopicItem[],
    dailyMinutesLimit: number,
    duration: StudyPlanDuration
  ): PrioritizedTopicItem[] {
    const safeLimit = Math.max(15, Math.min(300, dailyMinutesLimit || 60));
    const targetTotalMinutes = duration === 'weekly' ? safeLimit * 5 : safeLimit;

    const allocated: PrioritizedTopicItem[] = [];
    let currentTotal = 0;

    for (const item of prioritizedItems) {
      if (currentTotal + item.suggestedMinutes <= targetTotalMinutes) {
        allocated.push(item);
        currentTotal += item.suggestedMinutes;
      } else if (targetTotalMinutes - currentTotal >= 10) {
        // Adjust minutes to fit exact remaining capacity
        const adjustedItem = {
          ...item,
          suggestedMinutes: targetTotalMinutes - currentTotal,
        };
        allocated.push(adjustedItem);
        currentTotal += adjustedItem.suggestedMinutes;
        break;
      }
    }

    return allocated;
  }
}
