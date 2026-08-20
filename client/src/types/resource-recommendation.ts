export interface ILearningResourceClient {
  resourceId: string;
  title: string;
  description: string;
  resourceType: string;
  subject: string;
  topic: string;
  conceptId: string;
  classLevel: number;
  board: string;
  language: string;
  difficulty: string;
  durationMinutes: number;
  estimatedMinutes?: number;
  provider: string;
  url: string;
  sourceUrl?: string;
  officialSource?: string;
  verified: boolean;
  isVerified?: boolean;
  status: string;
  learningObjectives?: string[];
  prerequisites?: string[];
}

export interface IResourceRecommendationReasonClient {
  primaryReason: string;
  details: string;
  prerequisitePath?: string[];
  examRelevance?: string;
}

export interface IResourceRecommendationClient {
  resource: ILearningResourceClient;
  recommendationScore: number;
  rank: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  actionType: 'watch' | 'read' | 'practice' | 'revise' | 'solve_doubt' | 'explore';
  reason: IResourceRecommendationReasonClient;
  recommendationId?: string;
  resourceId?: string;
  examRelevance?: string[];
  careerRelevance?: string[];
}

export interface IResourceRankingResultClient {
  topRecommendation: IResourceRecommendationClient;
  recommendations: IResourceRecommendationClient[];
  contextSummary: string;
}

export interface IResourceAnalyticsClient {
  resourceId?: string;
  totalViews: number;
  totalCompletions: number;
  completionRatePct: number;
  completionRate?: number;
  starts?: number;
  helpfulRate?: number;
  averageRating: number;
  averageTimeSpentMinutes: number;
  effectivenessSummary: string;
}
