import { QuestionCandidate } from './types.js';

export function isDuplicateQuestion(
  newQuestion: QuestionCandidate,
  existingQuestions: QuestionCandidate[]
): boolean {
  if (!existingQuestions || existingQuestions.length === 0) return false;

  const normalizedNew = newQuestion.question.trim().toLowerCase().replace(/\s+/g, ' ');

  return existingQuestions.some((q) => {
    if (q.questionId === newQuestion.questionId) return true;
    const normalizedExist = q.question.trim().toLowerCase().replace(/\s+/g, ' ');
    if (normalizedNew === normalizedExist) return true;
    return false;
  });
}
