import { LearningResource, RecommendationSignal, ResourceExplanation } from './types.js';

export class ResourceAICoach {
  static explainRecommendation(resource: LearningResource, signals: RecommendationSignal[], studentGoal?: string): ResourceExplanation {
    const primarySignal = signals[0]?.reason || `Selected to strengthen topic proficiency in ${resource.topic}.`;

    const whyThisResource = `This ${resource.resourceType} from ${resource.provider} is verified and tailored to your ${resource.difficulty} skill level in ${resource.topic}. ${primarySignal}`;
    
    const whyNow = signals.some((s) => s.type === 'prerequisiteGap')
      ? `You currently have a foundational gap in ${resource.topic}. Master this prerequisite first to unlock advanced material.`
      : `Recommended now to keep steady progress towards your ${resource.subject} mastery target.`;

    const whatToLearnFirst = resource.prerequisites && resource.prerequisites.length > 0
      ? `Review fundamental definitions in ${resource.prerequisites.join(', ')} before attempting detailed problem sets.`
      : `Focus on the key learning objectives: ${resource.learningObjectives.slice(0, 2).join(' and ')}.`;

    const connectionToGoal = studentGoal
      ? `Directly supports your target goal "${studentGoal}" by building core competency in ${resource.topic}.`
      : resource.careerRelevance && resource.careerRelevance.length > 0
      ? `Helps develop essential skills relevant to ${resource.careerRelevance.join(', ')}.`
      : `Builds fundamental academic mastery required for upcoming evaluations.`;

    return {
      resourceId: resource.resourceId,
      whyThisResource,
      whyNow,
      whatToLearnFirst,
      connectionToGoal,
      recommendedDurationMinutes: resource.estimatedMinutes,
    };
  }
}
