import { OrchestrationActionItem, OrchestrationInsight } from './types.js';

export class AIOrchestratorCoach {
  static generateInsight(
    nextAction: OrchestrationActionItem,
    overallStatus: 'on_track' | 'needs_attention' | 'high_priority' | 'critical'
  ): OrchestrationInsight {
    let headline = `Recommended Focus: ${nextAction.title}`;
    let explanation = `This action is prioritized because ${nextAction.reason.toLowerCase()}`;
    let keyActionRecommendation = `Spend ${nextAction.estimatedMinutes} minutes to complete this ${nextAction.actionType} task.`;
    let prerequisiteAlert: string | undefined = undefined;
    let examStrategyTip: string | undefined = undefined;

    if (nextAction.sourceFeature === 'knowledge_graph') {
      prerequisiteAlert = `Prerequisite alert: ${nextAction.topic} is required for dependent topics on your learning path.`;
    }

    if (nextAction.sourceFeature === 'exam_preparation') {
      examStrategyTip = 'High board exam weightage topic. Practice under timed test conditions.';
    }

    return {
      headline,
      explanation,
      keyActionRecommendation,
      prerequisiteAlert,
      examStrategyTip,
    };
  }
}
