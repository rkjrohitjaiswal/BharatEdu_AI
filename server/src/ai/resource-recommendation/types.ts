import { ILearningResource, ResourceDifficulty, ResourceLanguage, ResourceType } from '../../models/learning-resource.model.js';
import { RecommendationContext, RecommendationPriority } from '../../models/resource-recommendation.model.js';

export interface ResourceCandidate {
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
  officialSourceUrl?: string | null;
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

export interface ResourceRankingBreakdown {
  conceptRelevance: number; // Max 25
  learningGapRelevance: number; // Max 15
  prerequisiteRelevance: number; // Max 15
  examRelevance: number; // Max 10
  difficultyFit: number; // Max 10
  learningPathAlignment: number; // Max 10
  careerGoalAlignment: number; // Max 5
  languagePreference: number; // Max 5
  qualityVerification: number; // Max 5
  totalScore: number; // 0 - 100
}

export interface ResourceRecommendation {
  recommendationId: string;
  studentId: string;
  resourceId: string;
  resource?: ResourceCandidate;
  reason: string;
  priority: RecommendationPriority;
  score: number;
  recommendationContext: RecommendationContext;
  breakdown: ResourceRankingBreakdown;
  sourceEntityId?: string;
  expiresAt?: string;
  isDismissed: boolean;
  createdAt: string;
}

export interface StudentResourceContext {
  studentId: string;
  classLevel: string;
  board: string;
  preferredLanguage: ResourceLanguage;
  availableDailyMinutes: number;
  weakConceptIds: string[];
  prerequisiteGaps: string[];
  dueRevisionConceptIds: string[];
  unresolvedDoubtConcepts: string[];
  recentMistakeConcepts: string[];
  currentLearningPathStage: string;
  nextConceptId?: string;
  daysUntilExam: number;
  examCriticalConcepts: string[];
  careerGoalIds: string[];
  careerTags: string[];
  activeGoalConcepts: string[];
  isHighRisk: boolean;
  completedResourceIds: string[];
  skippedResourceIds: string[];
  helpfulResourceTypes: ResourceType[];
  dismissedResourceIds: string[];
}

export interface ResourceExplanation {
  recommendationId: string;
  whyRecommended: string;
  howItHelps: string;
  whatToLearnBefore: string[];
  whatToDoAfter: string;
}

export interface ResourcePreferenceProfile {
  studentId: string;
  preferredLanguage: ResourceLanguage;
  preferredResourceTypes: ResourceType[];
  preferredMaxMinutes: number;
  dislikedResourceIds: string[];
}

export interface ResourceRecommendationSummary {
  studentId: string;
  totalRecommendations: number;
  criticalCount: number;
  topRecommendation?: ResourceRecommendation;
  contextBreakdown: Record<string, number>;
  generatedAt: string;
}
