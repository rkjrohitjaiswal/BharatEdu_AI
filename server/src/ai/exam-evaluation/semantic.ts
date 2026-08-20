import { evaluateQuestionRubric } from './rubrics.js';

export async function evaluateSemanticQuestionAnswer(
  submittedAnswer: string,
  correctAnswer: string,
  marksAvailable = 5
): Promise<{ marksAwarded: number; isCorrect: boolean; feedback: string }> {
  // Deterministic fallback for semantic evaluation
  return evaluateQuestionRubric('short_answer', submittedAnswer, correctAnswer, undefined, marksAvailable);
}
