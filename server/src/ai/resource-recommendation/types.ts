export interface ResourceContext {
  studentId: string;
  subject?: string;
  topic?: string;
  conceptId?: string;
  classLevel: number;
  board: string;
  availableMinutes?: number;
  preferredLanguage?: 'en' | 'hi' | 'gu';
  preferredType?: string;
  examApproaching?: boolean;
  revisionDue?: boolean;
}

export interface ResourceCandidate {
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
  provider: string;
  url: string;
  officialSource?: string;
  officialSourceUrl?: string;
  sourceUrl?: string;
  verified: boolean;
  isVerified?: boolean;
  status: string;
  isActive?: boolean;
  prerequisites?: string[];
  tags?: string[];
  examRelevance?: string[];
  careerRelevance?: string[];
  estimatedMinutes?: number;
}

export interface ResourceRecommendationReason {
  primaryReason: string;
  details: string;
  prerequisitePath?: string[];
  examRelevance?: string;
  learningPathConnection?: string;
}

export interface ResourceRecommendation {
  resource: ResourceCandidate;
  recommendationScore: number; // 0 - 100
  totalScore?: number;
  rank: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: ResourceRecommendationReason;
  actionType: 'watch' | 'read' | 'practice' | 'revise' | 'solve_doubt' | 'explore';
}

export interface ResourceRankingResult {
  topRecommendation: ResourceRecommendation;
  recommendations: ResourceRecommendation[];
  contextSummary: string;
}

export interface StudentLearningProfile {
  studentId: string;
  weakConcepts: string[];
  prerequisiteGaps: string[];
  masteryMap: Record<string, number>;
  mastery?: Record<string, number>;
  revisionDueConcepts: string[];
  revisionDueTopics?: string[];
  recentAssessmentAccuracy: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore?: number;
  examId?: string;
  targetExamDate?: Date;
  examTargets?: string[];
  activeGoals?: string[];
  careerSkills?: string[];
  language?: string;
}

export interface ResourceFeedbackSummary {
  resourceId: string;
  totalRatings: number;
  averageRating: number;
  helpfulCount: number;
  helpfulPct: number;
}

export interface ResourceRecommendationSummary {
  recommendations: ResourceRecommendation[];
  summaryGeneratedAt: Date;
}

// Legacy Type Aliases for Backward Compatibility
export type LearningResource = ResourceCandidate;
export type StudentResourceProfile = StudentLearningProfile;
export type RecommendationScore = ResourceRecommendation;
export interface RecommendationSignal {
  type?: string;
  signalType?: string;
  weight?: number;
  score?: number;
  reason?: string;
  targetConcept?: string;
  [key: string]: any;
}
export interface ResourceFeedback {
  feedbackId: string;
  studentId: string;
  resourceId: string;
  rating: number;
  helpful: boolean;
  comment?: string;
  feedbackType?: string;
}
