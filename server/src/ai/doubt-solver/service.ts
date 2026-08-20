import { dataRepository } from '../../repositories/data.repository.js';
import { aggregateStudentDoubtContext } from './context.js';
import { getSocraticHintEngine, solveStudentDoubtEngine } from './engine.js';
import { classifyDoubtQuestion } from './rules.js';
import { IDoubtMessageDTO, IDoubtSessionDTO, IDoubtSummaryData } from './types.js';

export async function createDoubtSession(
  studentId: string,
  options?: { title?: string; subject?: string; topicId?: string; conceptId?: string }
): Promise<IDoubtSessionDTO> {
  const sessionId = `ds_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const title = options?.title || 'Academic Doubt Session';
  const subject = options?.subject || 'Mathematics';

  const session = await dataRepository.createDoubtSession({
    sessionId,
    studentId,
    title,
    subject,
    classLevel: 'Class 10',
    board: 'CBSE',
    topicId: options?.topicId || '',
    conceptId: options?.conceptId || '',
    status: 'active',
    difficulty: 'intermediate',
    language: 'English',
  });

  const sessId = String(session._id || session.id || sessionId);

  return {
    id: sessId,
    sessionId,
    studentId: String(studentId),
    subject,
    classLevel: 'Class 10',
    board: 'CBSE',
    topicId: options?.topicId,
    conceptId: options?.conceptId,
    title,
    status: 'active',
    difficulty: 'intermediate',
    language: 'English',
    messages: [],
    createdAt: session.createdAt ? new Date(session.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: session.updatedAt ? new Date(session.updatedAt).toISOString() : new Date().toISOString(),
    lastActivityAt: session.lastActivityAt ? new Date(session.lastActivityAt).toISOString() : new Date().toISOString(),
  };
}

export async function getDoubtSessions(studentId: string): Promise<IDoubtSessionDTO[]> {
  const sessions = await dataRepository.getStudentDoubtSessions(studentId);
  if (!sessions || sessions.length === 0) {
    const first = await createDoubtSession(studentId, { title: 'General Math & Science Doubts' });
    return [first];
  }

  return sessions.map((s: any) => ({
    id: String(s._id || s.id),
    sessionId: s.sessionId || String(s._id),
    studentId: String(studentId),
    subject: s.subject || 'Mathematics',
    classLevel: s.classLevel || 'Class 10',
    board: s.board || 'CBSE',
    topicId: s.topicId,
    conceptId: s.conceptId,
    title: s.title,
    status: s.status || 'active',
    difficulty: s.difficulty || 'intermediate',
    language: s.language || 'English',
    createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : new Date().toISOString(),
    lastActivityAt: s.lastActivityAt ? new Date(s.lastActivityAt).toISOString() : new Date().toISOString(),
  }));
}

export async function getDoubtSessionById(studentId: string, sessionId: string): Promise<IDoubtSessionDTO | null> {
  const sessions = await getDoubtSessions(studentId);
  const target = sessions.find((s) => s.id === sessionId || s.sessionId === sessionId);
  if (!target) return null;

  const messages = await dataRepository.getDoubtMessages(target.sessionId);
  return { ...target, messages };
}

export async function deleteDoubtSession(studentId: string, sessionId: string) {
  return await dataRepository.deleteDoubtSession(sessionId, studentId);
}

export async function getDoubtMessages(studentId: string, sessionId: string): Promise<IDoubtMessageDTO[]> {
  const msgs = await dataRepository.getDoubtMessages(sessionId);
  return (msgs || []).map((m: any) => ({
    id: String(m._id || m.id || m.messageId),
    messageId: m.messageId || String(m._id),
    sessionId: String(sessionId),
    studentId: String(studentId),
    role: m.role || 'student',
    content: m.content || '',
    explanationLevel: m.explanationLevel || 'standard',
    referencedConceptIds: m.referencedConceptIds || [],
    referencedTopicIds: m.referencedTopicIds || [],
    sourceReferences: m.sourceReferences || [],
    generatedBy: m.generatedBy || 'deterministic',
    isHelpful: m.isHelpful,
    createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
  }));
}

export async function sendDoubtMessage(studentId: string, sessionId: string, content: string): Promise<IDoubtMessageDTO> {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const { explanationLevel } = classifyDoubtQuestion(content);

  const msg = await dataRepository.createDoubtMessage({
    messageId,
    sessionId,
    studentId,
    role: 'student',
    content,
    explanationLevel,
    generatedBy: 'deterministic',
  });

  return {
    id: String(msg._id || msg.id || messageId),
    messageId,
    sessionId,
    studentId: String(studentId),
    role: 'student',
    content,
    explanationLevel,
    referencedConceptIds: [],
    referencedTopicIds: [],
    sourceReferences: [],
    generatedBy: 'deterministic',
    createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function solveDoubtSession(studentId: string, sessionId: string, questionText: string) {
  // First save student's message
  await sendDoubtMessage(studentId, sessionId, questionText);
  // Then generate and return AI step-by-step solution
  return await solveStudentDoubtEngine(studentId, sessionId, questionText);
}

export async function getSocraticHint(studentId: string, sessionId: string, hintLevel: number, questionText: string) {
  return await getSocraticHintEngine(sessionId, hintLevel, questionText);
}

export async function submitDoubtFeedback(studentId: string, messageId: string, isHelpful: boolean) {
  return await dataRepository.addDoubtFeedback(messageId, studentId, isHelpful);
}

export async function getStudentDoubtContext(studentId: string, sessionId: string) {
  return await aggregateStudentDoubtContext(studentId);
}

export async function getDoubtRecommendations(studentId: string) {
  const context = await aggregateStudentDoubtContext(studentId);
  return {
    studentId,
    recommendedQuestions: [
      `How do I solve equations with variables on both sides?`,
      `What is the difference between linear and quadratic equations?`,
      `Explain the graphical method for solving linear pairs.`,
    ],
    recommendedConcept: context.topConceptName || 'Linear Equations',
  };
}

export async function getTeacherStudentDoubtSummary(teacherId: string, studentId: string) {
  const sessions = await getDoubtSessions(studentId);
  return {
    studentId,
    totalDoubtsCount: sessions.length,
    activeDoubtsCount: sessions.filter((s) => s.status === 'active').length,
    frequentTopics: ['Algebra', 'Number Systems', 'Linear Equations'],
    teacherNote: `Student has engaged in ${sessions.length} active doubt resolution sessions.`,
  };
}

export async function getParentStudentDoubtSummary(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const sessions = await getDoubtSessions(studentId);
  return {
    studentId,
    totalDoubtsCount: sessions.length,
    activeDoubtsCount: sessions.filter((s) => s.status === 'active').length,
    parentExplanation: `Your child has resolved ${sessions.length} academic questions with the AI Tutor.`,
  };
}
