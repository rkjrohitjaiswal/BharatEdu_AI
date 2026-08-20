import { QuestionDifficultyType, QuestionTypeFormat } from '../../models/exam-paper-question.model.js';

export interface IGeneratedExamQuestion {
  questionText: string;
  options?: string[];
  correctAnswer: string;
  expectedConceptCoverage?: string[];
  rubric?: string;
  marks: number;
  negativeMarks: number;
  questionType: QuestionTypeFormat;
  difficulty: QuestionDifficultyType;
  sourceType: string;
  generatedBy: 'catalog' | 'deterministic' | 'ai' | 'hybrid';
}

export function getFallbackQuestionForExamSection(
  subject: string,
  topicId: string,
  conceptId: string,
  difficulty: QuestionDifficultyType,
  questionType: QuestionTypeFormat,
  marks: number,
  sequence: number
): IGeneratedExamQuestion {
  const isMath = subject.toLowerCase().includes('math') || topicId.toLowerCase().includes('alg');

  if (questionType === 'mcq') {
    const q = isMath ? `Solve for x: 3x - 5 = 10.` : `Which component of blood carries oxygen throughout the human body?`;
    const options = isMath ? ['x = 3', 'x = 5', 'x = 4', 'x = 6'] : ['White Blood Cells', 'Red Blood Cells', 'Plasma', 'Platelets'];
    const correctAnswer = isMath ? 'x = 5' : 'Red Blood Cells';

    return {
      questionText: q,
      options,
      correctAnswer,
      marks,
      negativeMarks: 0,
      questionType: 'mcq',
      difficulty,
      sourceType: 'BharatEdu Curriculum Bank',
      generatedBy: 'deterministic',
    };
  } else if (questionType === 'short_answer') {
    const q = isMath
      ? `Explain the substitution method for solving a pair of linear equations in two variables.`
      : `Define Ohm's Law and state its standard mathematical formula.`;
    const correctAnswer = isMath
      ? 'Express one variable in terms of the other and substitute into the second equation.'
      : 'V = IR; current is directly proportional to potential difference across a conductor.';

    return {
      questionText: q,
      correctAnswer,
      marks,
      negativeMarks: 0,
      questionType: 'short_answer',
      difficulty,
      sourceType: 'BharatEdu Curriculum Bank',
      generatedBy: 'deterministic',
    };
  } else {
    // long_answer, coding, or numerical
    const q = isMath
      ? `Formulate a system of linear equations for a taxi fare problem (Base fare Rs 50 plus Rs 12/km for 15 km) and compute total cost.`
      : `Write a Python function 'solve_linear(a, b)' that returns the root of ax + b = 0 for non-zero a.`;
    const correctAnswer = isMath ? 'Total Fare = Rs 230' : 'def solve_linear(a, b): return -b / a';

    return {
      questionText: q,
      correctAnswer,
      expectedConceptCoverage: [conceptId, 'math_algebra_basics'],
      rubric: 'Full marks for complete formulation, clear steps, and accurate final answer.',
      marks,
      negativeMarks: 0,
      questionType: 'long_answer',
      difficulty,
      sourceType: 'BharatEdu Curriculum Bank',
      generatedBy: 'deterministic',
    };
  }
}
