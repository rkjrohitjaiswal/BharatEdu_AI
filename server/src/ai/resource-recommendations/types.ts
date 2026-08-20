import { ResourceType } from '../../models/learning-resource.model.js';

export interface IResourceItem {
  resourceId: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  subject: string;
  topic: string;
  conceptId: string;
  classLevel: string;
  board: string;
  difficulty: 'foundational' | 'easy' | 'medium' | 'hard' | 'advanced' | 'beginner' | 'intermediate';
  estimatedMinutes: number;
  provider: string;
  officialSourceUrl?: string;
  tags: string[];
  language: string;
  isVerified: boolean;
  active: boolean;
}

export interface IRecommendationResult {
  resourceId: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  subject: string;
  topic: string;
  conceptId: string;
  reason: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedMinutes: number;
  relatedConcept: string;
  relatedTopic: string;
  actionUrl: string;
  relevanceScore: number; // 0 to 100
  isVerified: boolean;
  provider: string;
  officialSourceUrl?: string;
}

export interface IResourceHubSummaryData {
  studentId: string;
  totalRecommended: number;
  topRecommendation: IRecommendationResult | null;
  prerequisiteGapRecommendationsCount: number;
  weakTopicRecommendationsCount: number;
  examUrgencyRecommendationsCount: number;
  quickUnder15MinCount: number;
  evaluatedAt: string;
}
