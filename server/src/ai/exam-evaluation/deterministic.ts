export function evaluateDeterministicQuestion(
  questionType: string,
  submittedAnswer: string,
  correctAnswer: string,
  marksAvailable = 1,
  negativeMarks = 0
): { isCorrect: boolean; marksAwarded: number; negativeMarksApplied: number; feedback: string } {
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
    isCorrect = normSub === normCorr || (normSub.length > 3 && normCorr.includes(normSub));
  }

  const marksAwarded = isCorrect ? marksAvailable : 0;
  const negativeMarksApplied = !isCorrect && normSub.length > 0 ? negativeMarks : 0;

  const feedback = isCorrect
    ? `Correct response! +${marksAwarded} marks.`
    : normSub.length === 0
    ? 'Unanswered question (0 marks).'
    : `Incorrect answer (-${negativeMarksApplied} negative marks applied). Expected answer: "${correctAnswer}".`;

  return { isCorrect, marksAwarded, negativeMarksApplied, feedback };
}
