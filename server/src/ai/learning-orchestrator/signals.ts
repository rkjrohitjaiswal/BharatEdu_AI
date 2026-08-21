import { StudentIntelligenceSnapshot, OrchestrationSignal } from './types.js';

export class SignalNormalizationEngine {
  static extractSignals(snapshot: StudentIntelligenceSnapshot): OrchestrationSignal[] {
    const signals: OrchestrationSignal[] = [];

    // 1. Root Prerequisite Gap Signal (Knowledge Graph)
    snapshot.rootGaps.forEach((conceptId) => {
      signals.push({
        source: 'knowledge_graph',
        signalType: 'root_prerequisite_gap',
        conceptId,
        topic: 'Prerequisite Concept Repair',
        recommendedActionType: 'study',
        urgency: 95,
        impact: 90,
        confidence: 95,
        effortMinutes: 20,
        reason: 'Critical root prerequisite gap blocking downstream concept progression.',
        examRelevance: true,
      });
    });

    // 2. Risk Recovery Signal (Risk Prediction)
    if (snapshot.riskLevel === 'high' || snapshot.riskLevel === 'critical') {
      signals.push({
        source: 'risk_prediction',
        signalType: 'risk_recovery',
        conceptId: snapshot.weakConcepts[0] || 'math_quadratic',
        topic: 'Academic Recovery Remediation',
        recommendedActionType: 'recovery',
        urgency: 90,
        impact: 88,
        confidence: 90,
        effortMinutes: 15,
        reason: 'High risk index detected. Immediate foundational micro-remediation required.',
      });
    }

    // 3. Exam Readiness Signal (Exam Prep)
    if (snapshot.upcomingExam && snapshot.upcomingExam.daysRemaining <= 30) {
      signals.push({
        source: 'exam_preparation',
        signalType: 'exam_weak_concept',
        conceptId: snapshot.weakConcepts[0] || 'math_quadratic',
        topic: 'Board Exam Focused Practice',
        recommendedActionType: 'mock_exam',
        urgency: 85,
        impact: 92,
        confidence: 90,
        effortMinutes: 30,
        reason: `Board exam is in ${snapshot.upcomingExam.daysRemaining} days. High weightage practice required.`,
        examRelevance: true,
      });
    }

    // 4. Smart Revision Signal (Smart Revision)
    snapshot.revisionDueItems.forEach((item) => {
      signals.push({
        source: 'smart_revision',
        signalType: 'revision_due',
        conceptId: item.conceptId,
        topic: item.topic,
        recommendedActionType: 'revise',
        urgency: 80,
        impact: 85,
        confidence: 92,
        effortMinutes: 15,
        reason: 'Spaced repetition memory review due for topic retention.',
      });
    });

    // 5. Learning Path Stage Signal (Learning Path)
    if (snapshot.activeLearningPathStage) {
      signals.push({
        source: 'learning_path',
        signalType: 'next_stage_step',
        conceptId: snapshot.activeLearningPathStage.conceptId,
        topic: snapshot.activeLearningPathStage.title,
        recommendedActionType: 'learning_path',
        urgency: 75,
        impact: 80,
        confidence: 88,
        effortMinutes: 20,
        reason: 'Next sequential step in active personalized learning path.',
        goalRelevance: true,
      });
    }

    // 6. Doubt Solver Signal (Doubt Solver)
    if (snapshot.doubtTopics.length > 0) {
      signals.push({
        source: 'doubt_solver',
        signalType: 'repeated_doubt',
        conceptId: 'math_quadratic',
        topic: snapshot.doubtTopics[0],
        recommendedActionType: 'doubt',
        urgency: 70,
        impact: 75,
        confidence: 85,
        effortMinutes: 10,
        reason: 'Unresolved student doubt topic requiring AI Doubt Solver explanation.',
      });
    }

    return signals;
  }
}
