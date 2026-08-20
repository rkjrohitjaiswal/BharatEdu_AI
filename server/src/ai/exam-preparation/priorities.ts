import { ExamPriority } from './types.js';

export class ExamPriorityEngine {
  static rankPriorities(params: {
    syllabusItems: Array<{ conceptId: string; subject: string; topic: string; weightage: number }>;
    masteryMap: Record<string, number>;
    prerequisiteGaps: string[];
    riskConcepts: string[];
    overdueRevisions: string[];
    weakMockConcepts: string[];
  }): ExamPriority[] {
    const items = params.syllabusItems || [
      { conceptId: 'math_polynomials', subject: 'Mathematics', topic: 'Polynomials', weightage: 15 },
      { conceptId: 'math_quadratic', subject: 'Mathematics', topic: 'Quadratic Equations', weightage: 12 },
      { conceptId: 'sci_light_reflection', subject: 'Science', topic: 'Light - Reflection', weightage: 14 },
    ];

    const list: ExamPriority[] = items.map((item, idx) => {
      const masteryPct = params.masteryMap[item.conceptId] ?? 50;
      const isPrerequisiteGap = params.prerequisiteGaps.includes(item.conceptId);
      const isHighRisk = params.riskConcepts.includes(item.conceptId);
      const isOverdue = params.overdueRevisions.includes(item.conceptId);
      const isWeakMock = params.weakMockConcepts.includes(item.conceptId);

      let score = 100 - masteryPct;
      if (isPrerequisiteGap) score += 50;
      if (isHighRisk) score += 40;
      if (isWeakMock) score += 30;
      if (isOverdue) score += 20;
      score += item.weightage * 2;

      let reason = 'General syllabus concept study.';
      if (isPrerequisiteGap) reason = 'Critical prerequisite gap blocking higher concepts.';
      else if (isHighRisk) reason = 'High risk of misconception or score drop.';
      else if (isWeakMock) reason = 'Weak performance observed in recent mock exam.';
      else if (isOverdue) reason = 'Scheduled spaced revision overdue.';

      return {
        conceptId: item.conceptId,
        subject: item.subject,
        topic: item.topic,
        priorityRank: Math.round(score),
        reason,
        weightage: item.weightage,
        masteryPct,
        isPrerequisiteGap,
        isHighRisk,
      };
    });

    return list.sort((a, b) => b.priorityRank - a.priorityRank);
  }
}
