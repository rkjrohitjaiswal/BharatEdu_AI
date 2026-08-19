import { QuestionDifficulty } from '../../models/practice-session.model.js';

export class PracticeDifficultyEngine {
  public static calculateInitialDifficulty(masteryScore: number, gapSeverity?: string): QuestionDifficulty {
    if (gapSeverity === 'critical') return 'easy';
    if (masteryScore < 40) return 'easy';
    if (masteryScore > 70) return 'hard';
    return 'medium';
  }

  public static adaptDifficulty(
    currentDifficulty: QuestionDifficulty,
    recentAnswers: boolean[] // Array of recent boolean answers in current session
  ): QuestionDifficulty {
    if (recentAnswers.length < 2) return currentDifficulty;

    const lastTwo = recentAnswers.slice(-2);
    const twoCorrect = lastTwo.every((ans) => ans === true);
    const twoIncorrect = lastTwo.every((ans) => ans === false);

    if (twoCorrect) {
      if (currentDifficulty === 'easy') return 'medium';
      if (currentDifficulty === 'medium') return 'hard';
    } else if (twoIncorrect) {
      if (currentDifficulty === 'hard') return 'medium';
      if (currentDifficulty === 'medium') return 'easy';
    }

    return currentDifficulty;
  }
}
