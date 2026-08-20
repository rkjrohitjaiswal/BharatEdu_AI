import { QuestionCandidate } from './types.js';

export interface EvaluationResult {
  isCorrect: boolean;
  marksAwarded: number;
  explanation: string;
  partialCreditRatio: number;
}

export class QuestionEvaluator {
  static evaluate(q: QuestionCandidate, studentAnswer: any): EvaluationResult {
    if (studentAnswer === undefined || studentAnswer === null || String(studentAnswer).trim() === '') {
      return {
        isCorrect: false,
        marksAwarded: 0,
        explanation: 'No answer submitted.',
        partialCreditRatio: 0,
      };
    }

    const maxMarks = q.marks || 4;
    const negMarks = q.negativeMarks || 0;

    // 1. Multiple Choice (MCQ) & True/False
    if (q.questionType === 'mcq' || q.questionType === 'true_false') {
      const isCorrect = String(studentAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      return {
        isCorrect,
        marksAwarded: isCorrect ? maxMarks : -negMarks,
        explanation: isCorrect
          ? 'Correct answer!'
          : `Incorrect. Expected '${q.correctAnswer}', received '${studentAnswer}'.`,
        partialCreditRatio: isCorrect ? 1.0 : 0,
      };
    }

    // 2. Multiple Select (Partial Credit Support)
    if (q.questionType === 'multiple_select' && Array.isArray(q.correctAnswer)) {
      const studentArr = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer];
      const correctSet = new Set((q.correctAnswer as string[]).map((a) => String(a).trim().toLowerCase()));
      let matchedCount = 0;

      studentArr.forEach((ans) => {
        if (correctSet.has(String(ans).trim().toLowerCase())) matchedCount++;
      });

      const ratio = matchedCount / correctSet.size;
      const isFullyCorrect = matchedCount === correctSet.size && studentArr.length === correctSet.size;
      const awardedMarks = isFullyCorrect ? maxMarks : Math.floor(ratio * maxMarks);

      return {
        isCorrect: isFullyCorrect,
        marksAwarded: awardedMarks,
        explanation: isFullyCorrect
          ? 'All correct choices selected.'
          : `Partial credit awarded (${matchedCount}/${correctSet.size} correct choices).`,
        partialCreditRatio: ratio,
      };
    }

    // 3. Short Answer / Numerical / Case Based (Rubric Normalized Match)
    const normStudent = String(studentAnswer).trim().toLowerCase();
    const normCorrect = String(q.correctAnswer).trim().toLowerCase();

    if (normStudent === normCorrect) {
      return {
        isCorrect: true,
        marksAwarded: maxMarks,
        explanation: 'Exact answer match.',
        partialCreditRatio: 1.0,
      };
    }

    // Substring / Keyword Rubric Match
    const keywords = normCorrect.split(/\s+/).filter((w) => w.length > 3);
    const matchedKeywords = keywords.filter((kw) => normStudent.includes(kw));

    if (keywords.length > 0 && matchedKeywords.length === keywords.length) {
      return {
        isCorrect: true,
        marksAwarded: maxMarks,
        explanation: 'Key terms present according to grading rubric.',
        partialCreditRatio: 1.0,
      };
    } else if (keywords.length > 0 && matchedKeywords.length > 0) {
      const ratio = matchedKeywords.length / keywords.length;
      const awarded = Math.floor(ratio * maxMarks);
      return {
        isCorrect: false,
        marksAwarded: awarded,
        explanation: `Partial credit awarded (${matchedKeywords.length}/${keywords.length} rubric keywords matched).`,
        partialCreditRatio: ratio,
      };
    }

    return {
      isCorrect: false,
      marksAwarded: -negMarks,
      explanation: `Answer did not match expected solution: ${q.correctAnswer}`,
      partialCreditRatio: 0,
    };
  }
}
