import { QuestionCandidate } from './types.js';

export interface HintResponse {
  hintLevel: number;
  hintText: string;
  totalHintsAvailable: number;
}

export function getProgressiveHint(question: QuestionCandidate, currentLevel: number): HintResponse {
  const hints = question.hints || [];
  const maxLevels = hints.length > 0 ? hints.length : 3;
  const targetLevel = Math.min(maxLevels, Math.max(1, currentLevel));

  let hintText = '';
  if (hints.length >= targetLevel) {
    hintText = hints[targetLevel - 1];
  } else {
    if (targetLevel === 1) {
      hintText = `Conceptual Hint: Focus on core rules for ${question.conceptId}.`;
    } else if (targetLevel === 2) {
      hintText = `Directional Hint: Substitute given values into standard formula.`;
    } else {
      hintText = `Near-Solution Hint: Simplify equation step by step to solve for x.`;
    }
  }

  return {
    hintLevel: targetLevel,
    hintText,
    totalHintsAvailable: maxLevels,
  };
}
