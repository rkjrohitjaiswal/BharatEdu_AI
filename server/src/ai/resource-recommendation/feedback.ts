import { ResourceFeedback } from './types.js';

export class ResourceFeedbackHandler {
  static adjustScoreForFeedback(baseScore: number, feedbackItems: ResourceFeedback[]): number {
    let score = baseScore;

    for (const fb of feedbackItems) {
      switch (fb.feedbackType) {
        case 'helpful':
          score += 15;
          break;
        case 'not_helpful':
          score -= 20;
          break;
        case 'too_easy':
        case 'too_difficult':
        case 'wrong_level':
        case 'wrong_topic':
          score -= 15;
          break;
        case 'too_long':
          score -= 10;
          break;
      }
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }
}
