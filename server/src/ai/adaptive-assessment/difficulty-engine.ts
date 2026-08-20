import { AssessmentDifficulty } from '../../models/adaptive-assessment.model.js';

const DIFFICULTY_ORDER: AssessmentDifficulty[] = ['beginner', 'easy', 'medium', 'hard', 'advanced'];

export function calculateNextAdaptiveDifficulty(
  currentDifficulty: AssessmentDifficulty,
  isCorrect: boolean
): AssessmentDifficulty {
  let idx = DIFFICULTY_ORDER.indexOf(currentDifficulty);
  if (idx === -1) idx = 2; // Default to 'medium'

  if (isCorrect) {
    idx = Math.min(idx + 1, DIFFICULTY_ORDER.length - 1);
  } else {
    idx = Math.max(idx - 1, 0);
  }

  return DIFFICULTY_ORDER[idx];
}
