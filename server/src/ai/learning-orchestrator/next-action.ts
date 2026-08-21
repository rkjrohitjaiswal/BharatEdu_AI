import { OrchestrationActionItem } from './types.js';

export class NextActionEngine {
  static selectNextBestAction(executableActions: OrchestrationActionItem[]): OrchestrationActionItem {
    if (executableActions.length > 0) {
      return executableActions[0];
    }

    return {
      actionId: `act_fallback_${Date.now()}`,
      studentId: 'student_1',
      actionType: 'study',
      sourceFeature: 'orchestrator',
      conceptId: 'math_quadratic',
      topic: 'Quadratic Equations',
      title: 'Study NCERT Chapter 4: Quadratic Equations',
      description: 'Review foundational quadratic equation concepts.',
      priority: 'high',
      priorityScore: 85,
      estimatedMinutes: 20,
      reason: 'Your next best action is to resolve the active prerequisite gap in Quadratic Equations.',
      actionUrl: '/resources',
      status: 'recommended',
      createdAt: new Date(),
    };
  }
}
