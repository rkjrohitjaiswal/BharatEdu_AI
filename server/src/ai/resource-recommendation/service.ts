import { dataRepository } from '../../repositories/data.repository.js';
import { generateAIResourceExplanation } from './ai-coach.js';
import {
  getResourceRecommendationSummaryEngine,
  getStudentResourceRecommendationsEngine,
  seedOrRefreshStudentResourceRecommendationsEngine,
} from './engine.js';
import { IResourceRecommendationDTO } from './types.js';

export async function getRecommendedResources(studentId: string): Promise<IResourceRecommendationDTO[]> {
  return await getStudentResourceRecommendationsEngine(studentId);
}

export async function getTodayResources(studentId: string): Promise<IResourceRecommendationDTO[]> {
  const recs = await getStudentResourceRecommendationsEngine(studentId);
  return recs.filter((r) => r.status === 'recommended' || r.status === 'started').slice(0, 5);
}

export async function getNextResource(studentId: string): Promise<IResourceRecommendationDTO | null> {
  const recs = await getTodayResources(studentId);
  return recs[0] || null;
}

export async function refreshResourceRecommendations(studentId: string): Promise<IResourceRecommendationDTO[]> {
  return await seedOrRefreshStudentResourceRecommendationsEngine(studentId);
}

export async function startResourceRecommendation(studentId: string, recId: string) {
  const updated = await dataRepository.startRecommendation(recId, studentId);
  return updated || { id: recId, status: 'started' };
}

export async function completeResourceRecommendation(studentId: string, recId: string) {
  const updated = await dataRepository.completeRecommendation(recId, studentId);

  // Trigger Notification via Feature 11
  await dataRepository.createNotification({
    recipientUserId: studentId,
    recipientRole: 'student',
    type: 'RESOURCE_RECOMMENDATION',
    title: 'Educational Resource Completed',
    message: 'Great job completing your recommended learning material!',
    priority: 'normal',
    sourceType: 'RESOURCE_HUB',
  });

  return updated || { id: recId, status: 'completed' };
}

export async function dismissResourceRecommendation(studentId: string, recId: string) {
  const updated = await dataRepository.dismissRecommendation(recId, studentId);
  return updated || { id: recId, status: 'dismissed' };
}

export async function getResourceHistory(studentId: string) {
  const recs = await getStudentResourceRecommendationsEngine(studentId);
  return recs.filter((r) => r.status === 'completed' || r.status === 'dismissed');
}

export async function getResourceSummary(studentId: string) {
  return await getResourceRecommendationSummaryEngine(studentId);
}

export async function getResourceExplanation(studentId: string, recId: string) {
  const recs = await getStudentResourceRecommendationsEngine(studentId);
  const target = recs.find((r) => r.id === recId) || recs[0];
  const user = await dataRepository.getUserById(studentId);

  if (!target) {
    return { explanation: 'Recommended learning material aligned with your curriculum.' };
  }

  const aiText = await generateAIResourceExplanation(
    user?.name || 'Student',
    target.resource.title,
    target.resource.provider,
    target.reason
  );

  return {
    id: target.id,
    resourceTitle: target.resource.title,
    reason: target.reason,
    explanation: aiText,
    actionUrl: target.actionUrl,
  };
}

export async function getTeacherStudentResourceSummary(teacherId: string, studentId: string) {
  const summary = await getResourceSummary(studentId);
  return {
    studentId,
    summary,
    teacherNote: summary.topRecommendation
      ? `Student is assigned resource "${summary.topRecommendation.resource.title}".`
      : 'Student is engaging with verified learning resources.',
  };
}

export async function getParentStudentResourceSummary(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const summary = await getResourceSummary(studentId);
  return {
    studentId,
    summary,
    parentExplanation: summary.topRecommendation
      ? `Your child is focusing on "${summary.topRecommendation.resource.title}".`
      : 'Your child is following their recommended study materials.',
  };
}
