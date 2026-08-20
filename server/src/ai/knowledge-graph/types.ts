import { DependencyType } from '../../models/concept-dependency.model.js';
import { ConceptMasteryStatus } from '../../models/student-concept-mastery.model.js';

export type ReadinessLevel = 'blocked' | 'weak' | 'developing' | 'ready' | 'strong';

export interface IConceptNode {
  conceptId: string;
  name: string;
  subject: string;
  classLevel: string;
  board: string;
  description: string;
  aliases: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  officialSourceUrl?: string;
}

export interface IConceptDependencyEdge {
  prerequisiteConceptId: string;
  dependentConceptId: string;
  dependencyType: DependencyType;
  strength: number;
  confidence: number;
}

export interface IStudentConceptReadinessData {
  conceptId: string;
  conceptName: string;
  subject: string;
  directMastery: number; // 0-100
  prerequisiteMastery: number; // 0-100
  readinessScore: number; // 0-100
  readinessLevel: ReadinessLevel;
  masteryStatus: ConceptMasteryStatus;
  isBlocked: boolean;
  blockingPrerequisites: string[];
  lastAssessedAt?: string;
}

export interface IRootLearningGapData {
  rootGapConceptId: string;
  rootGapConceptName: string;
  subject: string;
  masteryScore: number;
  affectedConceptsCount: number;
  affectedConcepts: string[];
  prerequisiteChain: string[];
  severity: 'critical' | 'high' | 'medium';
  recommendedNextConcept: string;
  explanation: string;
}

export interface IConceptRecommendationData {
  conceptId: string;
  conceptName: string;
  subject: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  readinessScore: number;
  unblocksCount: number;
  actionUrl: string;
}

export interface IKnowledgeGraphSummaryData {
  studentId: string;
  studentName: string;
  totalConcepts: number;
  strongConceptsCount: number;
  developingConceptsCount: number;
  weakConceptsCount: number;
  blockedConceptsCount: number;
  rootGapsCount: number;
  topRootGap: IRootLearningGapData | null;
  overallHealthScore: number; // 0-100
  summaryMessage: string;
  evaluatedAt: string;
}

export interface IKnowledgeGraphAIAdviceData {
  explanation: string;
  recommendedSequence: string[];
  teacherTip?: string;
  parentTip?: string;
  aiGenerated: boolean;
  evaluatedAt: string;
}
