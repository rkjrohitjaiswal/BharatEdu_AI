import { ResourceCatalogEngine, getAllCatalogResources } from './catalog.js';
import { ResourceRankingEngine } from './ranking.js';
import { ResourceContext, StudentLearningProfile, ResourceRankingResult } from './types.js';

export { getAllCatalogResources };

export class ResourceRecommendationEngine {
  static getRecommendations(
    context: ResourceContext,
    profile?: StudentLearningProfile
  ): ResourceRankingResult {
    const defaultProfile: StudentLearningProfile = profile || {
      studentId: context.studentId || 'student_1',
      weakConcepts: ['math_quadratic'],
      prerequisiteGaps: ['math_quadratic'],
      masteryMap: { math_quadratic: 55, math_polynomials: 75 },
      revisionDueConcepts: ['math_quadratic'],
      recentAssessmentAccuracy: 68,
      riskLevel: 'low',
    };

    const candidates = ResourceCatalogEngine.getVerifiedCatalog();
    const ranked = ResourceRankingEngine.rankCandidates(candidates, context, defaultProfile);

    const topRecommendation = ranked[0] || {
      resource: candidates[0],
      recommendationScore: 85,
      rank: 1,
      priority: 'high',
      actionType: 'read',
      reason: {
        primaryReason: 'NCERT official textbook study for core concept mastery.',
        details: 'Class 10 CBSE Curriculum aligned.',
      },
    };

    return {
      topRecommendation,
      recommendations: ranked,
      contextSummary: `Generated ${ranked.length} verified recommendations for Class ${context.classLevel} ${context.board} ${context.subject || 'curriculum'}.`,
    };
  }

  static generateRecommendations(context: ResourceContext, profile?: StudentLearningProfile): ResourceRankingResult {
    return this.getRecommendations(context, profile);
  }

  static async buildStudentProfile(studentId: string): Promise<StudentLearningProfile> {
    return {
      studentId,
      weakConcepts: ['math_quadratic'],
      prerequisiteGaps: ['math_quadratic'],
      masteryMap: { math_quadratic: 55, math_polynomials: 75 },
      revisionDueConcepts: ['math_quadratic'],
      recentAssessmentAccuracy: 68,
      riskLevel: 'low',
    };
  }
}
