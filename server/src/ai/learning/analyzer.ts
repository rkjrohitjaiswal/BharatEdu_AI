import { dataRepository } from '../../repositories/data.repository.js';
import {
  LearningEvidencePayload,
  LearningAnalysisResult,
  DetectedGapType,
  GapSeverity,
} from './types.js';
import {
  calculateMasteryScore,
  calculateConfidenceScore,
  determineGapSeverity,
} from './rules.js';
import { MisconceptionAnalyzer } from './misconception.analyzer.js';

export class LearningIntelligenceEngine {
  public static async processLearningEvidence(
    payload: LearningEvidencePayload
  ): Promise<LearningAnalysisResult> {
    const { studentId, topicId, evidenceId, analysisType, isCorrect, studentAnswer } = payload;

    // 1. Idempotency Check (Prevent duplicate analysis for same evidenceId)
    const existingEvent = await dataRepository.getLearningAnalysisEventByEvidenceId(evidenceId);
    if (existingEvent) {
      console.log(`ℹ️ [LearningEngine] Evidence ID "${evidenceId}" already processed. Returning cached result.`);
      return {
        topicId: String(existingEvent.topicId),
        masteryScore: 50,
        masteryStatus: 'learning',
        confidenceScore: existingEvent.confidence,
        detectedGapType: existingEvent.detectedGapType as DetectedGapType,
        severity: existingEvent.severity as GapSeverity,
        gapConfidence: existingEvent.confidence,
        evidenceSummary: existingEvent.evidenceSummary,
        recommendedAction: existingEvent.recommendedAction,
      };
    }

    // 2. Fetch Existing Mastery & Topic Details
    const existingMasteryList = await dataRepository.getTopicMastery(studentId);
    const currentTopicMastery = existingMasteryList.find(
      (m) => String(m.topicId?._id || m.topicId) === String(topicId)
    );

    const attempts = (currentTopicMastery?.attempts || 0) + 1;
    const correctAttempts = (currentTopicMastery?.correctAttempts || 0) + (isCorrect ? 1 : 0);
    const incorrectAttempts = (currentTopicMastery?.incorrectAttempts || 0) + (isCorrect ? 0 : 1);

    const { masteryScore, status: masteryStatus } = calculateMasteryScore(
      currentTopicMastery?.masteryScore || 0,
      attempts,
      correctAttempts,
      isCorrect
    );

    const confidenceScore = calculateConfidenceScore(
      attempts,
      attempts > 0 ? (correctAttempts / attempts) * 100 : 0
    );

    // Save Updated Topic Mastery
    await dataRepository.upsertTopicMastery(studentId, topicId, {
      attempts,
      correctAttempts,
      incorrectAttempts,
      masteryScore,
      confidenceScore,
      status: masteryStatus,
      lastAttemptAt: new Date(),
    });

    // 3. Evaluate Prerequisite & Topic Context
    const allTopics = await dataRepository.getTopics();
    const targetTopic = allTopics.find((t) => String(t._id || t.id) === String(topicId));

    let hasPrerequisiteWeakness = false;
    let weakPrereqName = '';

    if (targetTopic && targetTopic.prerequisiteTopicIds && targetTopic.prerequisiteTopicIds.length > 0) {
      for (const prereqId of targetTopic.prerequisiteTopicIds) {
        const pIdStr = typeof prereqId === 'object' ? String((prereqId as any)._id || (prereqId as any).id) : String(prereqId);
        const pMastery = existingMasteryList.find((m) => String(m.topicId?._id || m.topicId) === pIdStr);
        if (!pMastery || (pMastery.masteryScore || 0) < 50) {
          hasPrerequisiteWeakness = true;
          const pTopic = allTopics.find((t) => String(t._id || t.id) === pIdStr);
          weakPrereqName = pTopic?.name || 'Prerequisite Topic';
          break;
        }
      }
    }

    // 4. Determine Gap Classification & Severity
    let detectedGapType: DetectedGapType = 'none';
    let severity: GapSeverity = 'low';
    let gapConfidence = confidenceScore;
    let evidenceSummary = 'Student performance is on track.';
    let recommendedAction = {
      type: 'continue_learning',
      reason: 'Keep practicing to reinforce mastery.',
    };

    if (!isCorrect) {
      if (hasPrerequisiteWeakness) {
        detectedGapType = 'prerequisite_gap';
        severity = incorrectAttempts >= 3 ? 'critical' : 'high';
        gapConfidence = 0.85;
        evidenceSummary = `Difficulty in ${targetTopic?.name || 'topic'} stems from weak foundation in prerequisite: ${weakPrereqName}.`;
        recommendedAction = {
          type: 'review_prerequisite',
          reason: `Review fundamental concepts in ${weakPrereqName} before continuing with ${targetTopic?.name || 'this topic'}.`,
        };
      } else if (incorrectAttempts >= 2 && masteryScore < 50) {
        detectedGapType = 'knowledge_gap';
        severity = determineGapSeverity(masteryScore, incorrectAttempts, hasPrerequisiteWeakness);
        gapConfidence = 0.8;
        evidenceSummary = `Student demonstrates low mastery (${masteryScore}%) across ${incorrectAttempts} incorrect attempts in ${targetTopic?.name || 'topic'}.`;
        recommendedAction = {
          type: 'review_concept',
          reason: `Review core lessons and study notes for ${targetTopic?.name || 'this topic'}.`,
        };
      } else {
        // Semantic Misconception Check via LLM (if answer text provided)
        if (studentAnswer && studentAnswer.trim().length > 0) {
          const semRes = await MisconceptionAnalyzer.analyzeSemanticMisconception(
            targetTopic?.name || 'Curriculum Topic',
            studentAnswer
          );

          if (semRes && semRes.isMisconception && semRes.confidence >= 0.6) {
            detectedGapType = 'misconception';
            severity = 'medium';
            gapConfidence = semRes.confidence;
            evidenceSummary = semRes.evidence || `Conceptual misconception detected: ${semRes.misconception}`;
            recommendedAction = {
              type: 'clarify_misconception',
              reason: semRes.recommendedAction || `Ask the AI Tutor to clarify ${semRes.concept}.`,
            };
          }
        }

        // If no misconception detected, classify as practice gap
        if (detectedGapType === 'none') {
          detectedGapType = 'practice_gap';
          severity = 'low';
          gapConfidence = 0.7;
          evidenceSummary = `Student understands core principles but requires additional practice to build fluency.`;
          recommendedAction = {
            type: 'practice',
            reason: `Complete 5 additional practice questions for ${targetTopic?.name || 'this topic'}.`,
          };
        }
      }
    } else {
      // Correct answer check: check if an existing gap should be marked improving or resolved
      if (masteryScore >= 80) {
        await dataRepository.resolveLearningGap(studentId, topicId);
      }
    }

    // 5. Save Learning Gap Record if a gap was detected
    if (detectedGapType !== 'none') {
      await dataRepository.upsertLearningGap(studentId, {
        topicId: topicId as any,
        gapType: detectedGapType,
        severity,
        confidence: gapConfidence,
        evidence: evidenceSummary,
        status: 'active',
      });
    }

    // 6. Update Learning Profile Aggregations
    const allStudentMasteries = await dataRepository.getTopicMastery(studentId);
    const avgMastery = allStudentMasteries.length > 0
      ? Math.round(allStudentMasteries.reduce((sum, m) => sum + (m.masteryScore || 0), 0) / allStudentMasteries.length)
      : masteryScore;

    const activeGaps = await dataRepository.getLearningGaps(studentId);

    const strengths = allStudentMasteries
      .filter((m) => (m.masteryScore || 0) >= 80 && m.topicId)
      .map((m) => (typeof m.topicId === 'object' ? m.topicId.name : 'Mastered Topic'));

    const weaknesses = activeGaps
      .filter((g) => g.status === 'active')
      .map((g) => (typeof g.topicId === 'object' ? g.topicId.name : 'Topic Needing Attention'));

    await dataRepository.updateLearningProfileData(studentId, {
      overallMastery: avgMastery,
      confidenceScore,
      strengths: Array.from(new Set(strengths)).slice(0, 5),
      weaknesses: Array.from(new Set(weaknesses)).slice(0, 5),
      lastAssessmentDate: new Date(),
    });

    // 7. Record Learning Analysis Event History
    const result: LearningAnalysisResult = {
      topicId,
      masteryScore,
      masteryStatus,
      confidenceScore,
      detectedGapType,
      severity,
      gapConfidence,
      evidenceSummary,
      recommendedAction,
    };

    await dataRepository.createLearningAnalysisEvent({
      studentId: studentId as any,
      topicId: topicId as any,
      evidenceId,
      analysisType,
      isCorrect,
      studentAnswer: studentAnswer || '',
      detectedGapType,
      severity,
      confidence: gapConfidence,
      evidenceSummary,
      recommendedAction,
    });

    return result;
  }
}
