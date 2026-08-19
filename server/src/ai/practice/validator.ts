import { GeneratedQuestionPayload, QuestionValidationResult } from './types.js';

export class QuestionValidator {
  public static validateQuestion(payload: Partial<GeneratedQuestionPayload>): QuestionValidationResult {
    const errors: string[] = [];

    if (!payload.questionText || typeof payload.questionText !== 'string' || payload.questionText.trim().length === 0) {
      errors.push('Question text is required and cannot be empty.');
    }

    if (!payload.questionType || !['mcq', 'true_false', 'short_answer'].includes(payload.questionType)) {
      errors.push('Question type must be mcq, true_false, or short_answer.');
    }

    if (!payload.correctAnswer || typeof payload.correctAnswer !== 'string' || payload.correctAnswer.trim().length === 0) {
      errors.push('Correct answer is required.');
    }

    if (payload.questionType === 'mcq') {
      if (!Array.isArray(payload.options) || payload.options.length < 2) {
        errors.push('MCQ questions must have at least 2 options.');
      } else {
        const match = payload.options.some(
          (opt) => opt.trim().toLowerCase() === (payload.correctAnswer || '').trim().toLowerCase()
        );
        if (!match) {
          errors.push('Correct answer must match one of the provided MCQ options.');
        }
      }
    }

    if (!payload.explanation || typeof payload.explanation !== 'string' || payload.explanation.trim().length === 0) {
      errors.push('Explanation is required.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
