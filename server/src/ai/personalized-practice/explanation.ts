import { QuestionCandidate } from './types.js';
import { diagnoseStudentMisconception } from './misconceptions.js';

export interface PostSubmissionExplanation {
  questionId: string;
  isCorrect: boolean;
  correctAnswer: any;
  userAnswer: any;
  explanation: string;
  solutionSteps: string[];
  misconceptionDiagnosis?: any;
  recommendedResourceId?: string;
}

export function buildPostSubmissionExplanation(
  question: QuestionCandidate,
  userAnswer: any,
  isCorrect: boolean
): PostSubmissionExplanation {
  const misconception = isCorrect
    ? undefined
    : diagnoseStudentMisconception(question.conceptId, userAnswer, question.correctAnswer, question.misconceptionTags);

  return {
    questionId: question.questionId,
    isCorrect,
    correctAnswer: question.correctAnswer,
    userAnswer,
    explanation: question.explanation || 'No detailed explanation provided.',
    solutionSteps: question.solutionSteps || [],
    misconceptionDiagnosis: misconception,
    recommendedResourceId: isCorrect ? undefined : 'res_ncert_math_algebra',
  };
}
