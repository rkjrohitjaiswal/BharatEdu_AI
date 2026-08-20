import { dataRepository } from '../../repositories/data.repository.js';
import { getStudentConceptReadinessList, getStudentRootLearningGaps } from '../knowledge-graph/engine.js';
import { getStudentLearningPathDetailsEngine } from '../learning-path/engine.js';
import { VERIFIED_RESOURCE_CATALOG } from './catalog.js';
import { calculateDeterministicResourceRelevanceScore } from './rules.js';
import { IResourceRecommendationDTO, IResourceRecommendationSummaryData } from './types.js';

export async function seedOrRefreshStudentResourceRecommendationsEngine(studentId: string): Promise<IResourceRecommendationDTO[]> {
  // Aggregate Authoritative Context across Features 1–25
  const rootGaps = await getStudentRootLearningGaps(studentId);
  const readinessList = await getStudentConceptReadinessList(studentId);
  const learningPath = await getStudentLearningPathDetailsEngine(studentId);
  const studyPlan = await dataRepository.getStudentStudyPlan(studentId);

  const availableDailyMinutes = studyPlan?.availableDailyMinutes || 60;
  const topGap = rootGaps[0];
  const nextPathConceptId = learningPath.nextBestConcept?.conceptId;

  // Process Catalog Resources
  const recommendations: IResourceRecommendationDTO[] = [];

  for (const resource of VERIFIED_RESOURCE_CATALOG) {
    const isPrerequisiteGap = Boolean(
      topGap && resource.conceptIds.some((c) => c === topGap.rootGapConceptId)
    );

    const isNextLearningPathConcept = Boolean(
      nextPathConceptId && resource.conceptIds.some((c) => c === nextPathConceptId)
    );

    // Prerequisite Check: If any prerequisite is blocked, skip advanced resource
    const matchingReadiness = readinessList.find((r) => resource.conceptIds.includes(r.conceptId));
    if (matchingReadiness?.isBlocked && !isPrerequisiteGap) {
      continue;
    }

    const masteryScore = matchingReadiness?.directMastery ?? 50;
    const masteryGapScore = 100 - masteryScore;

    const { relevanceScore, recommendationType, priority, reason } =
      calculateDeterministicResourceRelevanceScore({
        resource,
        isPrerequisiteGap,
        isNextLearningPathConcept,
        masteryGapScore,
        isExamUrgent: false,
        isCareerRelevant: resource.careerIds.length > 0,
        isGoalAligned: true,
        isHighRisk: topGap?.severity === 'critical',
        isRevisionDue: masteryScore < 50,
        availableDailyMinutes,
      });

    const dedupeKey = `rec_${studentId}_${resource.resourceId}`;

    const recObj = await dataRepository.createRecommendation({
      studentId,
      resourceId: resource.resourceId,
      reason,
      recommendationType,
      priority,
      relevanceScore,
      difficultyMatch: 80,
      masteryMatch: Math.max(50, 100 - masteryGapScore),
      goalMatch: 75,
      examMatch: 70,
      careerMatch: 70,
      riskMatch: 60,
      prerequisiteMatch: isPrerequisiteGap ? 100 : 80,
      estimatedMinutes: resource.estimatedMinutes,
      status: 'recommended',
      dedupeKey,
    });

    const recId = String(recObj._id || recObj.id || dedupeKey);

    recommendations.push({
      id: recId,
      studentId: String(studentId),
      resourceId: resource.resourceId,
      resource,
      reason,
      recommendationType,
      priority,
      relevanceScore,
      difficultyMatch: 80,
      masteryMatch: Math.max(50, 100 - masteryGapScore),
      goalMatch: 75,
      examMatch: 70,
      careerMatch: 70,
      riskMatch: 60,
      prerequisiteMatch: isPrerequisiteGap ? 100 : 80,
      estimatedMinutes: resource.estimatedMinutes,
      status: recObj.status || 'recommended',
      recommendedAt: recObj.recommendedAt ? new Date(recObj.recommendedAt).toISOString() : new Date().toISOString(),
      actionUrl: resource.url || resource.officialSourceUrl || `/resources`,
    });
  }

  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export async function getStudentResourceRecommendationsEngine(studentId: string): Promise<IResourceRecommendationDTO[]> {
  const existingRecs = await dataRepository.getStudentRecommendations(studentId);
  if (!existingRecs || existingRecs.length === 0) {
    return await seedOrRefreshStudentResourceRecommendationsEngine(studentId);
  }

  return (existingRecs || []).map((r: any) => {
    const catalogItem =
      VERIFIED_RESOURCE_CATALOG.find((c) => c.resourceId === r.resourceId) || VERIFIED_RESOURCE_CATALOG[0];

    return {
      id: String(r._id || r.id),
      studentId: String(studentId),
      resourceId: r.resourceId,
      resource: catalogItem,
      reason: r.reason,
      recommendationType: r.recommendationType || 'learning_path_next',
      priority: r.priority || 'medium',
      relevanceScore: r.relevanceScore || 75,
      difficultyMatch: r.difficultyMatch || 80,
      masteryMatch: r.masteryMatch || 75,
      goalMatch: r.goalMatch || 50,
      examMatch: r.examMatch || 50,
      careerMatch: r.careerMatch || 50,
      riskMatch: r.riskMatch || 50,
      prerequisiteMatch: r.prerequisiteMatch || 80,
      estimatedMinutes: r.estimatedMinutes || 15,
      status: r.status || 'recommended',
      recommendedAt: r.recommendedAt ? new Date(r.recommendedAt).toISOString() : new Date().toISOString(),
      startedAt: r.startedAt ? new Date(r.startedAt).toISOString() : undefined,
      completedAt: r.completedAt ? new Date(r.completedAt).toISOString() : undefined,
      dismissedAt: r.dismissedAt ? new Date(r.dismissedAt).toISOString() : undefined,
      actionUrl: catalogItem.url || catalogItem.officialSourceUrl || `/resources`,
    };
  }).sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);
}

export async function getResourceRecommendationSummaryEngine(studentId: string): Promise<IResourceRecommendationSummaryData> {
  const recs = await getStudentResourceRecommendationsEngine(studentId);
  const activeRecs = recs.filter((r) => r.status !== 'dismissed');

  const top = activeRecs[0];
  const completedCount = recs.filter((r) => r.status === 'completed').length;
  const avgScore =
    activeRecs.length > 0
      ? Math.round(activeRecs.reduce((acc, curr) => acc + curr.relevanceScore, 0) / activeRecs.length)
      : 75;

  return {
    studentId: String(studentId),
    totalRecommendedCount: activeRecs.length,
    todayRecommendedCount: activeRecs.filter((r) => r.status === 'recommended' || r.status === 'started').length,
    completedCount,
    topRecommendation: top,
    avgRelevanceScore: avgScore,
    aiExplanation: top
      ? `Top Recommendation: "${top.resource.title}". ${top.reason}`
      : 'Maintain daily resource study aligned with your Learning Path.',
    evaluatedAt: new Date().toISOString(),
  };
}
