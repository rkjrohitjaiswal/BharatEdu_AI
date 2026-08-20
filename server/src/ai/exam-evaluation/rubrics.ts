export function evaluateQuestionRubric(
  questionType: string,
  submittedAnswer: string,
  correctAnswer: string,
  rubricStr?: string,
  marksAvailable = 5
): { marksAwarded: number; isCorrect: boolean; feedback: string } {
  const normSub = (submittedAnswer || '').trim().toLowerCase();
  const normCorr = (correctAnswer || '').trim().toLowerCase();

  if (!normSub) {
    return { marksAwarded: 0, isCorrect: false, feedback: 'No answer submitted (0 marks).' };
  }

  if (normSub === normCorr) {
    return { marksAwarded: marksAvailable, isCorrect: true, feedback: 'Perfect match. Full credit awarded.' };
  }

  // Partial credit logic based on concept keywords
  const corrKeywords = normCorr.split(' ').filter((w) => w.length > 3);
  let matchedCount = 0;
  corrKeywords.forEach((kw) => {
    if (normSub.includes(kw)) matchedCount++;
  });

  const ratio = corrKeywords.length > 0 ? matchedCount / corrKeywords.length : 0;
  let marksAwarded = Math.round(ratio * marksAvailable);

  // Clamp marksAwarded strictly between 0 and marksAvailable
  marksAwarded = Math.max(0, Math.min(marksAvailable, marksAwarded));

  const isCorrect = marksAwarded === marksAvailable;
  const feedback = isCorrect
    ? 'Complete working and correct solution.'
    : marksAwarded > 0
    ? `Partial credit awarded (${marksAwarded}/${marksAvailable} marks). Key concept steps matched.`
    : `Incorrect solution (0/${marksAvailable} marks). Review the model solution steps.`;

  return { marksAwarded, isCorrect, feedback };
}
