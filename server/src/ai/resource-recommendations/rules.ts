import { IRecommendationResult, IResourceItem } from './types.js';

export function rankResourceItem(
  resource: IResourceItem,
  context: {
    prerequisiteGapConceptIds: string[];
    weakConceptIds: string[];
    highRiskConceptIds: string[];
    examPriorityConceptIds: string[];
    goalConceptIds: string[];
  }
): IRecommendationResult {
  let score = 50; // base score
  let reason = 'General learning reinforcement resource.';
  let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';

  const isPrereqGap = context.prerequisiteGapConceptIds.includes(resource.conceptId);
  const isWeak = context.weakConceptIds.includes(resource.conceptId);
  const isHighRisk = context.highRiskConceptIds.includes(resource.conceptId);
  const isExamPriority = context.examPriorityConceptIds.includes(resource.conceptId);
  const isGoal = context.goalConceptIds.includes(resource.conceptId);

  if (isPrereqGap) {
    score += 35;
    reason = `Fix Root Prerequisite Gap in ${resource.topic} to unlock downstream concepts.`;
    priority = 'CRITICAL';
  } else if (isHighRisk) {
    score += 25;
    reason = `High Risk Area: Reinforce ${resource.topic} to prevent academic decline.`;
    priority = 'CRITICAL';
  } else if (isWeak) {
    score += 20;
    reason = `Weak Concept: Improve mastery in ${resource.topic}.`;
    priority = 'HIGH';
  } else if (isExamPriority) {
    score += 18;
    reason = `Exam Priority: High-weight topic for your upcoming assessment.`;
    priority = 'HIGH';
  } else if (isGoal) {
    score += 12;
    reason = `Goal Alignment: Essential for your career & target learning goal.`;
    priority = 'MEDIUM';
  }

  const boundedScore = Math.min(100, Math.max(0, score));

  return {
    resourceId: resource.resourceId,
    title: resource.title,
    description: resource.description,
    resourceType: resource.resourceType,
    subject: resource.subject,
    topic: resource.topic,
    conceptId: resource.conceptId,
    reason,
    priority,
    estimatedMinutes: resource.estimatedMinutes,
    relatedConcept: resource.conceptId,
    relatedTopic: resource.topic,
    actionUrl: `/resources`,
    relevanceScore: boundedScore,
    isVerified: resource.isVerified,
    provider: resource.provider,
    officialSourceUrl: resource.officialSourceUrl,
  };
}

export function deduplicateRecommendations(recs: IRecommendationResult[]): IRecommendationResult[] {
  const seen = new Set<string>();
  return recs.filter((r) => {
    if (seen.has(r.resourceId)) return false;
    seen.add(r.resourceId);
    return true;
  });
}
