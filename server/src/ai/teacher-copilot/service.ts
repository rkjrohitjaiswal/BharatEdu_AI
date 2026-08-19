import { dataRepository } from '../../repositories/data.repository.js';
import { generateAICopilotAdvice, generateParentCommunicationDraft } from './ai-coach.js';
import { buildTeacherCopilotStudentSnapshot } from './engine.js';
import { ParentMessageDraft, TeacherCopilotAdvice, TeacherCopilotStudentSnapshot } from './types.js';

export async function getAuthorizedTeacherStudents(teacherId: string): Promise<any[]> {
  return await dataRepository.getTeacherStudents(teacherId);
}

export async function getAuthoritativeStudentSnapshotForTeacher(
  teacherId: string,
  studentId: string
): Promise<TeacherCopilotStudentSnapshot> {
  const isOwner = await dataRepository.validateTeacherStudentOwnership(teacherId, studentId);
  if (!isOwner) {
    throw new Error('UNAUTHORIZED_TEACHER_STUDENT_ACCESS');
  }
  return await buildTeacherCopilotStudentSnapshot(studentId);
}

export async function generateAdviceForTeacher(
  teacherId: string,
  studentId: string
): Promise<TeacherCopilotAdvice> {
  const snapshot = await getAuthoritativeStudentSnapshotForTeacher(teacherId, studentId);
  return await generateAICopilotAdvice(snapshot);
}

export async function generateParentMessageDraftForTeacher(
  teacherId: string,
  studentId: string
): Promise<ParentMessageDraft> {
  const snapshot = await getAuthoritativeStudentSnapshotForTeacher(teacherId, studentId);
  const draft = await generateParentCommunicationDraft(snapshot);
  return {
    studentId,
    studentName: snapshot.studentName,
    ...draft,
    generatedAt: new Date().toISOString(),
  };
}
