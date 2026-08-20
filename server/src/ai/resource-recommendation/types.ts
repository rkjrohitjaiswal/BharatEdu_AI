export interface LearningResource {
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
  officialSourceUrl?: string;
  sourceUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  careerRelevance?: string[];
  examRelevance?: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResourceCandidate {
  resource: LearningResource;
  signals: RecommendationSignal[];
  score: RecommendationScore;
}

export interface RecommendationSignal {
  type: 'learningGap' | 'prerequisiteGap' | 'examRelevance' | 'masteryNeed' | 'goalAlignment' | 'careerAlignment' | 'riskAlignment' | 'revisionNeed' | 'resourcePreference';
  weight: number;
  reason: string;
  targetConcept?: string;
}

export interface RecommendationScore {
  totalScore: number; // 0 - 100
  priority: 'critical' | 'high' | 'medium' | 'low';
  breakdown: Record<string, number>;
}

export interface ResourceRecommendation {
  recommendationId?: string;
  studentId: string;
  resourceId: string;
  resource?: LearningResource;
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
  expiresAt?: string;
}

export interface StudentResourceProfile {
  studentId: string;
  classLevel: number;
  board: string;
  language: 'en' | 'hi' | 'gu';
  mastery: number;
  riskScore: number;
  weakConcepts: string[];
  prerequisiteGaps: string[];
  repeatedMistakes: string[];
  revisionDueTopics: string[];
  activeGoals: string[];
  examTargets: string[];
  careerSkills: string[];
  doubtTopics: string[];
  learningPathStage?: string;
  completedResourceIds: string[];
  dismissedResourceIds: string[];
}

export interface ResourceRecommendationSummary {
  totalRecommended: number;
  criticalCount: number;
  highCount: number;
  collectionsCount: number;
  topRecommendation?: ResourceRecommendation;
}

export interface ResourceExplanation {
  resourceId: string;
  whyThisResource: string;
  whyNow: string;
  whatToLearnFirst: string;
  connectionToGoal: string;
  recommendedDurationMinutes: number;
}

export interface ResourceFeedback {
  studentId: string;
  resourceId: string;
  feedbackType: 'helpful' | 'not_helpful' | 'too_easy' | 'too_difficult' | 'too_long' | 'wrong_level' | 'wrong_topic';
  comment?: string;
}

export interface ResourceCollection {
  id: string;
  title: string;
  description: string;
  icon?: string;
  resources: LearningResource[];
}
