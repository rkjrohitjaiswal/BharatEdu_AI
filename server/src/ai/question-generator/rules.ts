import { QuestionDifficulty } from '../../models/question.model.js';
import { IQuestionItem, IQuestionValidationResult } from './types.js';

export const DIFFICULTY_ORDER: QuestionDifficulty[] = ['foundational', 'easy', 'medium', 'hard', 'advanced'];

export function validateQuestion(question: Partial<IQuestionItem>): IQuestionValidationResult {
  const errors: string[] = [];

  if (!question.questionId) errors.push('Missing questionId');
  if (!question.conceptId) errors.push('Missing conceptId');
  if (!question.questionType) errors.push('Missing questionType');
  if (!question.difficulty || !DIFFICULTY_ORDER.includes(question.difficulty)) {
    errors.push('Invalid or missing difficulty level');
  }
  if (!question.stem || question.stem.trim().length === 0) errors.push('Missing question stem text');
  if (!question.correctAnswer || String(question.correctAnswer).trim().length === 0) {
    errors.push('Missing correctAnswer');
  }

  // Type-specific validation
  if (question.questionType === 'mcq') {
    if (!Array.isArray(question.options) || question.options.length < 2) {
      errors.push('MCQ questions require at least 2 options');
    } else if (
      !question.options.map((o) => String(o).trim()).includes(String(question.correctAnswer).trim())
    ) {
      errors.push('MCQ correct answer must match one of the provided options');
    }
  }

  if (question.questionType === 'true_false') {
    const validChoices = ['true', 'false', 'True', 'False'];
    if (!validChoices.includes(String(question.correctAnswer).trim())) {
      errors.push('True/False correct answer must be "True" or "False"');
    }
  }

  if (question.questionType === 'numerical') {
    if (isNaN(Number(question.correctAnswer))) {
      errors.push('Numerical questions require a numeric correctAnswer string');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function determineInitialDifficulty(masteryScore: number): QuestionDifficulty {
  if (masteryScore < 30) return 'foundational';
  if (masteryScore < 50) return 'easy';
  if (masteryScore < 70) return 'medium';
  if (masteryScore < 85) return 'hard';
  return 'advanced';
}

export function adaptDifficulty(
  currentDifficulty: QuestionDifficulty,
  recentAccuracy: number
): QuestionDifficulty {
  const currentIndex = DIFFICULTY_ORDER.indexOf(currentDifficulty);
  if (currentIndex === -1) return 'medium';

  if (recentAccuracy >= 80) {
    const nextIndex = Math.min(DIFFICULTY_ORDER.length - 1, currentIndex + 1);
    return DIFFICULTY_ORDER[nextIndex];
  } else if (recentAccuracy < 50) {
    const prevIndex = Math.max(0, currentIndex - 1);
    return DIFFICULTY_ORDER[prevIndex];
  }

  return currentDifficulty;
}

export function filterAntiRepetition(
  questions: IQuestionItem[],
  recentQuestionIds: string[],
  minGap: number = 10
): IQuestionItem[] {
  const recentSet = new Set(recentQuestionIds.slice(-minGap));
  const available = questions.filter((q) => !recentSet.has(q.questionId));
  return available.length > 0 ? available : questions;
}
