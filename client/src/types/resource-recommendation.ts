export interface ILearningResourceClient {
  resourceId: string;
  title: string;
  description: string;
  resourceType: 'textbook' | 'chapter' | 'article' | 'video' | 'course' | 'practice_set' | 'worksheet' | 'assessment' | 'simulation' | 'documentation' | 'reference';
  subject: string;
  topic: string;
  conceptId: string;
  classLevel: number;
  board: string;
  language: 'en' | 'hi' | 'gu';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  provider: string;
  officialSource: string;
  sourceUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  careerRelevance?: string[];
  examRelevance?: string[];
  isVerified: boolean;
  isActive: boolean;
}

export interface IResourceRecommendationClient {
  recommendationId?: string;
  studentId: string;
  resourceId: string;
  resource?: ILearningResourceClient;
  reason: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendationScore: number;
  sourceSignals: string[];
  targetConcepts: string[];
  targetGaps: string[];
  targetGoals?: string[];
  examRelevance?: string[];
  careerRelevance?: string[];
  status: 'recommended' | 'viewed' | 'started' | 'completed' | 'dismissed';
  generatedAt: string;
}

export interface IResourceAnalyticsClient {
  resourceId: string;
  views: number;
  starts: number;
  completions: number;
  completionRate: number;
  averageDurationSeconds: number;
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulRate: number;
  dismisses: number;
  dismissRate: number;
}
