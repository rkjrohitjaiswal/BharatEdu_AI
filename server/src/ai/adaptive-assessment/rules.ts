import { AssessmentDifficulty } from '../../models/adaptive-assessment.model.js';
import { QuestionType } from '../../models/adaptive-assessment-question.model.js';

export function validateQuestionQuality(questionObj: {
  question: string;
  options?: string[];
  correctAnswer: string;
  marks: number;
  questionType: QuestionType;
  difficulty: AssessmentDifficulty;
}): boolean {
  if (!questionObj.question || questionObj.question.trim().length < 5) return false;
  if (!questionObj.correctAnswer || questionObj.correctAnswer.trim().length === 0) return false;
  if (questionObj.marks <= 0) return false;

  if (questionObj.questionType === 'mcq') {
    if (!questionObj.options || questionObj.options.length < 2) return false;
    const normAns = questionObj.correctAnswer.trim().toLowerCase();
    const hasMatch = questionObj.options.some((o) => o.trim().toLowerCase() === normAns);
    if (!hasMatch) return false;
  }

  return true;
}
