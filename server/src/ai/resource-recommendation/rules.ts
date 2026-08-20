import { RecommendationPriority, RecommendationType } from '../../models/student-resource-recommendation.model.js';
import { ILearningResourceDTO } from './types.js';

export interface IResourceMatchScoreInput {
  resource: ILearningResourceDTO;
  isPrerequisiteGap: boolean;
  isNextLearningPathConcept: boolean;
  masteryGapScore: number; // 0 to 100 (100 - mastery)
  isExamUrgent: boolean;
  isCareerRelevant: boolean;
  isGoalAligned: boolean;
  isHighRisk: boolean;
  isRevisionDue: boolean;
  availableDailyMinutes: number;
}

export function calculateDeterministicResourceRelevanceScore(input: IResourceMatchScoreInput): {
  relevanceScore: number; // 0 to 100
  recommendationType: RecommendationType;
  priority: RecommendationPriority;
  reason: string;
} {
  const {
    resource,
    isPrerequisiteGap,
    isNextLearningPathConcept,
    masteryGapScore,
    isExamUrgent,
    isCareerRelevant,
    isGoalAligned,
    isHighRisk,
    isRevisionDue,
    availableDailyMinutes,
  } = input;

  // 1. Component Weighted Scores (Total = 100)
  const prereqScore = isPrerequisiteGap ? 20 : 0;
  const pathScore = isNextLearningPathConcept ? 15 : 0;
  const masteryScore = Math.round((masteryGapScore / 100) * 15);
  const examScore = isExamUrgent ? 15 : 0;
  const careerScore = isCareerRelevant ? 10 : 0;
  const goalScore = isGoalAligned ? 10 : 0;
  const riskScore = isHighRisk ? 5 : 0;
  const revisionScore = isRevisionDue ? 5 : 0;

  // Time & Difficulty fit (5%)
  const fitsTimeBudget = resource.estimatedMinutes <= availableDailyMinutes;
  const timeFitScore = fitsTimeBudget ? 5 : 2;

  const totalRaw =
    prereqScore +
    pathScore +
    masteryScore +
    examScore +
    careerScore +
    goalScore +
    riskScore +
    revisionScore +
    timeFitScore;

  const relevanceScore = Math.min(100, Math.max(0, totalRaw));

  // Determine Type & Priority based on top driving factor
  let recommendationType: RecommendationType = 'enrichment';
  let priority: RecommendationPriority = 'low';
  let reason = `Recommended educational resource for ${resource.subject}.`;

  if (isPrerequisiteGap) {
    recommendationType = 'prerequisite_repair';
    priority = 'critical';
    reason = `Fix Prerequisite Gap: Highly recommended to repair foundational concepts before advancing.`;
  } else if (isHighRisk) {
    recommendationType = 'risk_recovery';
    priority = 'critical';
    reason = `Academic Recovery: High-value resource to recover weak performance areas.`;
  } else if (isExamUrgent) {
    recommendationType = 'exam_prep';
    priority = 'high';
    reason = `Exam Priority: Highly weighted resource for your upcoming board examination.`;
  } else if (isNextLearningPathConcept) {
    recommendationType = 'learning_path_next';
    priority = 'high';
    reason = `Learning Path Alignment: Directly supports your next active curriculum stage.`;
  } else if (isRevisionDue) {
    recommendationType = 'revision';
    priority = 'medium';
    reason = `Spaced Repetition: Consolidate long-term memory for reviewed concepts.`;
  } else if (isGoalAligned) {
    recommendationType = 'goal_aligned';
    priority = 'medium';
    reason = `Goal Support: Contributes directly to your active learning target.`;
  } else if (isCareerRelevant) {
    recommendationType = 'career_skill';
    priority = 'medium';
    reason = `Career Alignment: Builds essential skills for your target career roadmap.`;
  } else if (masteryGapScore > 40) {
    recommendationType = 'weak_topic';
    priority = 'medium';
    reason = `Strengthen Mastery: Recommended to boost understanding in weak topics.`;
  } else {
    recommendationType = 'practice';
    priority = 'low';
    reason = `Practice Reinforcement: Consolidated learning exercise.`;
  }

  return {
    relevanceScore,
    recommendationType,
    priority,
    reason,
  };
}
