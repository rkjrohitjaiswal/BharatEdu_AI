import { QuestionDifficultyType } from '../../models/exam-paper-question.model.js';

export function calculateQuestionDifficultyForSequence(
  sequence: number,
  totalQuestions: number,
  distribution: { easy: number; medium: number; hard: number }
): QuestionDifficultyType {
  const ratio = sequence / totalQuestions;
  if (ratio <= distribution.easy / 100) return 'easy';
  if (ratio <= (distribution.easy + distribution.medium) / 100) return 'medium';
  return 'hard';
}
