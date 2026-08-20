import { dataRepository } from '../../repositories/data.repository.js';
import { generateAIResourceExplanation } from './ai-coach.js';
import { STARTER_RESOURCE_CATALOG } from './catalog.js';
import { buildStudentResourceContext } from './context.js';
import { generateResourceRecommendationsPipeline } from './engine.js';
import { isUrlSafeAndVerified } from './quality.js';
import { ResourceCandidate, ResourceRecommendation, ResourceRecommendationSummary } from './types.js';

export class LearningResourceService {
  static async getRecommendations(studentId: string): Promise<ResourceRecommendation[]> {
    const existing = await dataRepository.getResourceRecommendations(studentId);
    if (existing && existing.length > 0) {
      const result: ResourceRecommendation[] = [];
      for (const rec of existing) {
        if (rec.isDismissed) continue;
        const resObj = await this.getResourceDetails(rec.resourceId);
        result.push({
          recommendationId: rec.recommendationId || rec._id,
          studentId: rec.studentId,
          resourceId: rec.resourceId,
          resource: resObj || undefined,
          reason: rec.reason,
          priority: rec.priority || 'medium',
          score: rec.score || 75,
          recommendationContext: rec.recommendationContext || 'general',
          breakdown: {
            conceptRelevance: 20,
            learningGapRelevance: 15,
            prerequisiteRelevance: 10,
            examRelevance: 10,
            difficultyFit: 8,
            learningPathAlignment: 8,
            careerGoalAlignment: 4,
            languagePreference: 5,
            qualityVerification: 5,
            totalScore: rec.score || 75,
          },
          isDismissed: !!rec.isDismissed,
          createdAt: rec.createdAt ? new Date(rec.createdAt).toISOString() : new Date().toISOString(),
        });
      }
      if (result.length > 0) return result;
    }

    return await generateResourceRecommendationsPipeline(studentId);
  }

  static async refreshRecommendations(studentId: string): Promise<ResourceRecommendation[]> {
    return await generateResourceRecommendationsPipeline(studentId);
  }

  static async getRecommendation(studentId: string, recommendationId: string): Promise<ResourceRecommendation | null> {
    const list = await this.getRecommendations(studentId);
    return list.find((r) => r.recommendationId === recommendationId) || null;
  }

  static async dismissRecommendation(studentId: string, recommendationId: string): Promise<boolean> {
    return await dataRepository.dismissResourceRecommendation(recommendationId, studentId);
  }

  static async bookmarkResource(studentId: string, resourceId: string, note?: string): Promise<any> {
    return await dataRepository.createResourceBookmark({
      studentId,
      resourceId,
      note: note || '',
    });
  }

  static async removeBookmark(studentId: string, resourceId: string): Promise<boolean> {
    return await dataRepository.deleteResourceBookmark(resourceId, studentId);
  }

  static async recordInteraction(
    studentId: string,
    resourceId: string,
    interactionType: any,
    progressPercent = 0,
    durationSeconds = 0
  ): Promise<any> {
    return await dataRepository.createResourceInteraction({
      studentId,
      resourceId,
      interactionType,
      progressPercent,
      durationSeconds,
    });
  }

  static async getBookmarks(studentId: string): Promise<any[]> {
    const bookmarks = await dataRepository.getResourceBookmarks(studentId);
    const results: any[] = [];
    for (const b of bookmarks) {
      const resDetails = await this.getResourceDetails(b.resourceId);
      results.push({
        ...b,
        resource: resDetails,
      });
    }
    return results;
  }

  static async getHistory(studentId: string): Promise<any[]> {
    return await dataRepository.getResourceInteractions(studentId);
  }

  static async getResourceDetails(resourceId: string): Promise<ResourceCandidate | null> {
    const starter = STARTER_RESOURCE_CATALOG.find((r) => r.resourceId === resourceId);
    if (starter) return starter;

    const dbRes = await dataRepository.getLearningResource(resourceId);
    if (dbRes) {
      return {
        resourceId: dbRes.resourceId || dbRes._id,
        title: dbRes.title,
        description: dbRes.description,
        resourceType: dbRes.resourceType,
        subject: dbRes.subject,
        topicId: dbRes.topicId,
        conceptId: dbRes.conceptId,
        classLevel: dbRes.classLevel,
        board: dbRes.board,
        language: dbRes.language,
        difficulty: dbRes.difficulty,
        estimatedMinutes: dbRes.estimatedMinutes,
        provider: dbRes.provider,
        author: dbRes.author,
        url: isUrlSafeAndVerified(dbRes.url).safe ? dbRes.url : null,
        thumbnailUrl: dbRes.thumbnailUrl,
        official: dbRes.official,
        verified: dbRes.verified,
        tags: dbRes.tags || [],
        prerequisites: dbRes.prerequisites || [],
        careerTags: dbRes.careerTags || [],
        examTags: dbRes.examTags || [],
        qualityScore: dbRes.qualityScore || 80,
        popularityScore: dbRes.popularityScore || 50,
        freshnessScore: dbRes.freshnessScore || 90,
      };
    }

    return null;
  }

  static async getRecommendationSummary(studentId: string): Promise<ResourceRecommendationSummary> {
    const recs = await this.getRecommendations(studentId);
    const criticalCount = recs.filter((r) => r.priority === 'critical').length;
    const contextBreakdown: Record<string, number> = {};

    recs.forEach((r) => {
      contextBreakdown[r.recommendationContext] = (contextBreakdown[r.recommendationContext] || 0) + 1;
    });

    return {
      studentId,
      totalRecommendations: recs.length,
      criticalCount,
      topRecommendation: recs[0] || undefined,
      contextBreakdown,
      generatedAt: new Date().toISOString(),
    };
  }

  static async getTeacherResourceSummary(studentId: string): Promise<any> {
    const recs = await this.getRecommendations(studentId);
    const history = await this.getHistory(studentId);

    return {
      studentId,
      totalRecommended: recs.length,
      totalInteractions: history.length,
      topRecommendedTopics: Array.from(new Set(recs.map((r) => r.resource?.topicId).filter(Boolean))),
      completedCount: history.filter((h) => h.interactionType === 'completed').length,
    };
  }

  static async getParentResourceSummary(studentId: string): Promise<any> {
    return await this.getTeacherResourceSummary(studentId);
  }
}
