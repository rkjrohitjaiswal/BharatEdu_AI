import { dataRepository } from '../../repositories/data.repository.js';
import { generateAIKnowledgeGraphAdvice } from './ai-coach.js';
import { STARTER_CONCEPTS_CATALOG } from './catalog.js';
import {
  getStudentConceptReadinessList,
  getStudentConceptRecommendations,
  getStudentRootLearningGaps,
  getKnowledgeGraphSummaryEngine,
} from './engine.js';
import {
  getAncestors,
  getConceptById,
  getConceptPath,
  getDescendants,
  getDirectDependents,
  getDirectPrerequisites,
} from './rules.js';
import {
  IConceptNode,
  IKnowledgeGraphAIAdviceData,
  IKnowledgeGraphSummaryData,
  IRootLearningGapData,
  IStudentConceptReadinessData,
} from './types.js';

export async function getAllConcepts(): Promise<IConceptNode[]> {
  return STARTER_CONCEPTS_CATALOG;
}

export async function getConceptDetails(conceptId: string): Promise<IConceptNode | null> {
  return getConceptById(conceptId) || null;
}

export async function getPrerequisites(conceptId: string): Promise<IConceptNode[]> {
  return getDirectPrerequisites(conceptId);
}

export async function getDependents(conceptId: string): Promise<IConceptNode[]> {
  return getDirectDependents(conceptId);
}

export async function getConceptPathService(fromConceptId: string, toConceptId: string): Promise<string[]> {
  return getConceptPath(fromConceptId, toConceptId);
}

export async function getStudentReadiness(studentId: string): Promise<IStudentConceptReadinessData[]> {
  return await getStudentConceptReadinessList(studentId);
}

export async function getStudentRootGaps(studentId: string): Promise<IRootLearningGapData[]> {
  return await getStudentRootLearningGaps(studentId);
}

export async function getStudentRecommendations(studentId: string) {
  return await getStudentConceptRecommendations(studentId);
}

export async function getKnowledgeGraphSummary(studentId: string): Promise<IKnowledgeGraphSummaryData> {
  return await getKnowledgeGraphSummaryEngine(studentId);
}

export async function getTeacherStudentOverview(teacherId: string, studentId: string) {
  const summary = await getKnowledgeGraphSummaryEngine(studentId);
  const readiness = await getStudentConceptReadinessList(studentId);
  const rootGaps = await getStudentRootLearningGaps(studentId);
  const advice = await generateAIKnowledgeGraphAdvice(
    summary.studentName,
    summary.topRootGap?.rootGapConceptName,
    summary.topRootGap?.affectedConceptsCount || 0,
    summary.overallHealthScore
  );

  return {
    summary,
    readiness,
    rootGaps,
    teacherRecommendation: advice.teacherTip,
  };
}

export async function getParentStudentOverview(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const summary = await getKnowledgeGraphSummaryEngine(studentId);
  const rootGaps = await getStudentRootLearningGaps(studentId);
  const advice = await generateAIKnowledgeGraphAdvice(
    summary.studentName,
    summary.topRootGap?.rootGapConceptName,
    summary.topRootGap?.affectedConceptsCount || 0,
    summary.overallHealthScore
  );

  return {
    summary,
    rootGaps,
    parentExplanation: advice.parentTip || summary.summaryMessage,
  };
}

export async function getKnowledgeGraphAdvice(studentId: string): Promise<IKnowledgeGraphAIAdviceData> {
  const summary = await getKnowledgeGraphSummaryEngine(studentId);
  return await generateAIKnowledgeGraphAdvice(
    summary.studentName,
    summary.topRootGap?.rootGapConceptName,
    summary.topRootGap?.affectedConceptsCount || 0,
    summary.overallHealthScore
  );
}
