import { dataRepository } from '../../repositories/data.repository.js';
import { generateAIParentCopilotAdvice } from './ai-coach.js';
import { buildParentCopilotStudentSnapshot } from './engine.js';
import { evaluateDeterministicParentRecommendations } from './rules.js';
import { IParentWeeklyPlanDay, ParentCopilotAdvice, ParentCopilotStudentSnapshot } from './types.js';

export async function getLinkedStudentsForParentUser(parentId: string): Promise<any[]> {
  const links = await dataRepository.getLinkedStudentsForParent(parentId);
  return (links || []).map((l: any) => l.student || l).filter(Boolean);
}

export async function getAuthoritativeStudentSnapshotForParent(
  parentId: string,
  studentId: string
): Promise<ParentCopilotStudentSnapshot> {
  const isLinked = await dataRepository.checkParentStudentLinkActive(parentId, studentId);
  if (!isLinked) {
    throw new Error('UNAUTHORIZED_PARENT_STUDENT_ACCESS');
  }
  return await buildParentCopilotStudentSnapshot(studentId);
}

export async function generateAdviceForParent(
  parentId: string,
  studentId: string
): Promise<ParentCopilotAdvice> {
  const snapshot = await getAuthoritativeStudentSnapshotForParent(parentId, studentId);
  return await generateAIParentCopilotAdvice(snapshot);
}

export async function getWeeklyPlanForParent(
  parentId: string,
  studentId: string
): Promise<{ studentId: string; studentName: string; weeklySupportPlan: IParentWeeklyPlanDay[] }> {
  const snapshot = await getAuthoritativeStudentSnapshotForParent(parentId, studentId);
  const deterministic = evaluateDeterministicParentRecommendations(snapshot);
  return {
    studentId,
    studentName: snapshot.studentName,
    weeklySupportPlan: deterministic.weeklySupportPlan,
  };
}
