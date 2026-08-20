import { QuestionCandidate, QuestionQualityReport } from './types.js';
import { QuestionValidator } from './question-validator.js';

export class QuestionQualityEngine {
  static evaluate(q: QuestionCandidate): QuestionQualityReport {
    const validated = QuestionValidator.validate(q);
    const warnings: string[] = [];

    // Ambiguity Check
    if (q.questionText && q.questionText.includes('???')) {
      warnings.push('Question text contains consecutive question marks indicating potential punctuation ambiguity.');
    }

    // Distractor Quality
    if (q.questionType === 'mcq' && q.options) {
      const uniqueOptions = new Set(q.options.map((o) => o.trim().toLowerCase()));
      if (uniqueOptions.size < q.options.length) {
        warnings.push('MCQ has duplicate options which reduces distractor quality.');
      }
    }

    // Difficulty Consistency
    if (q.difficulty === 'easy' && q.questionText && q.questionText.length > 300) {
      warnings.push('Easy difficulty question has unusually lengthy text.');
    }

    let qualityScore = validated.qualityScore;
    if (warnings.length > 0) {
      qualityScore = Math.max(0, qualityScore - warnings.length * 10);
    }

    return {
      questionId: q.questionId,
      qualityScore,
      warnings,
      errors: validated.validationErrors || [],
      validationStatus: validated.validationStatus === 'approved' && qualityScore >= 50 ? 'approved' : 'rejected',
    };
  }
}
