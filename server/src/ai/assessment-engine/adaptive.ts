import { AdaptiveAssessmentState, QuestionCandidate } from './types.js';
import { VERIFIED_ASSESSMENT_QUESTION_BANK } from './question-generator.js';

export class AdaptiveAssessmentEngine {
  static selectNextQuestion(
    state: AdaptiveAssessmentState,
    availableQuestions: QuestionCandidate[] = VERIFIED_ASSESSMENT_QUESTION_BANK
  ): { nextQuestion: QuestionCandidate; updatedState: AdaptiveAssessmentState } {
    let nextDifficulty = state.currentDifficulty;

    // Difficulty Adjustment Rules
    if (state.consecutiveCorrect >= 2) {
      if (state.currentDifficulty === 'easy') nextDifficulty = 'medium';
      else if (state.currentDifficulty === 'medium') nextDifficulty = 'hard';
    } else if (state.consecutiveIncorrect >= 2) {
      if (state.currentDifficulty === 'hard') nextDifficulty = 'medium';
      else if (state.currentDifficulty === 'medium') nextDifficulty = 'easy';
    }

    // Filter available questions not already tested
    const candidates = availableQuestions.filter(
      (q) => !state.testedConcepts.includes(q.conceptId) || q.difficulty === nextDifficulty
    );

    const selected =
      candidates.find((q) => q.difficulty === nextDifficulty) ||
      candidates[0] ||
      availableQuestions[0];

    const updatedState: AdaptiveAssessmentState = {
      ...state,
      currentQuestionIndex: state.currentQuestionIndex + 1,
      currentDifficulty: nextDifficulty,
      testedConcepts: [...state.testedConcepts, selected.conceptId],
    };

    return { nextQuestion: selected, updatedState };
  }
}
