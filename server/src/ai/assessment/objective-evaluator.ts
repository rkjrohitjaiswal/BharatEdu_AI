import { IAssessmentQuestion } from '../../models/assessment-question.model.js';

export interface ObjectiveEvalResult {
  questionId: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  feedback: string;
}

export class ObjectiveEvaluator {
  static evaluate(question: IAssessmentQuestion, studentAnswer: any): ObjectiveEvalResult {
    const questionId = question.questionId;
    const maxScore = question.marks || 1;
    const questionType = question.questionType;
    const correctAnswer = question.correctAnswer;

    if (studentAnswer === undefined || studentAnswer === null || studentAnswer === '') {
      return {
        questionId,
        isCorrect: false,
        score: 0,
        maxScore,
        feedback: 'No answer provided.',
      };
    }

    let isCorrect = false;
    let score = 0;

    switch (questionType) {
      case 'mcq':
      case 'true_false': {
        const studentStr = String(studentAnswer).trim().toLowerCase();
        const correctStr = String(correctAnswer).trim().toLowerCase();
        isCorrect = studentStr === correctStr;
        score = isCorrect ? maxScore : 0;
        break;
      }

      case 'multiple_select': {
        const studentArr = Array.isArray(studentAnswer)
          ? studentAnswer.map((s) => String(s).trim().toLowerCase())
          : [String(studentAnswer).trim().toLowerCase()];
        const correctArr = Array.isArray(correctAnswer)
          ? correctAnswer.map((c) => String(c).trim().toLowerCase())
          : [String(correctAnswer).trim().toLowerCase()];

        const studentSet = new Set(studentArr);
        const correctSet = new Set(correctArr);

        if (studentSet.size === correctSet.size && [...studentSet].every((val) => correctSet.has(val))) {
          isCorrect = true;
          score = maxScore;
        } else {
          // Partial marking calculation if configured
          let matches = 0;
          for (const val of studentSet) {
            if (correctSet.has(val)) matches++;
            else matches--; // Penalty for wrong selection
          }
          score = Math.max(0, Math.round((Math.max(0, matches) / correctSet.size) * maxScore * 100) / 100);
          isCorrect = score === maxScore;
        }
        break;
      }

      case 'numerical': {
        const studentNum = parseFloat(String(studentAnswer));
        const correctNum = parseFloat(String(correctAnswer));

        if (!isNaN(studentNum) && !isNaN(correctNum)) {
          // Allow small float tolerance (0.01)
          isCorrect = Math.abs(studentNum - correctNum) < 0.01;
          score = isCorrect ? maxScore : 0;
        }
        break;
      }

      default:
        isCorrect = false;
        score = 0;
    }

    return {
      questionId,
      isCorrect,
      score,
      maxScore,
      feedback: isCorrect
        ? `Correct! Awarded ${score}/${maxScore} marks.`
        : `Incorrect. Awarded 0/${maxScore} marks.`,
    };
  }
}
