import { AssessmentResult, AssessmentRecommendation } from './types.js';

export class AssessmentRecommendationEngine {
  static generateRecommendations(result: AssessmentResult): AssessmentRecommendation[] {
    const recs: AssessmentRecommendation[] = [];

    // 1. Weak Concept Retest Recommendation
    if (result.weakConcepts && result.weakConcepts.length > 0) {
      recs.push({
        type: 'retest',
        title: 'Targeted Remedial Assessment',
        description: `Retest weak concepts (${result.weakConcepts.slice(0, 2).join(', ')}) with diagnostic practice.`,
        priority: 'high',
        targetId: result.weakConcepts[0],
      });

      // 2. Resource Recommendation (Feature 39)
      recs.push({
        type: 'resource',
        title: 'NCERT Verified Reading Materials',
        description: `Review verified NCERT chapters for ${result.weakConcepts[0]} before re-testing.`,
        priority: 'high',
        targetId: result.weakConcepts[0],
      });

      // 3. Smart Revision Recommendation (Feature 24)
      recs.push({
        type: 'revision',
        title: 'Spaced Repetition Review',
        description: 'Schedule spaced revision for missed assessment questions.',
        priority: 'medium',
        targetId: result.weakConcepts[0],
      });
    } else {
      // 4. Advanced Practice & Mock Exam (Feature 9)
      recs.push({
        type: 'exam_prep',
        title: 'Full-Length Mock Exam Challenge',
        description: 'Excellent performance! Attempt a full-length time-limited mock exam.',
        priority: 'low',
      });
    }

    return recs;
  }
}
