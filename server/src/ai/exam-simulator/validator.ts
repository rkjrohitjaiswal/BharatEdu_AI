import { ExamQuestion } from './types.js';

export interface ValidationResult {
  valid: boolean;
  score: number;
  errors: string[];
}

export function validateExamQuestion(q: ExamQuestion): ValidationResult {
  const errors: string[] = [];

  // 1. Schema check
  if (!q.questionId || typeof q.questionId !== 'string') errors.push('Missing or invalid questionId');
  if (!q.question || typeof q.question !== 'string' || q.question.trim().length < 5) {
    errors.push('Question text too short or invalid');
  }

  // 2. Options check
  if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
    errors.push('Question must have at least 2 options');
  } else {
    // 3. Option uniqueness
    const unique = new Set(q.options.map((o) => o.trim().toLowerCase()));
    if (unique.size !== q.options.length) {
      errors.push('Duplicate options detected');
    }
  }

  // 4. Correct answer check
  if (!q.correctAnswer || typeof q.correctAnswer !== 'string') {
    errors.push('Missing correctAnswer');
  } else if (q.options && !q.options.includes(q.correctAnswer)) {
    errors.push('correctAnswer must be present in options array');
  }

  // 5. Marks check
  if (typeof q.marks !== 'number' || q.marks <= 0) errors.push('Invalid marks value');

  // 6. Negative marks check
  if (typeof q.negativeMarks !== 'number' || q.negativeMarks < 0) errors.push('Invalid negativeMarks value');

  // 7. Difficulty check
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) errors.push('Invalid difficulty level');

  // 8. Concept ID check
  if (!q.conceptId) errors.push('Missing conceptId');

  // 9. Topic ID check
  if (!q.topicId) errors.push('Missing topicId');

  // 10. Explanation check
  if (!q.explanation || q.explanation.trim().length < 5) errors.push('Explanation missing or too brief');

  const valid = errors.length === 0;
  const score = valid ? 100 : Math.max(0, 100 - errors.length * 20);

  return { valid, score, errors };
}
