import { dataRepository } from '../../repositories/data.repository.js';
import { generateAIResourceExplanation } from './ai-coach.js';
import { getAllCatalogResources, getResourceHubSummaryEngine, getStudentResourceRecommendationsEngine } from './engine.js';
import { IResourceItem } from './types.js';

export async function getRecommendedResources(studentId: string) {
  const recommendations = await getStudentResourceRecommendationsEngine(studentId);
  const user = await dataRepository.getUserById(studentId);
  const topRec = recommendations[0];

  const aiExplanation = await generateAIResourceExplanation(
    user?.name || 'Student',
    topRec?.title,
    topRec?.reason
  );

  return {
    recommendations,
    aiExplanation,
    evaluatedAt: new Date().toISOString(),
  };
}

export async function searchResources(
  query?: string,
  subject?: string,
  topic?: string,
  resourceType?: string
): Promise<IResourceItem[]> {
  const catalog = await getAllCatalogResources();

  return catalog.filter((res) => {
    if (subject && subject !== 'all' && res.subject.toLowerCase() !== subject.toLowerCase()) return false;
    if (topic && topic !== 'all' && res.topic.toLowerCase() !== topic.toLowerCase()) return false;
    if (resourceType && resourceType !== 'all' && res.resourceType.toLowerCase() !== resourceType.toLowerCase()) return false;

    if (query) {
      const q = query.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchTag = res.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });
}

export async function getResourceDetails(resourceId: string): Promise<IResourceItem | null> {
  const catalog = await getAllCatalogResources();
  return catalog.find((r) => r.resourceId === resourceId) || null;
}

export async function startResource(studentId: string, resourceId: string) {
  return await dataRepository.upsertResourceProgress(studentId, resourceId, {
    status: 'started',
    progressPercent: 10,
    lastOpenedAt: new Date(),
  });
}

export async function updateResourceProgress(studentId: string, resourceId: string, progressPercent: number) {
  const normPercent = Math.min(100, Math.max(0, Math.round(progressPercent)));
  const status = normPercent >= 100 ? 'completed' : 'started';

  return await dataRepository.upsertResourceProgress(studentId, resourceId, {
    status,
    progressPercent: normPercent,
    lastOpenedAt: new Date(),
    completedAt: normPercent >= 100 ? new Date() : undefined,
  });
}

export async function completeResource(studentId: string, resourceId: string) {
  return await dataRepository.upsertResourceProgress(studentId, resourceId, {
    status: 'completed',
    progressPercent: 100,
    lastOpenedAt: new Date(),
    completedAt: new Date(),
  });
}

export async function getStudentResourceHistory(studentId: string) {
  const history = await dataRepository.getStudentResourceProgressList(studentId);
  const catalog = await getAllCatalogResources();

  const enrichedHistory = (history || []).map((h: any) => {
    const res = catalog.find((r) => r.resourceId === h.resourceId);
    return {
      ...h,
      resourceTitle: res?.title || 'Learning Resource',
      resourceType: res?.resourceType || 'article',
      subject: res?.subject || 'General',
    };
  });

  return enrichedHistory;
}

export async function getTeacherStudentResourceSummary(teacherId: string, studentId: string) {
  const summary = await getResourceHubSummaryEngine(studentId);
  const history = await getStudentResourceHistory(studentId);

  return {
    studentId,
    summary,
    recentHistory: history.slice(0, 5),
    teacherRecommendation: summary.topRecommendation
      ? `Assign resource "${summary.topRecommendation.title}" to target ${summary.topRecommendation.topic}.`
      : 'Student is actively engaged with recommended learning resources.',
  };
}

export async function getParentStudentResourceSummary(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const summary = await getResourceHubSummaryEngine(studentId);
  const history = await getStudentResourceHistory(studentId);
  const completedCount = history.filter((h: any) => h.status === 'completed').length;

  return {
    studentId,
    summary,
    completedResourcesCount: completedCount,
    parentExplanation: summary.topRecommendation
      ? `Your child is recommended to focus on "${summary.topRecommendation.title}" next.`
      : 'Your child is progressing well across recommended study resources.',
  };
}
