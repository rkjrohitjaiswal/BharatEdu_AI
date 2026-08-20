import { MisconceptionCategoryType, MisconceptionSeverityLevel } from '../../models/student-misconception.model.js';

export function detectMisconceptionFromQuestionAttempt(
  isCorrect: boolean,
  submittedAnswer: string,
  correctAnswer: string,
  questionType: string,
  responseTimeSeconds: number,
  topicId: string,
  conceptId: string
): { misconceptionType?: MisconceptionCategoryType; description?: string; severity?: MisconceptionSeverityLevel; action?: string } {
  if (isCorrect) return {};

  const normSub = (submittedAnswer || '').trim();
  if (!normSub) {
    return {
      misconceptionType: 'incomplete_answer',
      description: `Question on concept '${conceptId}' was skipped or left blank due to time management or lack of confidence.`,
      severity: 'medium',
      action: 'Practice timed sectional tests for improved time management.',
    };
  }

  if (responseTimeSeconds > 120) {
    return {
      misconceptionType: 'time_management',
      description: `Spent excessive time (${responseTimeSeconds}s) on '${conceptId}' indicating procedural uncertainty.`,
      severity: 'medium',
      action: 'Review speed shortcuts and standard formula substitutions.',
    };
  }

  if (questionType === 'numerical') {
    return {
      misconceptionType: 'calculation_error',
      description: `Arithmetic mismatch on numerical concept '${conceptId}'. Submitted: "${normSub}", Correct: "${correctAnswer}".`,
      severity: 'medium',
      action: 'Double-check intermediate algebraic expansion and sign changes.',
    };
  }

  return {
    misconceptionType: 'concept_confusion',
    description: `Conceptual confusion identified in topic '${topicId}' on concept '${conceptId}'.`,
    severity: 'high',
    action: 'Review foundational concept definitions and prerequisite dependencies.',
  };
}
