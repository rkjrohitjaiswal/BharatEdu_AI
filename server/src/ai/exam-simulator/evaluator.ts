import { ExamQuestion, ExamResult, SectionPerformance } from './types.js';

export function evaluateExamAnswers(
  questions: ExamQuestion[],
  submittedAnswers: Record<string, string>,
  timeSpentSeconds: number = 0
): {
  score: number;
  totalMarks: number;
  accuracy: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  sectionResults: SectionPerformance[];
} {
  let score = 0;
  let totalMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;

  const sectionMap: Record<string, SectionPerformance> = {};

  for (const q of questions) {
    totalMarks += q.marks;

    if (!sectionMap[q.sectionId]) {
      sectionMap[q.sectionId] = {
        sectionId: q.sectionId,
        sectionName: q.sectionId,
        subject: 'General',
        score: 0,
        totalMarks: 0,
        accuracy: 0,
        correctCount: 0,
        incorrectCount: 0,
        skippedCount: 0,
      };
    }

    const sec = sectionMap[q.sectionId];
    sec.totalMarks += q.marks;

    const answer = submittedAnswers[q.questionId];

    if (!answer || answer.trim() === '') {
      skippedCount++;
      sec.skippedCount++;
    } else if (answer.trim() === q.correctAnswer.trim()) {
      score += q.marks;
      correctCount++;
      sec.score += q.marks;
      sec.correctCount++;
    } else {
      score -= q.negativeMarks || 0;
      incorrectCount++;
      sec.score -= q.negativeMarks || 0;
      sec.incorrectCount++;
    }
  }

  const attemptedCount = correctCount + incorrectCount;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  const sectionResults: SectionPerformance[] = Object.values(sectionMap).map((sec) => {
    const secAttempted = sec.correctCount + sec.incorrectCount;
    sec.accuracy = secAttempted > 0 ? Math.round((sec.correctCount / secAttempted) * 100) : 0;
    sec.score = Math.max(0, sec.score);
    return sec;
  });

  return {
    score: Math.max(0, Math.round(score * 100) / 100),
    totalMarks,
    accuracy,
    attemptedCount,
    correctCount,
    incorrectCount,
    skippedCount,
    sectionResults,
  };
}
