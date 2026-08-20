import { PracticeDifficulty } from './types.js';

export function calculateAdaptiveDifficulty(
  currentDifficulty: PracticeDifficulty,
  recentAccuracy: number,
  consecutiveCorrect: number = 0,
  consecutiveIncorrect: number = 0,
  responseTimeSeconds: number = 30
): PracticeDifficulty {
  // Rule 1: Recent accuracy < 40% OR 2 consecutive incorrect -> Decrease difficulty
  if (recentAccuracy < 40 || consecutiveIncorrect >= 2) {
    if (currentDifficulty === 'hard') return 'medium';
    if (currentDifficulty === 'medium') return 'easy';
    return 'easy';
  }

  // Rule 2: Recent accuracy > 80% OR 3 consecutive correct -> Increase difficulty
  if (recentAccuracy >= 80 || consecutiveCorrect >= 3) {
    if (currentDifficulty === 'easy') return 'medium';
    if (currentDifficulty === 'medium') return 'hard';
    return 'hard';
  }

  // Rule 3: 60-80% accuracy -> Gradually increase if fast response time
  if (recentAccuracy >= 60 && responseTimeSeconds < 25 && consecutiveCorrect >= 2) {
    if (currentDifficulty === 'easy') return 'medium';
    if (currentDifficulty === 'medium') return 'hard';
  }

  // Rule 4: 40-60% accuracy -> Maintain difficulty
  return currentDifficulty;
}
