import { ExamStrategy } from './types.js';

export class ExamStrategyEngine {
  static getStrategy(subject: string, durationMinutes: number = 180): ExamStrategy {
    const totalSecs = durationMinutes * 60;
    const finalCheckMinutes = Math.min(15, Math.floor(durationMinutes * 0.1));

    return {
      questionOrdering: [
        'Phase 1: Attempt direct high-confidence MCQs (Section A).',
        'Phase 2: Solve mandatory numerical and formula-based short questions.',
        'Phase 3: Tackle complex case-based and long-answer derivations.',
      ],
      sectionTimeAllocation: {
        'Section A (MCQs)': Math.floor(durationMinutes * 0.25),
        'Section B (Short Answer)': Math.floor(durationMinutes * 0.35),
        'Section C (Long Answer)': Math.floor(durationMinutes * 0.3),
        'Final Revision': finalCheckMinutes,
      },
      skipStrategy: 'If a question takes >2.5 minutes without progress, flag it and move forward immediately to secure easy marks.',
      reviewStrategy: 'Prioritize reviewing flagged high-confidence questions first before attempting unanswered complex problems.',
      confidenceManagement: 'Rate confidence on every response. Re-verify questions flagged with "low" confidence during the final 15 minutes.',
      finalCheckMinutes,
    };
  }
}
