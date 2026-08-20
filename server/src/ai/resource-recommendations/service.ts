import { generateAIResourceAdvice } from './ai-coach.js';
import {
  generateStudentRecommendations,
  getAllResourcesFromCatalog,
  updateStudentRecommendationStatus,
} from './engine.js';
import {
  IRecommendationData,
  IRecommendationSummaryData,
  IResourceAdviceData,
  IResourceData,
  RecommendationStatusType,
} from './types.js';

export async function getAllCatalogResources(): Promise<IResourceData[]> {
  return await getAllResourcesFromCatalog();
}

export async function getRecommendedResources(
  studentId: string
): Promise<IRecommendationData[]> {
  return await generateStudentRecommendations(studentId, false);
}

export async function getResourceById(id: string): Promise<IResourceData | null> {
  const catalog = await getAllResourcesFromCatalog();
  return catalog.find((r) => r.id === id) || null;
}

export async function generateRecommendations(
  studentId: string
): Promise<IRecommendationData[]> {
  return await generateStudentRecommendations(studentId, true);
}

export async function refreshRecommendations(
  studentId: string
): Promise<IRecommendationData[]> {
  return await generateStudentRecommendations(studentId, true);
}

export async function changeRecommendationStatus(
  studentId: string,
  recommendationId: string,
  status: RecommendationStatusType
): Promise<IRecommendationData> {
  return await updateStudentRecommendationStatus(studentId, recommendationId, status);
}

export async function getRecommendationSummary(
  studentId: string
): Promise<IRecommendationSummaryData> {
  const recommendations = await getRecommendedResources(studentId);
  const topPriorityResource = recommendations[0] || null;
  const highPriorityCount = recommendations.filter(
    (r) => r.priority === 'CRITICAL' || r.priority === 'HIGH'
  ).length;

  const advice = await generateAIResourceAdvice(
    'Student',
    recommendations.length,
    topPriorityResource?.topic || 'Core Subject',
    highPriorityCount,
    'low'
  );

  return {
    studentName: 'Student',
    totalRecommended: recommendations.length,
    topPriorityResource,
    highPriorityCount,
    activeGapsAddressed: highPriorityCount,
    examUrgencyActive: Boolean(topPriorityResource?.reason.includes('Exam')),
    riskLevel: 'low',
    summaryMessage: advice.recommendationReasoning,
    evaluatedAt: new Date().toISOString(),
  };
}

export async function getRecommendationAdvice(
  studentId: string
): Promise<IResourceAdviceData> {
  const recommendations = await getRecommendedResources(studentId);
  const topPriorityResource = recommendations[0] || null;

  return await generateAIResourceAdvice(
    'Student',
    recommendations.length,
    topPriorityResource?.topic || 'Core Subject',
    recommendations.length,
    'low'
  );
}
