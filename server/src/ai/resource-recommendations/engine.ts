import { dataRepository } from '../../repositories/data.repository.js';
import { isDBConnected } from '../../services/db.js';
import { LearningResource } from '../../models/learning-resource.model.js';
import { getStudentConceptReadinessList, getStudentRootLearningGaps } from '../knowledge-graph/engine.js';
import { STARTER_RESOURCE_CATALOG } from './catalog.js';
import { deduplicateRecommendations, rankResourceItem } from './rules.js';
import { IRecommendationResult, IResourceHubSummaryData, IResourceItem } from './types.js';

export async function getAllCatalogResources(): Promise<IResourceItem[]> {
  if (isDBConnected()) {
    const dbRes = await LearningResource.find({ active: true }).lean();
    if (dbRes && dbRes.length > 0) return dbRes as any;
  }
  return STARTER_RESOURCE_CATALOG;
}

export async function getStudentResourceRecommendationsEngine(
  studentId: string
): Promise<IRecommendationResult[]> {
  const catalog = await getAllCatalogResources();

  // Gather Authoritative Student Context (Features 1-22)
  const rootGaps = await getStudentRootLearningGaps(studentId);
  const prereqGapConceptIds = rootGaps.map((g) => g.rootGapConceptId);

  const readinessList = await getStudentConceptReadinessList(studentId);
  const weakConceptIds = readinessList
    .filter((r) => r.readinessLevel === 'weak' || r.readinessLevel === 'blocked')
    .map((r) => r.conceptId);

  // Existing Learning Gaps (Feature 1)
  const gaps = await dataRepository.getStudentGaps(studentId);
  (gaps || []).forEach((g: any) => {
    if (g.status === 'active' && g.conceptId && !weakConceptIds.includes(g.conceptId)) {
      weakConceptIds.push(g.conceptId);
    }
  });

  const highRiskConceptIds = rootGaps.filter((g) => g.severity === 'critical').map((g) => g.rootGapConceptId);
  const examPriorityConceptIds = ['math_linear_eq', 'math_quadratic_eq', 'chem_reactions'];
  const goalConceptIds = ['cs_variables', 'math_algebra_fund'];

  const context = {
    prerequisiteGapConceptIds: prereqGapConceptIds,
    weakConceptIds,
    highRiskConceptIds,
    examPriorityConceptIds,
    goalConceptIds,
  };

  const ranked = catalog.map((res) => rankResourceItem(res, context));
  const dedupped = deduplicateRecommendations(ranked);

  dedupped.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return dedupped;
}

export async function getResourceHubSummaryEngine(
  studentId: string
): Promise<IResourceHubSummaryData> {
  const recommendations = await getStudentResourceRecommendationsEngine(studentId);
  const topRec = recommendations[0] || null;

  const prereqCount = recommendations.filter((r) => r.priority === 'CRITICAL').length;
  const weakCount = recommendations.filter((r) => r.priority === 'HIGH').length;
  const examCount = recommendations.filter((r) => r.reason.toLowerCase().includes('exam')).length;
  const quickCount = recommendations.filter((r) => r.estimatedMinutes <= 15).length;

  return {
    studentId: String(studentId),
    totalRecommended: recommendations.length,
    topRecommendation: topRec,
    prerequisiteGapRecommendationsCount: prereqCount,
    weakTopicRecommendationsCount: weakCount,
    examUrgencyRecommendationsCount: examCount,
    quickUnder15MinCount: quickCount,
    evaluatedAt: new Date().toISOString(),
  };
}
