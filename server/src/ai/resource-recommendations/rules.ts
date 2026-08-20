import { CatalogResource } from './catalog.js';
import { IRecommendationData, ResourcePriority } from './types.js';

export function calculateDeterministicTrustScore(resource: CatalogResource): number {
  if (resource.verified && resource.official) return 100;
  if (resource.verified) return 80;
  return 40; // Unverified source disclaimer ranking cap
}

export function calculateDeterministicRelevanceScore(
  resource: CatalogResource,
  context: {
    gaps: Array<{ topicName: string; severity: string; subject: string }>;
    exam?: { title: string; daysRemaining: number; priorityTopics: string[] };
    mistakes: Array<{ concept: string; mistakeCount: number }>;
    weakSubjects: Array<{ subject: string; score: number }>;
    activeGoals: Array<{ title: string; progress: number }>;
    riskLevel: string;
    availableMinutes: number;
    careerRole?: string;
  }
): { score: number; priority: ResourcePriority; reason: string; sourceFeature: string } {
  let score = 0;
  let priority: ResourcePriority = 'LOW';
  let reason = 'General learning enrichment resource.';
  let sourceFeature = 'Learning Resource Catalog';

  const resTopic = resource.topic.toLowerCase();
  const resSubject = resource.subject.toLowerCase();

  // 1. Learning Gap Relevance (Max 25 pts)
  const matchedGap = context.gaps.find(
    (g) => resTopic.includes(g.topicName.toLowerCase()) || g.topicName.toLowerCase().includes(resTopic)
  );
  if (matchedGap) {
    if (matchedGap.severity === 'critical') {
      score += 25;
      priority = 'CRITICAL';
      reason = `Directly addresses critical learning gap in ${matchedGap.topicName}.`;
      sourceFeature = 'Learning Gaps';
    } else if (matchedGap.severity === 'high') {
      score += 20;
      priority = 'HIGH';
      reason = `Recommended to resolve high-severity learning gap in ${matchedGap.topicName}.`;
      sourceFeature = 'Learning Gaps';
    } else {
      score += 15;
      priority = 'MEDIUM';
      reason = `Addresses active learning gap in ${matchedGap.topicName}.`;
      sourceFeature = 'Learning Gaps';
    }
  }

  // 2. Exam Urgency (Max 20 pts)
  if (context.exam && context.exam.daysRemaining <= 14) {
    const isExamTopic =
      resSubject.includes('exam') ||
      context.exam.priorityTopics.some((t) => resTopic.includes(t.toLowerCase()) || t.toLowerCase().includes(resTopic));
    if (isExamTopic) {
      score += 20;
      if (context.exam.daysRemaining <= 7 && priority !== 'CRITICAL') {
        priority = 'CRITICAL';
      } else if (priority === 'LOW') {
        priority = 'HIGH';
      }
      reason = `Essential preparation for ${context.exam.title} (${context.exam.daysRemaining} days remaining).`;
      sourceFeature = 'Exam Readiness';
    }
  }

  // 3. Mastery Weakness (Max 15 pts)
  const matchedWeak = context.weakSubjects.find(
    (w) => resSubject.includes(w.subject.toLowerCase()) || w.subject.toLowerCase().includes(resSubject)
  );
  if (matchedWeak) {
    const weaknessPts = Math.min(15, Math.round((100 - matchedWeak.score) * 0.2));
    score += weaknessPts;
    if (priority === 'LOW') priority = 'MEDIUM';
    if (!reason.includes('gap') && !reason.includes('Exam')) {
      reason = `Recommended because your current mastery in ${matchedWeak.subject} is low (${matchedWeak.score}%).`;
      sourceFeature = 'Topic Mastery';
    }
  }

  // 4. Mistakes Evidence (Max 15 pts)
  const matchedMistake = context.mistakes.find(
    (m) => resTopic.includes(m.concept.toLowerCase()) || m.concept.toLowerCase().includes(resTopic)
  );
  if (matchedMistake) {
    score += Math.min(15, 8 + matchedMistake.mistakeCount * 2);
    if (priority === 'LOW') priority = 'HIGH';
    if (!reason.includes('gap') && !reason.includes('Exam')) {
      reason = `Concept review recommended after ${matchedMistake.mistakeCount} recent mistake attempts in ${matchedMistake.concept}.`;
      sourceFeature = 'Mistake Review';
    }
  }

  // 5. Goal Relevance (Max 10 pts)
  const matchedGoal = context.activeGoals.find(
    (g) => resTopic.includes(g.title.toLowerCase()) || g.title.toLowerCase().includes(resTopic)
  );
  if (matchedGoal) {
    score += 10;
    if (priority === 'LOW') priority = 'MEDIUM';
    if (!reason.includes('gap') && !reason.includes('Exam')) {
      reason = `Aligns with your active goal: ${matchedGoal.title}.`;
      sourceFeature = 'Learning Goals';
    }
  }

  // 6. Risk Relevance (Max 5 pts)
  if (context.riskLevel === 'critical' || context.riskLevel === 'high') {
    score += 5;
    if (priority === 'LOW') priority = 'HIGH';
  }

  // 7. Time Budget Match (Max 5 pts)
  if (resource.estimatedMinutes <= context.availableMinutes) {
    score += 5;
  } else {
    // Exceeds available study budget
    score = Math.max(0, score - 5);
  }

  // 8. Resource Trust Factor (Max 5 pts)
  if (resource.verified) score += 3;
  if (resource.official) score += 2;

  // 9. Career Alignment (if applicable)
  if (context.careerRole && resource.resourceType === 'career_resource') {
    score += 8;
    if (!reason.includes('gap') && !reason.includes('Exam')) {
      reason = `Career skill resource for target role: ${context.careerRole}.`;
      sourceFeature = 'Career Roadmap';
    }
  }

  // Baseline minimum score for catalog item
  const boundedScore = Math.min(100, Math.max(10, score));

  return { score: boundedScore, priority, reason, sourceFeature };
}

export function filterAndDiverseRecommendations(
  candidates: IRecommendationData[],
  maxTotal: number = 10,
  maxPerTopic: number = 3
): IRecommendationData[] {
  // Sort deterministically by relevanceScore DESC, trustScore DESC
  candidates.sort((a, b) => b.relevanceScore - a.relevanceScore || b.trustScore - a.trustScore);

  const result: IRecommendationData[] = [];
  const topicCounts: Map<string, number> = new Map();
  const typeCounts: Map<string, number> = new Map();

  for (const item of candidates) {
    if (result.length >= maxTotal) break;

    const topicKey = item.topic.toLowerCase();
    const typeKey = item.resource.resourceType;

    const tCount = topicCounts.get(topicKey) || 0;
    const typeCount = typeCounts.get(typeKey) || 0;

    // Diversity bounds: max per topic & prevent type clutter (max 4 per resourceType)
    if (tCount < maxPerTopic && typeCount < 4) {
      result.push(item);
      topicCounts.set(topicKey, tCount + 1);
      typeCounts.set(typeKey, typeCount + 1);
    }
  }

  return result;
}
