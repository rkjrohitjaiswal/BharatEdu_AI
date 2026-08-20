import { QuestionCandidate, ValidatedQuestion } from './types.js';

export function validatePracticeQuestion(question: QuestionCandidate): ValidatedQuestion {
  const issues: string[] = [];

  // Rule 1: Schema validation (question text, subject, conceptId)
  if (!question.question || question.question.trim().length < 5) {
    issues.push('Question text is missing or too short');
  }
  if (!question.subject) issues.push('Subject is required');
  if (!question.conceptId) issues.push('Concept ID is required');

  // Rule 2: Correct answer validation
  if (question.correctAnswer === undefined || question.correctAnswer === null || String(question.correctAnswer).trim() === '') {
    issues.push('Correct answer is required');
  }

  // Rule 3 & 4: MCQ options & duplicate check
  if (question.questionType === 'mcq') {
    if (!question.options || question.options.length < 2) {
      issues.push('MCQ questions require at least 2 options');
    } else {
      const uniqueOpts = new Set(question.options.map((o) => o.trim().toLowerCase()));
      if (uniqueOpts.size !== question.options.length) {
        issues.push('Duplicate options detected in MCQ choices');
      }
      // Confirm correct answer is among options
      const hasMatch = question.options.some((o) => String(o).trim() === String(question.correctAnswer).trim());
      if (!hasMatch) {
        issues.push('Correct answer is not listed in MCQ options');
      }
    }
  }

  // Rule 5: Explanation presence
  if (!question.explanation || question.explanation.trim().length < 5) {
    issues.push('Explanation is required for practice quality');
  }

  // Rule 6: Solution steps when required
  if (question.difficulty === 'hard' && (!question.solutionSteps || question.solutionSteps.length === 0)) {
    issues.push('Hard questions require step-by-step solution steps');
  }

  // Rule 7: Difficulty validation
  if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
    issues.push('Invalid difficulty specified');
  }

  // Rule 8: Concept mapping
  if (!question.conceptId.startsWith('math_') && !question.conceptId.startsWith('python_') && !question.conceptId.startsWith('cs_')) {
    issues.push('Unrecognized concept mapping schema');
  }

  // Rule 10: Answer leakage in question text
  if (question.question.toLowerCase().includes(`answer is ${String(question.correctAnswer).toLowerCase()}`)) {
    issues.push('Question text contains answer leakage');
  }

  // Rule 12: Unsafe content check
  if (question.question.includes('<script>') || question.question.includes('javascript:')) {
    issues.push('Unsafe HTML/JS script injection detected');
  }

  // Rule 13: Fabricated source/URL check
  if (question.explanation && question.explanation.includes('http://fakeurl.com')) {
    issues.push('Fabricated source URL detected in explanation');
  }

  const isValid = issues.length === 0;
  const validationScore = Math.max(0, 100 - issues.length * 15);

  return {
    question,
    isValid,
    validationScore,
    issues,
  };
}
