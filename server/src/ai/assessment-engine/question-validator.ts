import { QuestionCandidate, ValidatedQuestion } from './types.js';

export class QuestionValidator {
  static validate(q: QuestionCandidate, existingTextList: string[] = []): ValidatedQuestion {
    const errors: string[] = [];

    // 1. Question Text
    if (!q.questionText || typeof q.questionText !== 'string' || q.questionText.trim().length < 5) {
      errors.push('Question text must be at least 5 characters long');
    }

    // 2. Answer Existence
    if (q.correctAnswer === undefined || q.correctAnswer === null || String(q.correctAnswer).trim() === '') {
      errors.push('Correct answer must be specified');
    }

    // 3. MCQ Options & Correct Answer Match
    if (q.questionType === 'mcq') {
      if (!Array.isArray(q.options) || q.options.length < 2) {
        errors.push('MCQ questions must have at least 2 options');
      } else {
        const hasMatch = q.options.some(
          (opt) => String(opt).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
        );
        if (!hasMatch) {
          errors.push('MCQ correct answer must match one of the available options');
        }
      }
    }

    // 4. Marks & Negative Marks Validation
    if (typeof q.marks !== 'number' || q.marks <= 0) {
      errors.push('Question marks must be greater than 0');
    }
    if (typeof q.negativeMarks === 'number' && (q.negativeMarks < 0 || q.negativeMarks > (q.marks || 10))) {
      errors.push('Negative marks must be non-negative and cannot exceed total marks');
    }

    // 5. Difficulty Validation
    if (!['easy', 'medium', 'hard'].includes(q.difficulty)) {
      errors.push('Difficulty must be easy, medium, or hard');
    }

    // 6. Concept Validation
    if (!q.conceptId || typeof q.conceptId !== 'string') {
      errors.push('Valid concept ID is required');
    }

    // 7. Duplicate Prevention
    if (existingTextList.some((t) => t.trim().toLowerCase() === (q.questionText || '').trim().toLowerCase())) {
      errors.push('Duplicate question text detected');
    }

    // 8. Explanation / Solution
    if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length === 0) {
      errors.push('Question explanation cannot be empty');
    }

    // 9. Source Reference Grounding Check
    if (q.sourceReference && typeof q.sourceReference === 'string') {
      const lowerSrc = q.sourceReference.toLowerCase();
      if (lowerSrc.includes('fake') || lowerSrc.includes('fabricated') || lowerSrc.includes('unknown_publisher')) {
        errors.push('Source reference is not verified');
      }
    }

    // 10. Safety Check
    const lowerText = (q.questionText || '').toLowerCase();
    const unsafeWords = ['hate', 'violence', 'malware', 'hack_system', 'exploit_vulnerability'];
    if (unsafeWords.some((w) => lowerText.includes(w))) {
      errors.push('Question text contains unsafe or inappropriate terms');
    }

    const isApproved = errors.length === 0;
    const qualityScore = Math.max(0, 100 - errors.length * 20);

    return {
      ...q,
      validationStatus: isApproved ? 'approved' : 'rejected',
      validationErrors: errors,
      qualityScore,
    };
  }
}
