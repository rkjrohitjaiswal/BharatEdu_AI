export type ResourceType =
  | 'video'
  | 'article'
  | 'textbook'
  | 'ncert'
  | 'worksheet'
  | 'practice'
  | 'quiz'
  | 'assessment'
  | 'documentation'
  | 'coding_exercise'
  | 'simulation'
  | 'notes'
  | 'course';

export type ResourceDifficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'advanced';
export type ResourceLanguage = 'en' | 'hi' | 'gu';
export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';
export type RecommendationContext =
  | 'learning_gap'
  | 'prerequisite'
  | 'exam'
  | 'doubt'
  | 'mistake'
  | 'revision'
  | 'learning_path'
  | 'career'
  | 'goal'
  | 'risk'
  | 'practice'
  | 'general';

export interface ILearningResourceClient {
  resourceId: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  subject: string;
  topicId: string;
  conceptId: string;
  classLevel: string;
  board: string;
  language: ResourceLanguage;
  difficulty: ResourceDifficulty;
  estimatedMinutes: number;
  provider: string;
  author?: string;
  url?: string | null;
  thumbnailUrl?: string | null;
  official: boolean;
  verified: boolean;
  tags: string[];
  prerequisites: string[];
  careerTags: string[];
  examTags: string[];
  qualityScore: number;
  popularityScore: number;
  freshnessScore: number;
}

export interface IResourceRankingBreakdownClient {
  conceptRelevance: number;
  learningGapRelevance: number;
  prerequisiteRelevance: number;
  examRelevance: number;
  difficultyFit: number;
  learningPathAlignment: number;
  careerGoalAlignment: number;
  languagePreference: number;
  qualityVerification: number;
  totalScore: number;
}

export interface IResourceRecommendationClient {
  recommendationId: string;
  studentId: string;
  resourceId: string;
  resource?: ILearningResourceClient;
  reason: string;
  priority: RecommendationPriority;
  score: number;
  recommendationContext: RecommendationContext;
  breakdown?: IResourceRankingBreakdownClient;
  isDismissed: boolean;
  createdAt: string;
}

export interface IResourceBookmarkClient {
  _id?: string;
  resourceId: string;
  studentId: string;
  note?: string;
  resource?: ILearningResourceClient;
  createdAt: string;
}

export interface IResourceInteractionClient {
  _id?: string;
  resourceId: string;
  studentId: string;
  interactionType: string;
  progressPercent: number;
  durationSeconds: number;
  createdAt: string;
}
