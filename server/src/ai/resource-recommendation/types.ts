import { RecommendationPriority, RecommendationStatus, RecommendationType } from '../../models/student-resource-recommendation.model.js';
import { ResourceType } from '../../models/learning-resource.model.js';

export interface ILearningResourceDTO {
  resourceId: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  subject: string;
  classLevel: string;
  board: string;
  topicIds: string[];
  conceptIds: string[];
  skillIds: string[];
  careerIds: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  language: string;
  provider: string;
  officialSource?: string;
  officialSourceUrl?: string;
  url?: string;
  qualityScore: number;
  isVerified: boolean;
  tags: string[];
}

export interface IResourceRecommendationDTO {
  id: string;
  studentId: string;
  resourceId: string;
  resource: ILearningResourceDTO;
  reason: string;
  recommendationType: RecommendationType;
  priority: RecommendationPriority;
  relevanceScore: number; // 0 to 100
  difficultyMatch: number;
  masteryMatch: number;
  goalMatch: number;
  examMatch: number;
  careerMatch: number;
  riskMatch: number;
  prerequisiteMatch: number;
  estimatedMinutes: number;
  status: RecommendationStatus;
  recommendedAt: string;
  startedAt?: string;
  completedAt?: string;
  dismissedAt?: string;
  actionUrl: string;
}

export interface IResourceRecommendationSummaryData {
  studentId: string;
  totalRecommendedCount: number;
  todayRecommendedCount: number;
  completedCount: number;
  topRecommendation?: IResourceRecommendationDTO;
  avgRelevanceScore: number;
  aiExplanation: string;
  evaluatedAt: string;
}
