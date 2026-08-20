import { dataRepository } from '../../repositories/data.repository.js';
import { STARTER_RESOURCE_CATALOG } from './catalog.js';
import { buildStudentResourceContext } from './context.js';
import { matchResourceCandidate } from './matcher.js';
import { applyPersonalizationFilters } from './personalization.js';
import { validateResourceQuality } from './quality.js';
import { rankResourceCandidate } from './ranker.js';
import { evaluateRecommendationPriorityAndContext } from './rules.js';
import { ResourceCandidate, ResourceRecommendation } from './types.js';

export function getAllCatalogResources(): ResourceCandidate[] {
  return STARTER_RESOURCE_CATALOG;
}

export async function generateResourceRecommendationsPipeline(
  studentId: string
): Promise<ResourceRecommendation[]> {
  // 1. Build student context
  const context = await buildStudentResourceContext(studentId);

  // 2. Collect candidate resources from DB and starter catalog
  const dbResources: ResourceCandidate[] = (await dataRepository.getLearningResources()) || [];
  const candidatePool: ResourceCandidate[] = [...STARTER_RESOURCE_CATALOG, ...dbResources];

  // Deduplicate candidates by resourceId
  const candidateMap = new Map<string, ResourceCandidate>();
  candidatePool.forEach((res) => {
    if (!candidateMap.has(res.resourceId)) {
      candidateMap.set(res.resourceId, res);
    }
  });

  const uniqueCandidates = Array.from(candidateMap.values());

  // 3. Validate quality
  const validCandidates = uniqueCandidates.filter((res) => {
    const qCheck = validateResourceQuality(res);
    return qCheck.isValid;
  });

  // 4. Apply Personalization & Language Filters
  const { filteredCandidates } = applyPersonalizationFilters(validCandidates, context);

  const recommendations: ResourceRecommendation[] = [];

  // 5-13. Matching, Ranking, Rules, Priority, Explanation
  for (const candidate of filteredCandidates) {
    const match = matchResourceCandidate(candidate, context);
    if (!match.isMatch) continue;

    const { totalScore, breakdown } = rankResourceCandidate(candidate, context);
    const { priority, recommendationContext, reason } = evaluateRecommendationPriorityAndContext(
      candidate,
      context,
      totalScore
    );

    const recId = `rec_${studentId}_${candidate.resourceId}_${recommendationContext}`;

    const recItem: ResourceRecommendation = {
      recommendationId: recId,
      studentId,
      resourceId: candidate.resourceId,
      resource: candidate,
      reason,
      priority,
      score: totalScore,
      recommendationContext,
      breakdown,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    };

    recommendations.push(recItem);
  }

  // Sort recommendations by score descending
  recommendations.sort((a, b) => b.score - a.score);

  // 14. Persist recommendations to DB
  for (const rec of recommendations) {
    await dataRepository.createResourceRecommendation({
      recommendationId: rec.recommendationId,
      studentId,
      resourceId: rec.resourceId,
      reason: rec.reason,
      priority: rec.priority,
      score: rec.score,
      recommendationContext: rec.recommendationContext,
      isDismissed: false,
    });
  }

  return recommendations;
}
