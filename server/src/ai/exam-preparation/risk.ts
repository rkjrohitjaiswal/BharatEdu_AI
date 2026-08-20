import { ExamRisk } from './types.js';

export class ExamRiskEngine {
  static assessRisks(params: {
    daysRemaining: number;
    readinessScore: number;
    prerequisiteGapsCount: number;
    overdueRevisionsCount: number;
    mockAttemptsCount: number;
  }): ExamRisk[] {
    const risks: ExamRisk[] = [];

    if (params.daysRemaining <= 7 && params.readinessScore < 70) {
      risks.push({
        riskId: 'risk_prox_1',
        riskType: 'proximity',
        severity: 'critical',
        title: 'Exam Proximity Alert',
        description: `Exam is in ${params.daysRemaining} day(s) but readiness score is ${params.readinessScore}%.`,
        mitigationAction: 'Focus exclusively on top high-weightage weak concepts and complete 1 timed diagnostic test.',
      });
    }

    if (params.prerequisiteGapsCount > 0) {
      risks.push({
        riskId: 'risk_pre_1',
        riskType: 'weak_concept',
        severity: 'high',
        title: 'Unmet Prerequisite Gaps',
        description: `You have ${params.prerequisiteGapsCount} unresolved prerequisite gap(s) blocking advanced topics.`,
        mitigationAction: 'Solve practice problems in foundational prerequisite concepts before tackling advanced topics.',
      });
    }

    if (params.mockAttemptsCount === 0) {
      risks.push({
        riskId: 'risk_mock_1',
        riskType: 'mock_shortage',
        severity: 'medium',
        title: 'No Mock Exam Attempted',
        description: 'Zero timed mock exam simulations completed for this exam cycle.',
        mitigationAction: 'Attempt a 45-minute sectional mock test to gauge time allocation skills.',
      });
    }

    if (params.overdueRevisionsCount > 2) {
      risks.push({
        riskId: 'risk_rev_1',
        riskType: 'revision_lag',
        severity: 'medium',
        title: 'Spaced Revision Backlog',
        description: `${params.overdueRevisionsCount} concept revision(s) are overdue.`,
        mitigationAction: 'Clear overdue revision cards in Smart Revision hub today.',
      });
    }

    return risks;
  }
}
