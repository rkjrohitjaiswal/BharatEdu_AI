import { dataRepository } from '../../repositories/data.repository.js';
import { CoachRulesEngine } from './rules.js';
import { AIEnricher } from './ai-enricher.js';
import { CoachRecommendation, CoachPlanPayload } from './types.js';

export class AILearningCoach {
  public static async generateDailyPlan(studentId: string): Promise<CoachPlanPayload> {
    // 1. Gather student data
    const [
      profile,
      learningProfile,
      masteryList,
      gapsList,
      mistakesList,
      practiceSessions,
      studyPlan,
      userDoc,
    ] = await Promise.all([
      dataRepository.getStudentScholarshipProfile(studentId),
      dataRepository.getLearningProfile(studentId),
      dataRepository.getTopicMastery(studentId),
      dataRepository.getLearningGaps(studentId),
      dataRepository.getStudentMistakes(studentId, 5),
      dataRepository.getPracticeSessions(studentId),
      dataRepository.getStudentStudyPlan(studentId),
      dataRepository.getUserById(studentId),
    ]);

    const studentName = userDoc?.name || 'Student';
    const preferredLanguage = userDoc?.preferredLanguage || 'english';
    const availableMinutes = 30; // Default daily time budget

    const overallMastery = learningProfile?.overallMastery ?? 50;

    // Calculate recent accuracy from practice sessions
    let recentAccuracy = 75;
    if (practiceSessions && practiceSessions.length > 0) {
      const recent = practiceSessions.slice(0, 5);
      const totalQ = recent.reduce((sum: number, s: any) => sum + (s.completedQuestions || 0), 0);
      const totalC = recent.reduce((sum: number, s: any) => sum + (s.correctAnswers || 0), 0);
      if (totalQ > 0) {
        recentAccuracy = Math.round((totalC / totalQ) * 100);
      }
    }

    const activeGaps = (gapsList || []).filter((g: any) => g.status === 'active');
    const criticalGapsCount = activeGaps.filter((g: any) => g.severity === 'critical').length;
    const highGapsCount = activeGaps.filter((g: any) => g.severity === 'high').length;
    const streak = Math.min(10, practiceSessions?.length || 1);

    // 2. Calculate Readiness Score
    const readiness = CoachRulesEngine.calculateReadiness({
      overallMastery,
      recentAccuracy,
      criticalGapsCount,
      highGapsCount,
      streak,
    });

    // 3. Build candidate recommendations across 10 tiers
    const candidateList: CoachRecommendation[] = [];

    // Tier 1: Critical Learning Gaps
    activeGaps
      .filter((g: any) => g.severity === 'critical')
      .forEach((g: any, idx: number) => {
        const topicName = typeof g.topicId === 'object' && g.topicId !== null ? g.topicId.name : 'Core Concept';
        candidateList.push({
          id: `rec_crit_${idx}_${Date.now()}`,
          type: 'critical_gap',
          priority: 'CRITICAL',
          subject: 'Core Subject',
          topic: topicName,
          title: `Resolve Critical Gap in ${topicName}`,
          reason: `High error rate detected in ${topicName}. Immediate practice required.`,
          estimatedMinutes: 10,
          action: 'practice',
          targetRoute: '/practice',
          payload: { gapId: g._id || g.id, topicId: g.topicId?._id || g.topicId },
        });
      });

    // Tier 2: High Severity Gaps
    activeGaps
      .filter((g: any) => g.severity === 'high')
      .forEach((g: any, idx: number) => {
        const topicName = typeof g.topicId === 'object' && g.topicId !== null ? g.topicId.name : 'Subject Concept';
        candidateList.push({
          id: `rec_high_${idx}_${Date.now()}`,
          type: 'high_gap',
          priority: 'HIGH',
          subject: 'Core Subject',
          topic: topicName,
          title: `Clear Concept Hurdle in ${topicName}`,
          reason: `Active learning gap in ${topicName}. AI Tutor session recommended.`,
          estimatedMinutes: 8,
          action: 'tutor',
          targetRoute: '/tutor',
          payload: { gapId: g._id || g.id },
        });
      });

    // Tier 5: Recent Mistakes
    if (mistakesList && mistakesList.length > 0) {
      const firstMistake = mistakesList[0];
      candidateList.push({
        id: `rec_mistake_${Date.now()}`,
        type: 'recent_mistake',
        priority: 'MEDIUM',
        subject: firstMistake.subjectName || 'General',
        topic: firstMistake.topicName || 'Recent Practice',
        title: `Review Recent Mistake in ${firstMistake.topicName || 'Practice'}`,
        reason: 'Review your recent incorrect answers to prevent repeating misconception patterns.',
        estimatedMinutes: 7,
        action: 'mistake_review',
        targetRoute: '/mistakes',
      });
    }

    // Tier 6: Weak Mastery Topics (< 60%)
    (masteryList || [])
      .filter((m: any) => m.masteryScore < 60)
      .forEach((m: any, idx: number) => {
        const topicName = typeof m.topicId === 'object' && m.topicId !== null ? m.topicId.name : 'Foundation Topic';
        candidateList.push({
          id: `rec_weak_${idx}_${Date.now()}`,
          type: 'weak_mastery',
          priority: 'MEDIUM',
          subject: 'Curriculum',
          topic: topicName,
          title: `Strengthen Mastery in ${topicName}`,
          reason: `Current mastery is ${m.masteryScore}%. Solve 5 practice questions to reach 75%+`,
          estimatedMinutes: 8,
          action: 'practice',
          targetRoute: '/practice',
          payload: { topicId: m.topicId?._id || m.topicId },
        });
      });

    // Tier 7: Incomplete Study Plan Tasks
    if (studyPlan && studyPlan.tasks) {
      const pendingTask = studyPlan.tasks.find((t: any) => !t.completed);
      if (pendingTask) {
        candidateList.push({
          id: `rec_study_${Date.now()}`,
          type: 'study_plan_task',
          priority: 'MEDIUM',
          subject: pendingTask.subjectName || 'Daily Plan',
          topic: pendingTask.topicName || 'Scheduled Task',
          title: pendingTask.title,
          reason: 'Daily scheduled study plan activity.',
          estimatedMinutes: pendingTask.estimatedMinutes || 7,
          action: 'study_plan',
          targetRoute: '/dashboard',
          payload: { taskId: pendingTask._id || pendingTask.id },
        });
      }
    }

    // Tier 8: Recommended Topics
    const recTopics = (learningProfile?.recommendedTopics || []).filter(
      (t: any) => typeof t === 'object' && t !== null
    );
    recTopics.forEach((t: any, idx: number) => {
      candidateList.push({
        id: `rec_rec_${idx}_${Date.now()}`,
        type: 'recommended_topic',
        priority: 'LOW',
        subject: t.subjectName || 'Curriculum',
        topic: t.name || 'Recommended Topic',
        title: `Explore ${t.name || 'Next Topic'}`,
        reason: 'Recommended next topic based on your learning progression.',
        estimatedMinutes: 8,
        action: 'practice',
        targetRoute: '/practice',
      });
    });

    // Fallback default recommendation if list is sparse
    if (candidateList.length === 0) {
      candidateList.push({
        id: `rec_default_${Date.now()}`,
        type: 'enrichment',
        priority: 'LOW',
        subject: 'General Curriculum',
        topic: 'Daily Practice',
        title: 'Complete Daily Adaptive Practice Session',
        reason: 'Regular 15-minute daily practice keeps your learning readiness high.',
        estimatedMinutes: 15,
        action: 'practice',
        targetRoute: '/practice',
      });
    }

    // 4. Prioritize and pack within available time budget
    const packedRecommendations = CoachRulesEngine.prioritizeAndPack(candidateList, availableMinutes);
    const completedMinutes = 0;
    const plannedMinutes = packedRecommendations.reduce((sum, r) => sum + r.estimatedMinutes, 0);

    // 5. Enrich with AI / Fallback templates
    const enrichment = await AIEnricher.enrichCoachPlan({
      studentName,
      preferredLanguage,
      readiness,
      recommendations: packedRecommendations,
      availableMinutes,
    });

    return {
      date: new Date().toISOString().split('T')[0],
      greeting: enrichment.greeting,
      readiness,
      dailyGoal: enrichment.dailyGoal,
      availableMinutes,
      completedMinutes,
      remainingMinutes: Math.max(0, availableMinutes - plannedMinutes),
      recommendations: packedRecommendations,
      streak,
      motivation: enrichment.motivation,
      aiEnhanced: enrichment.aiEnhanced,
    };
  }
}
