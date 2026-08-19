import { dataRepository } from '../../repositories/data.repository.js';
import { PracticeRecommendationItem } from './types.js';

export class PracticeTopicSelector {
  public static async selectTargetTopic(
    studentId: string,
    requestedSubjectId?: string,
    requestedTopicId?: string
  ): Promise<{ topicId: string; subjectId: string; learningGapId?: string; reason: string; priority: 'critical' | 'high' | 'medium' | 'low' }> {
    const allTopics = await dataRepository.getTopics();
    const allSubjects = await dataRepository.getAllSubjects();
    const activeGaps = await dataRepository.getLearningGaps(studentId);
    const masteries = await dataRepository.getTopicMastery(studentId);

    // Filter topics by requested subject if provided
    let candidateTopics = allTopics;
    if (requestedSubjectId) {
      candidateTopics = candidateTopics.filter(
        (t) => String(t.subjectId?._id || t.subjectId) === String(requestedSubjectId)
      );
    }

    // 1. Explicit Topic requested
    if (requestedTopicId) {
      const match = candidateTopics.find((t) => String(t._id || t.id) === String(requestedTopicId));
      if (match) {
        const subjId = String(match.subjectId?._id || match.subjectId);
        const gap = activeGaps.find(
          (g) => String(g.topicId?._id || g.topicId) === String(match._id || match.id) && g.status === 'active'
        );
        return {
          topicId: String(match._id || match.id),
          subjectId: subjId,
          learningGapId: gap ? String(gap._id || gap.id) : undefined,
          reason: gap ? `Targeted practice for ${gap.gapType.replace('_', ' ')}` : `Selected topic practice: ${match.name}`,
          priority: gap?.severity === 'critical' ? 'critical' : gap?.severity === 'high' ? 'high' : 'medium',
        };
      }
    }

    // 2. Critical or High Active Learning Gaps
    const criticalGap = activeGaps.find(
      (g) => (g.severity === 'critical' || g.severity === 'high') && g.status === 'active'
    );
    if (criticalGap) {
      const tId = String(criticalGap.topicId?._id || criticalGap.topicId);
      const topObj = candidateTopics.find((t) => String(t._id || t.id) === tId);
      if (topObj) {
        return {
          topicId: tId,
          subjectId: String(topObj.subjectId?._id || topObj.subjectId),
          learningGapId: String(criticalGap._id || criticalGap.id),
          reason: `High priority gap detected in ${topObj.name}`,
          priority: criticalGap.severity === 'critical' ? 'critical' : 'high',
        };
      }
    }

    // 3. Misconceptions or Prerequisite Gaps
    const misGap = activeGaps.find(
      (g) => (g.gapType === 'misconception' || g.gapType === 'prerequisite_gap') && g.status === 'active'
    );
    if (misGap) {
      const tId = String(misGap.topicId?._id || misGap.topicId);
      const topObj = candidateTopics.find((t) => String(t._id || t.id) === tId);
      if (topObj) {
        return {
          topicId: tId,
          subjectId: String(topObj.subjectId?._id || topObj.subjectId),
          learningGapId: String(misGap._id || misGap.id),
          reason: misGap.gapType === 'misconception' ? `Clarify misconception in ${topObj.name}` : `Strengthen prerequisite foundation for ${topObj.name}`,
          priority: 'high',
        };
      }
    }

    // 4. Needs Review Topics (mastery < 60%)
    const weakMastery = masteries.find(
      (m) => (m.masteryScore || 0) < 60 && candidateTopics.some((t) => String(t._id || t.id) === String(m.topicId?._id || m.topicId))
    );
    if (weakMastery) {
      const tId = String(weakMastery.topicId?._id || weakMastery.topicId);
      const topObj = candidateTopics.find((t) => String(t._id || t.id) === tId);
      if (topObj) {
        return {
          topicId: tId,
          subjectId: String(topObj.subjectId?._id || topObj.subjectId),
          reason: `Review topic needing practice: ${topObj.name} (${weakMastery.masteryScore}% mastery)`,
          priority: 'medium',
        };
      }
    }

    // 5. Default Fallback: First available topic
    const defaultTopic = candidateTopics[0] || allTopics[0];
    const defaultSubj = allSubjects[0];
    const defaultTopicId = defaultTopic ? String(defaultTopic._id || defaultTopic.id) : 'dummy_topic_id';
    const defaultSubjId = defaultTopic ? String(defaultTopic.subjectId?._id || defaultTopic.subjectId) : String(defaultSubj?._id || defaultSubj?.id);

    return {
      topicId: defaultTopicId,
      subjectId: defaultSubjId,
      reason: defaultTopic ? `Practice ${defaultTopic.name}` : 'General practice session',
      priority: 'low',
    };
  }

  public static async generateRecommendations(studentId: string): Promise<PracticeRecommendationItem[]> {
    const allTopics = await dataRepository.getTopics();
    const activeGaps = await dataRepository.getLearningGaps(studentId);
    const masteries = await dataRepository.getTopicMastery(studentId);
    const recs: PracticeRecommendationItem[] = [];

    // 1. Add recommendations from Active Gaps
    activeGaps.forEach((gap) => {
      if (gap.status === 'active' && gap.topicId) {
        const topName = typeof gap.topicId === 'object' ? gap.topicId.name : 'Topic';
        const subjName = typeof gap.topicId === 'object' && gap.topicId.subjectId ? (typeof gap.topicId.subjectId === 'object' ? gap.topicId.subjectId.name : 'Subject') : 'Core Subject';
        recs.push({
          topicId: String(typeof gap.topicId === 'object' ? gap.topicId._id || gap.topicId.id : gap.topicId),
          topicName: topName,
          subjectName: subjName,
          reason: gap.evidence || `Address ${gap.gapType.replace('_', ' ')}`,
          priority: gap.severity === 'critical' ? 'critical' : gap.severity === 'high' ? 'high' : 'medium',
          recommendedDifficulty: gap.severity === 'critical' ? 'easy' : 'medium',
          estimatedQuestions: 5,
          learningGapId: String(gap._id || gap.id),
        });
      }
    });

    // 2. Add Needs-Review Topics
    masteries.forEach((m) => {
      if ((m.masteryScore || 0) < 60 && m.topicId) {
        const tId = String(typeof m.topicId === 'object' ? m.topicId._id || m.topicId.id : m.topicId);
        if (!recs.some((r) => r.topicId === tId)) {
          const topName = typeof m.topicId === 'object' ? m.topicId.name : 'Topic';
          const subjName = typeof m.topicId === 'object' && m.topicId.subjectId ? (typeof m.topicId.subjectId === 'object' ? m.topicId.subjectId.name : 'Subject') : 'Core Subject';
          recs.push({
            topicId: tId,
            topicName: topName,
            subjectName: subjName,
            reason: `Mastery is ${m.masteryScore}%. Practice to improve fluency.`,
            priority: 'medium',
            recommendedDifficulty: m.masteryScore < 40 ? 'easy' : 'medium',
            estimatedQuestions: 5,
          });
        }
      }
    });

    // 3. Fallback topics if recs empty
    if (recs.length === 0 && allTopics.length > 0) {
      const top = allTopics[0];
      const subjName = typeof top.subjectId === 'object' ? top.subjectId.name : 'Mathematics';
      recs.push({
        topicId: String(top._id || top.id),
        topicName: top.name,
        subjectName: subjName,
        reason: 'Recommended core curriculum practice session.',
        priority: 'low',
        recommendedDifficulty: 'medium',
        estimatedQuestions: 5,
      });
    }

    return recs;
  }
}
