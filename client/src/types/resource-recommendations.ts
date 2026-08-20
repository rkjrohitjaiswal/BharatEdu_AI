export type ResourceType =
  | 'video'
  | 'article'
  | 'textbook'
  | 'documentation'
  | 'notes'
  | 'exercise'
  | 'quiz'
  | 'practice'
  | 'simulation'
  | 'project';

export type RecommendationType =
  | 'prerequisite_repair'
  | 'learning_path_next'
  | 'weak_topic'
  | 'exam_prep'
  | 'revision'
  | 'practice'
  | 'career_skill'
  | 'goal_aligned'
  | 'risk_recovery'
  | 'enrichment';

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';
export type RecommendationStatus = 'recommended' | 'started' | 'completed' | 'dismissed';

export interface ILearningResourceClientDTO {
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

export interface IResourceRecommendationClientDTO {
  id: string;
  studentId: string;
  resourceId: string;
  resource: ILearningResourceClientDTO;
  reason: string;
  recommendationType: RecommendationType;
  priority: RecommendationPriority;
  relevanceScore: number;
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

export interface IResourceRecommendationSummaryClientDTO {
  studentId: string;
  totalRecommendedCount: number;
  todayRecommendedCount: number;
  completedCount: number;
  topRecommendation?: IResourceRecommendationClientDTO;
  avgRelevanceScore: number;
  aiExplanation: string;
  evaluatedAt: string;
}
