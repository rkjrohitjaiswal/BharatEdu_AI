import { ResourceRecommendation } from './types.js';

export class AIResourceCoach {
  static generateGuidance(rec: ResourceRecommendation): {
    headline: string;
    explanation: string;
    prerequisiteTip: string;
    nextStepAdvice: string;
  } {
    const { resource, priority, reason, actionType } = rec;

    let headline = `Recommended: ${resource.title}`;
    let explanation = `This resource was selected because ${reason.primaryReason.toLowerCase()}`;
    let prerequisiteTip = 'Ensure you have reviewed foundational concepts before starting.';
    let nextStepAdvice = `After completing this ${actionType} session, test your understanding with practice questions.`;

    if (priority === 'critical') {
      headline = `Critical Study Need: ${resource.title}`;
      explanation = `Directly targets an active prerequisite learning gap in ${resource.topic}.`;
      prerequisiteTip = 'Mastering this prerequisite is required before advancing in dependent topics.';
    }

    return {
      headline,
      explanation,
      prerequisiteTip,
      nextStepAdvice,
    };
  }
}
