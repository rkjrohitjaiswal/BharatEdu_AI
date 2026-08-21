import { OrchestrationSignal, OrchestrationActionItem, OrchestrationPriority } from './types.js';

export class PriorityEngine {
  static scoreAndRankSignals(signals: OrchestrationSignal[], studentId: string): OrchestrationActionItem[] {
    const actions: OrchestrationActionItem[] = signals.map((sig, idx) => {
      let priorityScore = sig.urgency * 0.4 + sig.impact * 0.4 + sig.confidence * 0.2;

      // 1. Root Prerequisite Gap Boost
      if (sig.signalType === 'root_prerequisite_gap') {
        priorityScore += 30;
      }

      // 2. Risk Recovery Boost
      if (sig.signalType === 'risk_recovery') {
        priorityScore += 25;
      }

      // 3. Exam Weak Concept Boost
      if (sig.signalType === 'exam_weak_concept' && sig.examRelevance) {
        priorityScore += 20;
      }

      // 4. Revision Due Boost
      if (sig.signalType === 'revision_due') {
        priorityScore += 15;
      }

      const finalScore = Math.min(100, Math.max(10, Math.round(priorityScore)));

      let priority: OrchestrationPriority = 'medium';
      if (finalScore >= 85) priority = 'critical';
      else if (finalScore >= 70) priority = 'high';
      else if (finalScore < 45) priority = 'low';

      const actionId = `act_${Date.now()}_${idx}`;
      let actionUrl = '/practice';
      if (sig.recommendedActionType === 'study') actionUrl = '/resources';
      else if (sig.recommendedActionType === 'revise') actionUrl = '/smart-revision';
      else if (sig.recommendedActionType === 'mock_exam') actionUrl = '/exam-preparation';
      else if (sig.recommendedActionType === 'doubt') actionUrl = '/doubts';
      else if (sig.recommendedActionType === 'learning_path') actionUrl = '/learning-path';

      return {
        actionId,
        studentId,
        actionType: sig.recommendedActionType,
        sourceFeature: sig.source,
        conceptId: sig.conceptId,
        topic: sig.topic,
        title: `Targeted ${sig.topic}`,
        description: sig.reason,
        priority,
        priorityScore: finalScore,
        estimatedMinutes: sig.effortMinutes,
        reason: sig.reason,
        actionUrl,
        status: 'recommended',
        createdAt: new Date(),
      };
    });

    // Sort descending by priorityScore
    actions.sort((a, b) => b.priorityScore - a.priorityScore);
    return actions;
  }
}
