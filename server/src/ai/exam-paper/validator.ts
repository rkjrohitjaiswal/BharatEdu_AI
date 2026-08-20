import { QuestionTypeFormat } from '../../models/exam-paper-question.model.js';

export function validateExamPaperQuestion(q: {
  questionText: string;
  options?: string[];
  correctAnswer: string;
  marks: number;
  questionType: QuestionTypeFormat;
}): boolean {
  if (!q.questionText || q.questionText.trim().length < 5) return false;
  if (!q.correctAnswer || q.correctAnswer.trim().length === 0) return false;
  if (q.marks <= 0) return false;

  if (q.questionType === 'mcq') {
    if (!q.options || q.options.length < 2) return false;
    const normAns = q.correctAnswer.trim().toLowerCase();
    const match = q.options.some((opt) => opt.trim().toLowerCase() === normAns);
    if (!match) return false;
  }

  return true;
}
