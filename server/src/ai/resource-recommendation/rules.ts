import { RecommendationContext, RecommendationPriority } from '../../models/resource-recommendation.model.js';
import { ResourceCandidate, StudentResourceContext } from './types.js';

export function evaluateRecommendationPriorityAndContext(
  candidate: ResourceCandidate,
  context: StudentResourceContext,
  score: number
): { priority: RecommendationPriority; recommendationContext: RecommendationContext; reason: string } {
  // CRITICAL
  if (context.prerequisiteGaps.includes(candidate.conceptId)) {
    return {
      priority: 'critical',
      recommendationContext: 'prerequisite',
      reason: `Critical prerequisite gap detected in '${candidate.conceptId}'. Learn this before advancing.`,
    };
  }

  if (context.daysUntilExam <= 7 && context.examCriticalConcepts.includes(candidate.conceptId)) {
    return {
      priority: 'critical',
      recommendationContext: 'exam',
      reason: `Urgent exam preparation for high-yield topic '${candidate.topicId}' (Exam in ${context.daysUntilExam} days).`,
    };
  }

  if (context.isHighRisk && context.weakConceptIds.includes(candidate.conceptId)) {
    return {
      priority: 'critical',
      recommendationContext: 'risk',
      reason: `High-risk early warning: Foundational support recommended for concept '${candidate.topicId}'.`,
    };
  }

  // HIGH
  if (context.weakConceptIds.includes(candidate.conceptId)) {
    return {
      priority: 'high',
      recommendationContext: 'learning_gap',
      reason: `Recommended to resolve active learning gap in '${candidate.topicId}'.`,
    };
  }

  if (context.unresolvedDoubtConcepts.includes(candidate.conceptId)) {
    return {
      priority: 'high',
      recommendationContext: 'doubt',
      reason: `Recommended because you recently asked an unresolved doubt regarding '${candidate.topicId}'.`,
    };
  }

  if (context.recentMistakeConcepts.includes(candidate.conceptId)) {
    return {
      priority: 'high',
      recommendationContext: 'mistake',
      reason: `Targets recurring mistakes identified in recent practice tests for '${candidate.topicId}'.`,
    };
  }

  // MEDIUM
  if (context.dueRevisionConceptIds.includes(candidate.conceptId)) {
    return {
      priority: 'medium',
      recommendationContext: 'revision',
      reason: `Recommended for Smart Revision spaced repetition review.`,
    };
  }

  if (context.activeGoalConcepts.includes(candidate.conceptId)) {
    return {
      priority: 'medium',
      recommendationContext: 'goal',
      reason: `Directly aligns with your active learning goal for '${candidate.topicId}'.`,
    };
  }

  if (context.nextConceptId === candidate.conceptId) {
    return {
      priority: 'medium',
      recommendationContext: 'learning_path',
      reason: `Next recommended stage on your personalized Learning Path.`,
    };
  }

  if (candidate.careerTags.some((tag) => context.careerTags.includes(tag))) {
    return {
      priority: 'medium',
      recommendationContext: 'career',
      reason: `Develops core competencies for your target career roadmap.`,
    };
  }

  // LOW
  return {
    priority: 'low',
    recommendationContext: 'general',
    reason: `Recommended general curriculum reference material for '${candidate.topicId}'.`,
  };
}
