import { dataRepository } from '../../repositories/data.repository.js';
import { VERIFIED_RESOURCE_CATALOG } from './catalog.js';
import { RecommendationRulesEngine } from './rules.js';
import { ResourceQualityValidator } from './quality.js';
import { ResourceFeedbackHandler } from './feedback.js';
import { ResourceAICoach } from './ai-coach.js';
import {
  LearningResource,
  ResourceCandidate,
  ResourceRecommendation,
  StudentResourceProfile,
  ResourceCollection,
} from './types.js';

export function getAllCatalogResources(): LearningResource[] {
  return VERIFIED_RESOURCE_CATALOG;
}

export async function generateResourceRecommendationsPipeline(studentId: string): Promise<ResourceRecommendation[]> {
  return await ResourceRecommendationEngine.generateRecommendations(studentId);
}

export class ResourceRecommendationEngine {
  static async buildStudentProfile(studentId: string): Promise<StudentResourceProfile> {
    const studentProfile = await dataRepository.getStudentProfile(studentId);
    
    // Aggregate interactions for completed/dismissed filtering
    const interactions = await dataRepository.getResourceInteractions(studentId);
    const completedResourceIds = interactions.filter((i) => i.action === 'completed').map((i) => i.resourceId);
    const dismissedResourceIds = interactions.filter((i) => i.action === 'skipped').map((i) => i.resourceId);

    return {
      studentId,
      classLevel: studentProfile?.grade ? parseInt(studentProfile.grade) || 9 : 9,
      board: studentProfile?.board || 'CBSE',
      language: studentProfile?.preferredLanguage || 'en',
      mastery: studentProfile?.overallMastery ?? 65,
      riskScore: studentProfile?.riskScore ?? 25,
      weakConcepts: studentProfile?.topWeakConcepts || ['Fractions & Rational Expressions', 'Algebraic Fractions'],
      prerequisiteGaps: ['concept_num_sys_01', 'concept_poly_02'],
      repeatedMistakes: ['Denominator addition in fractions', 'Sign errors in polynomials'],
      revisionDueTopics: ['Number Systems', 'Real Numbers'],
      activeGoals: ['Master Algebra Fundamentals', 'Prepare for Board Exam'],
      examTargets: ['CBSE Class 9 Term Assessment', 'Math Olympiad'],
      careerSkills: ['Engineering', 'Data Science'],
      doubtTopics: ['Polynomial Roots', 'Calculus Derivatives'],
      completedResourceIds,
      dismissedResourceIds,
    };
  }

  static async generateRecommendations(studentId: string): Promise<ResourceRecommendation[]> {
    const profile = await this.buildStudentProfile(studentId);
    const catalogResources: LearningResource[] = await dataRepository.getLearningResources();
    
    // Ensure catalog contains starter verified resources if database is empty
    const availableResources = catalogResources.length > 0 ? catalogResources : VERIFIED_RESOURCE_CATALOG;

    const feedbackList = await dataRepository.getResourceFeedback(studentId);

    const candidates: ResourceCandidate[] = [];

    for (const res of availableResources) {
      // 1. Quality Validation
      const quality = ResourceQualityValidator.validateResource(res);
      if (!quality.isValid) continue;

      // 2. Diversity & Filtering: Skip completed or dismissed resources
      if (profile.completedResourceIds.includes(res.resourceId)) continue;
      if (profile.dismissedResourceIds.includes(res.resourceId)) continue;

      // 3. Evaluate Rule Signals
      const signals = RecommendationRulesEngine.evaluateSignals(res, profile);
      if (signals.length === 0) continue;

      // 4. Calculate Base Score
      let scoreObj = RecommendationRulesEngine.calculateScore(signals);

      // 5. Adjust for Student Feedback
      const resFeedback = feedbackList.filter((f) => f.resourceId === res.resourceId);
      if (resFeedback.length > 0) {
        scoreObj.totalScore = ResourceFeedbackHandler.adjustScoreForFeedback(scoreObj.totalScore, resFeedback);
      }

      candidates.push({
        resource: res,
        signals,
        score: scoreObj,
      });
    }

    // Sort by recommendationScore descending
    candidates.sort((a, b) => b.score.totalScore - a.score.totalScore);

    // Build Recommendation objects
    const recommendations: ResourceRecommendation[] = candidates.map((c) => {
      const explanation = ResourceAICoach.explainRecommendation(c.resource, c.signals, profile.activeGoals[0]);
      
      return {
        recommendationId: `rec_${studentId}_${c.resource.resourceId}`,
        studentId,
        resourceId: c.resource.resourceId,
        resource: c.resource,
        reason: explanation.whyThisResource,
        priority: c.score.priority,
        recommendationScore: c.score.totalScore,
        sourceSignals: c.signals.map((s) => s.reason),
        targetConcepts: [c.resource.conceptId],
        targetGaps: profile.weakConcepts,
        targetGoals: profile.activeGoals,
        examRelevance: c.resource.examRelevance,
        careerRelevance: c.resource.careerRelevance,
        status: 'recommended',
        generatedAt: new Date().toISOString(),
      };
    });

    return recommendations;
  }

  static async getCollections(studentId: string): Promise<ResourceCollection[]> {
    const recs = await this.generateRecommendations(studentId);
    const resources = recs.map((r) => r.resource!).filter(Boolean);

    return [
      {
        id: 'col_today',
        title: "Today's Recommendations",
        description: 'Top prioritized educational resources matched to your active study targets.',
        resources: resources.slice(0, 3),
      },
      {
        id: 'col_gaps',
        title: 'Fix My Gaps',
        description: 'Targeted practice sets and articles addressing identified learning gaps.',
        resources: resources.filter((r) => r.difficulty === 'beginner' || r.resourceType === 'practice_set'),
      },
      {
        id: 'col_prereq',
        title: 'Prerequisite First',
        description: 'Foundational concept guides required before attempting advanced topics.',
        resources: resources.filter((r) => r.prerequisites && r.prerequisites.length > 0),
      },
      {
        id: 'col_exam',
        title: 'Exam Preparation',
        description: 'Official board revision guides and high-weightage question sets.',
        resources: resources.filter((r) => r.examRelevance && r.examRelevance.length > 0),
      },
      {
        id: 'col_career',
        title: 'Career Skills',
        description: 'Resources building core STEM and engineering foundation skills.',
        resources: resources.filter((r) => r.careerRelevance && r.careerRelevance.length > 0),
      },
    ];
  }
}
