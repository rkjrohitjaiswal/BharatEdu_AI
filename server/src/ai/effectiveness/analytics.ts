import { BaselineEngine } from './baseline.js';
import { FollowupEngine } from './followup.js';
import { EffectivenessScoringEngine } from './scoring.js';
import { OutcomeClassificationEngine } from './classification.js';
import { ActionEffectivenessEngine } from './action-effectiveness.js';
import { ConceptEffectivenessEngine } from './concept-effectiveness.js';

export class EffectivenessAnalyticsEngine {
  static async generateStudentSummary(studentId: string): Promise<any> {
    const baseline = await BaselineEngine.captureBaseline(studentId, 'act_1', 'math_quadratic', 'Quadratic Equations');
    const followup = await FollowupEngine.captureFollowup(studentId, 'act_1', 'math_quadratic');
    const { effectivenessScore, delta, confidence } = EffectivenessScoringEngine.calculateScore(baseline, followup);
    const classification = OutcomeClassificationEngine.classify(effectivenessScore, delta, true);

    const actionMetrics = ActionEffectivenessEngine.evaluateActions([]);
    const conceptAssociations = ConceptEffectivenessEngine.getConceptAssociations(studentId);

    return {
      studentId,
      overallEffectivenessScore: effectivenessScore,
      confidence,
      classification,
      actionMetrics,
      conceptAssociations,
      strongestInterventions: ['AI Doubt Solver', 'Targeted Practice'],
      weakestInterventions: ['Long Video Lessons'],
      insufficientEvidence: ['Mock Exam Timing'],
      completionRatePct: 82,
      improvementRatePct: 74,
      retentionRatePct: 78,
      studyEfficiencyPct: 84,
      assessmentTransferScore: 72,
    };
  }
}
