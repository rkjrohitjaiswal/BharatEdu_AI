import { QuestionType } from '../../models/adaptive-assessment-question.model.js';

export function evaluateSubmittedQuestionAnswer(
  questionType: QuestionType,
  submittedAnswer: string,
  correctAnswer: string,
  totalMarks: number
): {
  isCorrect: boolean;
  marksAwarded: number;
  feedback: string;
} {
  const normSub = (submittedAnswer || '').trim().toLowerCase();
  const normCorr = (correctAnswer || '').trim().toLowerCase();

  let isCorrect = false;

  if (questionType === 'mcq' || questionType === 'true_false') {
    isCorrect = normSub === normCorr;
  } else if (questionType === 'numerical') {
    const subNum = parseFloat(normSub);
    const corrNum = parseFloat(normCorr);
    if (!isNaN(subNum) && !isNaN(corrNum)) {
      isCorrect = Math.abs(subNum - corrNum) < 0.01;
    } else {
      isCorrect = normSub === normCorr;
    }
  } else if (questionType === 'multiple_select') {
    const subList = normSub.split(',').map((s) => s.trim()).sort().join(',');
    const corrList = normCorr.split(',').map((s) => s.trim()).sort().join(',');
    isCorrect = subList === corrList;
  } else {
    // short_answer or coding
    isCorrect = normSub === normCorr || normSub.includes(normCorr) || normCorr.includes(normSub);
  }

  const marksAwarded = isCorrect ? totalMarks : 0;
  const feedback = isCorrect
    ? 'Correct! Excellent problem solving.'
    : `Incorrect. Standard correct answer is: "${correctAnswer}". Review foundational steps.`;

  return {
    isCorrect,
    marksAwarded,
    feedback,
  };
}
