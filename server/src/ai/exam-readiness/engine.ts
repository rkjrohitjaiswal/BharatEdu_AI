import { dataRepository } from '../../repositories/data.repository.js';
import { ExamReadinessRules } from './rules.js';
import {
  ExamReadinessResult,
  SubjectReadinessDetail,
  TopicReadinessDetail,
} from './types.js';

export class ExamReadinessEngine {
  /**
   * Evaluates overall exam readiness deterministically from authoritative DB data
   */
  static async evaluateExamReadiness(
    studentId: string,
    examId: string
  ): Promise<ExamReadinessResult | null> {
    const exam = await dataRepository.getExamPreparationById(studentId, examId);
    if (!exam) return null;

    const { daysRemaining, category: daysCategory } = ExamReadinessRules.calculateDaysRemaining(
      exam.examDate
    );

    // Fetch student's authoritative data
    const [allMastery, allGaps, allSessions, studyPlan] = await Promise.all([
      dataRepository.getTopicMastery(studentId),
      dataRepository.getStudentGaps(studentId),
      dataRepository.getPracticeSessions(studentId),
      dataRepository.getStudyPlan(studentId),
    ]);

    const activeGaps = (allGaps || []).filter((g: any) => g.status === 'active');
    const gapsCount = {
      critical: activeGaps.filter((g: any) => g.severity === 'critical').length,
      high: activeGaps.filter((g: any) => g.severity === 'high').length,
      medium: activeGaps.filter((g: any) => g.severity === 'medium').length,
    };

    // Calculate practice accuracy & consistency
    const completedSessions = (allSessions || []).filter((s: any) => s.status === 'completed');
    let totalQuestions = 0;
    let totalCorrect = 0;
    completedSessions.forEach((s: any) => {
      totalQuestions += s.completedQuestions || 1;
      totalCorrect += s.correctAnswers || 1;
    });
    const practiceAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 75;

    // Consistency score (0-10)
    const consistencyScore = Math.min(10, Math.round(((allSessions?.length || 1) / 7) * 10));

    // Study plan completion %
    let studyPlanCompletionPercent = 50;
    if (studyPlan && studyPlan.tasks && studyPlan.tasks.length > 0) {
      const completedTasks = studyPlan.tasks.filter((t: any) => t.completed).length;
      studyPlanCompletionPercent = Math.round((completedTasks / studyPlan.tasks.length) * 100);
    }

    const subjectReadiness: SubjectReadinessDetail[] = [];
    const allTopicDetails: TopicReadinessDetail[] = [];
    let sumMastery = 0;
    let sumConfidence = 0;
    let totalTopicCount = 0;

    for (const subConfig of exam.subjects) {
      const subIdStr = String(subConfig.subjectId);
      const subName = subConfig.subjectName;

      // Filter mastery for topics in this subject
      const subMasteryItems = (allMastery || []).filter((m: any) => {
        const topicObj = typeof m.topicId === 'object' ? m.topicId : null;
        if (topicObj && topicObj.subjectId) {
          return String(topicObj.subjectId) === subIdStr;
        }
        return true;
      });

      let subMasterySum = 0;
      let subConfidenceSum = 0;
      let subWeakCount = 0;
      const subTopicCount = Math.max(1, subMasteryItems.length);

      subMasteryItems.forEach((mItem: any) => {
        const tObj = typeof mItem.topicId === 'object' ? mItem.topicId : null;
        const topicIdStr = String(tObj?._id || mItem.topicId || 'topic_1');
        const topicNameStr = tObj?.name || `Topic ${topicIdStr}`;
        const masteryScore = mItem.masteryScore ?? 50;
        const confidenceScore = mItem.confidenceScore ?? 0.6;

        subMasterySum += masteryScore;
        subConfidenceSum += confidenceScore;
        sumMastery += masteryScore;
        sumConfidence += confidenceScore;
        totalTopicCount++;

        const matchingGap = activeGaps.find((g: any) => String(g.topicId?._id || g.topicId) === topicIdStr);
        const gapSeverity = matchingGap?.severity;

        const { priority, readinessLevel, reason } = ExamReadinessRules.evaluateTopicPriority({
          masteryScore,
          confidenceScore,
          gapSeverity,
          recentMistakesCount: matchingGap ? 1 : 0,
          daysRemaining,
        });

        if (readinessLevel === 'weak' || readinessLevel === 'developing') {
          subWeakCount++;
        }

        allTopicDetails.push({
          topicId: topicIdStr,
          topicName: topicNameStr,
          subjectId: subIdStr,
          subjectName: subName,
          masteryScore,
          confidenceScore,
          readinessLevel,
          priority,
          reason,
          activeGapSeverity: gapSeverity,
          recentMistakesCount: matchingGap ? 1 : 0,
        });
      });

      const subAvgMastery = Math.round(subMasterySum / subTopicCount);
      const subAvgConfidence = subConfidenceSum / subTopicCount;
      const subScore = Math.min(100, Math.max(0, Math.round(subAvgMastery * 0.7 + subAvgConfidence * 30)));
      const subLevel = ExamReadinessRules.classifyReadinessScore(subScore);

      subjectReadiness.push({
        subjectId: subIdStr,
        subjectName: subName,
        readinessScore: subScore,
        readinessLevel: subLevel,
        masteryAverage: subAvgMastery,
        topicsCount: subTopicCount,
        weakTopicsCount: subWeakCount,
      });
    }

    const averageMastery = totalTopicCount > 0 ? Math.round(sumMastery / totalTopicCount) : 60;
    const averageConfidence = totalTopicCount > 0 ? sumConfidence / totalTopicCount : 0.65;

    // Calculate overall weighted score
    const { score: overallReadinessScore, breakdown: scoreBreakdown } = ExamReadinessRules.calculateWeightedScore({
      averageMastery,
      practiceAccuracy,
      averageConfidence,
      consistencyScore,
      activeGapsCount: gapsCount,
      studyPlanCompletionPercent,
    });

    const readinessLevel = ExamReadinessRules.classifyReadinessScore(overallReadinessScore);

    // Filter critical & high priority topics
    const criticalTopics = allTopicDetails.filter((t) => t.priority === 'critical');
    const highPriorityTopics = allTopicDetails.filter((t) => t.priority === 'high');

    const recentMistakesCount = activeGaps.length;

    // Generate recommendations
    const recommendations: string[] = [];
    if (criticalTopics.length > 0) {
      recommendations.push(`Prioritize reviewing ${criticalTopics.length} critical topic(s) with active learning gaps.`);
    }
    if (daysRemaining <= 14) {
      recommendations.push(`Exam is in ${daysRemaining} days. Complete targeted practice sessions daily.`);
    } else {
      recommendations.push(`Maintain regular practice consistency to build mastery.`);
    }
    if (studyPlanCompletionPercent < 80) {
      recommendations.push(`Complete scheduled tasks in your study plan to boost readiness.`);
    }

    const explanation = `Your readiness score is ${overallReadinessScore} (${readinessLevel.toUpperCase()}). ` +
      `Mastery contributes ${scoreBreakdown.masteryContribution} pts, practice accuracy ${scoreBreakdown.practiceAccuracyContribution} pts, ` +
      `confidence ${scoreBreakdown.confidenceContribution} pts, consistency ${scoreBreakdown.consistencyContribution} pts, ` +
      `gap health ${scoreBreakdown.gapHealthContribution} pts, and study plan ${scoreBreakdown.studyPlanContribution} pts.`;

    return {
      examId,
      studentId,
      title: exam.title,
      examDate: exam.examDate.toISOString(),
      daysRemaining,
      daysCategory,
      readinessScore: overallReadinessScore,
      readinessLevel,
      scoreBreakdown,
      subjectReadiness,
      criticalTopics,
      highPriorityTopics,
      recentMistakesCount,
      recommendations,
      explanation,
      aiEnhanced: false,
    };
  }
}
