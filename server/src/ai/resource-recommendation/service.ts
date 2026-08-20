import { ResourceRecommendationEngine } from './engine.js';
import { VERIFIED_RESOURCE_CATALOG } from './catalog.js';
import { LearningResource, ResourceRecommendation } from './types.js';

export class LearningResourceService {
  static async getRecommendations(studentId: string): Promise<ResourceRecommendation[]> {
    const res = ResourceRecommendationEngine.getRecommendations({ studentId, classLevel: 10, board: 'CBSE' });
    return res.recommendations;
  }

  static async refreshRecommendations(studentId: string): Promise<ResourceRecommendation[]> {
    const res = ResourceRecommendationEngine.getRecommendations({ studentId, classLevel: 10, board: 'CBSE' });
    return res.recommendations;
  }

  static async getAllCatalogResources(): Promise<LearningResource[]> {
    return VERIFIED_RESOURCE_CATALOG;
  }
}
