import { ResourceRecommendationEngine } from './engine.js';
import { VERIFIED_RESOURCE_CATALOG } from './catalog.js';
import { LearningResource, ResourceRecommendation } from './types.js';

export class LearningResourceService {
  static async getRecommendations(studentId: string): Promise<ResourceRecommendation[]> {
    return await ResourceRecommendationEngine.generateRecommendations(studentId);
  }

  static async refreshRecommendations(studentId: string): Promise<ResourceRecommendation[]> {
    return await ResourceRecommendationEngine.generateRecommendations(studentId);
  }

  static async getAllCatalogResources(): Promise<LearningResource[]> {
    return VERIFIED_RESOURCE_CATALOG;
  }
}
