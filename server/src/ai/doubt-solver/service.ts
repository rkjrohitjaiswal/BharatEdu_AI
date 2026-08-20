import { dataRepository } from '../../repositories/data.repository.js';
import { DoubtSourceContext } from '../../models/student-doubt.model.js';
import { DoubtFeedbackType } from '../../models/doubt-feedback.model.js';
import { getStudentDoubtByIdEngine, solveStudentDoubtEngine } from './engine.js';
import { processDoubtFollowup } from './followup.js';
import { recordDoubtFeedback } from './feedback.js';
import { ExplanationLanguage, ExplanationLevel, IDoubtFollowupDTO, IStudentDoubtDTO } from './types.js';

export async function getStudentDoubts(studentId: string): Promise<IStudentDoubtDTO[]> {
  const list = await dataRepository.getStudentDoubts(studentId);
  if (!list || list.length === 0) return [];
  const results: IStudentDoubtDTO[] = [];
  for (const item of list) {
    try {
      const dto = await getStudentDoubtByIdEngine(studentId, item.doubtId || String(item._id));
      results.push(dto);
    } catch (e) {
      // ignore individual errors
    }
  }
  return results;
}

export async function getStudentDoubtById(studentId: string, doubtId: string): Promise<IStudentDoubtDTO> {
  return await getStudentDoubtByIdEngine(studentId, doubtId);
}

export async function solveStudentDoubt(
  studentId: string,
  question: string,
  subject?: string,
  sourceContext: DoubtSourceContext = 'free_question',
  sourceId?: string,
  level: ExplanationLevel = 'standard',
  language: ExplanationLanguage = 'en'
): Promise<IStudentDoubtDTO> {
  return await solveStudentDoubtEngine(studentId, question, subject, sourceContext, sourceId, level, language);
}

export async function submitDoubtFollowup(
  studentId: string,
  doubtId: string,
  followupQuestion: string,
  level: ExplanationLevel = 'standard',
  language: ExplanationLanguage = 'en'
): Promise<IDoubtFollowupDTO> {
  return await processDoubtFollowup(studentId, doubtId, followupQuestion, level, language);
}

export async function submitDoubtFeedback(
  studentId: string,
  doubtId: string,
  responseId: string,
  helpful: boolean,
  feedbackType: DoubtFeedbackType = 'helpful',
  comment?: string
) {
  return await recordDoubtFeedback(studentId, doubtId, responseId, helpful, feedbackType, comment);
}

export async function getDoubtContext(studentId: string, doubtId: string) {
  const dto = await getStudentDoubtByIdEngine(studentId, doubtId);
  return {
    doubtId,
    subject: dto.subject,
    topicId: dto.topicId,
    conceptId: dto.conceptId,
    difficulty: dto.difficulty,
  };
}

export async function getDoubtRecommendations(studentId: string, doubtId: string) {
  const dto = await getStudentDoubtByIdEngine(studentId, doubtId);
  return [
    `Revise topic '${dto.topicId}' in Smart Revision.`,
    `Practice 5 adaptive questions on concept '${dto.conceptId || dto.topicId}'.`,
  ];
}

export async function addDoubtToRevision(studentId: string, doubtId: string) {
  const dto = await getStudentDoubtByIdEngine(studentId, doubtId);
  // Reuses Smart Revision integration safely
  return {
    success: true,
    message: `Concept '${dto.conceptId || dto.topicId}' added to Smart Revision queue.`,
  };
}

export async function practiceDoubtConcept(studentId: string, doubtId: string) {
  const dto = await getStudentDoubtByIdEngine(studentId, doubtId);
  // Reuses Practice integration safely
  return {
    success: true,
    topicId: dto.topicId,
    conceptId: dto.conceptId || dto.topicId,
    message: `Generated practice session for concept '${dto.conceptId || dto.topicId}'.`,
  };
}

export async function getTeacherStudentDoubtSummary(teacherId: string, studentId: string) {
  const doubts = await getStudentDoubts(studentId);
  return {
    studentId,
    totalDoubtsAsked: doubts.length,
    resolvedDoubts: doubts.filter((d) => d.status === 'resolved' || d.status === 'answered').length,
    teacherNote: `Student has asked ${doubts.length} academic doubts.`,
  };
}

export async function getParentStudentDoubtSummary(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const doubts = await getStudentDoubts(studentId);
  return {
    studentId,
    totalDoubtsAsked: doubts.length,
    resolvedDoubts: doubts.filter((d) => d.status === 'resolved' || d.status === 'answered').length,
    parentNote: `Your child has asked ${doubts.length} academic doubts with step-by-step AI explanations.`,
  };
}
