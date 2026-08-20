import { ResourceCandidate, ResourceContext } from './types.js';

export class CurriculumAlignmentEngine {
  static align(resource: ResourceCandidate, context: ResourceContext): {
    aligned: boolean;
    score: number; // 0 - 100
    reason: string;
  } {
    let score = 50;
    const reasons: string[] = [];

    if (resource.classLevel === context.classLevel) {
      score += 20;
      reasons.push(`Matches Class ${context.classLevel}`);
    } else {
      score -= 30;
    }

    if (resource.board.toLowerCase() === context.board.toLowerCase()) {
      score += 20;
      reasons.push(`Matches ${context.board} Board syllabus`);
    }

    if (context.subject && resource.subject.toLowerCase() === context.subject.toLowerCase()) {
      score += 10;
    }

    if (context.conceptId && resource.conceptId === context.conceptId) {
      score += 30;
      reasons.push('Direct concept match');
    }

    const aligned = score >= 60;
    return {
      aligned,
      score: Math.min(100, Math.max(0, score)),
      reason: reasons.length > 0 ? reasons.join(' • ') : 'General curriculum fit.',
    };
  }
}
