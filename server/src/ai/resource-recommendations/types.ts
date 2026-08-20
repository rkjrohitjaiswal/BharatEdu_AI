export type ResourcePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type RecommendationStatusType = 'recommended' | 'started' | 'completed' | 'dismissed' | 'expired';

export interface IResourceData {
  id: string;
  title: string;
  description: string;
  resourceType: string;
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  board: string;
  classLevel: string;
  language: string;
  url: string;
  provider: string;
  sourceDomain: string;
  thumbnailUrl?: string;
  estimatedMinutes: number;
  tags: string[];
  verified: boolean;
  official: boolean;
  active: boolean;
}

export interface IRecommendationData {
  recommendationId: string;
  studentId: string;
  resource: IResourceData;
  topic: string;
  reason: string;
  priority: ResourcePriority;
  relevanceScore: number;
  trustScore: number;
  difficultyMatch: string;
  estimatedMinutes: number;
  sourceFeature: string;
  actionUrl: string;
  status: RecommendationStatusType;
  generatedAt: string;
  expiresAt?: string;
  completedAt?: string;
}

export interface IRecommendationSummaryData {
  studentName: string;
  totalRecommended: number;
  topPriorityResource: IRecommendationData | null;
  highPriorityCount: number;
  activeGapsAddressed: number;
  examUrgencyActive: boolean;
  riskLevel: string;
  summaryMessage: string;
  evaluatedAt: string;
}

export interface IResourceAdviceData {
  recommendationReasoning: string;
  studyStrategy: string;
  personalizedTip: string;
  aiGenerated: boolean;
  evaluatedAt: string;
}
