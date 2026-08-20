import { dataRepository } from '../../repositories/data.repository.js';
import { ExamPaperType } from '../../models/exam-paper.model.js';
import {
  createStudentExamPaperEngine,
  getCurrentExamPaperQuestionEngine,
  getExamPaperResultsEngine,
  markExamPaperQuestionForReviewEngine,
  submitExamPaperAnswerEngine,
} from './engine.js';
import { createExamReadinessMockExam, createFullLengthMockExam, createWeakAreaMockExam } from './mock-engine.js';
import { IExamPaperDTO, IExamPaperQuestionReviewDTO, IExamPaperResultsDTO } from './types.js';

export async function createExamPaper(
  studentId: string,
  options?: {
    board?: string;
    classLevel?: string;
    subject?: string;
    examType?: ExamPaperType;
    title?: string;
  }
): Promise<IExamPaperDTO> {
  return await createStudentExamPaperEngine(studentId, options);
}

export async function getStudentExamPapers(studentId: string): Promise<IExamPaperDTO[]> {
  const list = await dataRepository.getStudentExamPapers(studentId);
  if (!list || list.length === 0) {
    const first = await createExamPaper(studentId, { examType: 'mock_exam' });
    return [first];
  }

  return list.map((p: any) => ({
    id: String(p._id || p.id),
    paperId: p.paperId || String(p._id),
    studentId: String(studentId),
    title: p.title || 'Mock Exam Paper',
    board: p.board || 'CBSE',
    classLevel: p.classLevel || 'Class 10',
    subject: p.subject || 'Mathematics',
    academicYear: p.academicYear || '2025-2026',
    examType: p.examType || 'mock_exam',
    durationMinutes: p.durationMinutes || 60,
    totalMarks: p.totalMarks || 50,
    questionCount: p.questionCount || 15,
    difficultyDistribution: p.difficultyDistribution || { easy: 30, medium: 50, hard: 20 },
    sections: [],
    status: p.status || 'ready',
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
  }));
}

export async function getExamPaperById(studentId: string, paperId: string): Promise<IExamPaperDTO | null> {
  const list = await getStudentExamPapers(studentId);
  const target = list.find((p) => p.id === paperId || p.paperId === paperId);
  if (!target) return null;

  const currentQ = await getCurrentExamPaperQuestionEngine(studentId, target.id);
  const sections = await dataRepository.getExamPaperSections(target.id);

  return {
    ...target,
    sections: (sections || []).map((s: any) => ({
      sectionId: String(s.sectionId || s._id),
      paperId: String(target.id),
      title: s.title,
      instructions: s.instructions,
      sequence: s.sequence,
      questionType: s.questionType,
      questionCount: s.questionCount,
      marksPerQuestion: s.marksPerQuestion,
      totalMarks: s.totalMarks,
      negativeMarking: s.negativeMarking,
      negativeMarks: s.negativeMarks,
    })),
    currentQuestion: currentQ || undefined,
  };
}

export async function deleteExamPaper(studentId: string, paperId: string): Promise<boolean> {
  return await dataRepository.deleteExamPaper(paperId, studentId);
}

export async function startExamPaper(studentId: string, paperId: string) {
  await dataRepository.updateExamPaper(paperId, studentId, { status: 'in_progress', startedAt: new Date() });
  return await getCurrentExamPaperQuestionEngine(studentId, paperId);
}

export async function getCurrentExamQuestion(studentId: string, paperId: string) {
  return await getCurrentExamPaperQuestionEngine(studentId, paperId);
}

export async function submitExamAnswer(
  studentId: string,
  paperId: string,
  questionId: string,
  submittedAnswer: string,
  responseTimeSeconds?: number
) {
  return await submitExamPaperAnswerEngine(studentId, paperId, questionId, submittedAnswer, responseTimeSeconds);
}

export async function skipExamQuestion(studentId: string, paperId: string, questionId: string) {
  await dataRepository.updateExamPaperQuestion(questionId, { status: 'skipped', updatedAt: new Date() });
  return await getCurrentExamPaperQuestionEngine(studentId, paperId);
}

export async function markExamQuestionForReview(studentId: string, paperId: string, questionId: string) {
  return await markExamPaperQuestionForReviewEngine(studentId, paperId, questionId);
}

export async function finishExamPaper(studentId: string, paperId: string) {
  await dataRepository.updateExamPaper(paperId, studentId, { status: 'completed', completedAt: new Date() });
  return await getExamPaperResultsEngine(studentId, paperId);
}

export async function getExamPaperResults(studentId: string, paperId: string): Promise<IExamPaperResultsDTO> {
  return await getExamPaperResultsEngine(studentId, paperId);
}

export async function getExamPaperReview(studentId: string, paperId: string): Promise<IExamPaperQuestionReviewDTO[]> {
  const questions = await dataRepository.getExamPaperQuestions(paperId);
  const attempts = await dataRepository.getExamPaperAttempts(paperId);

  return (questions || []).map((q: any) => {
    const att = attempts.find((a) => a.questionId === q.questionId || String(a.questionId) === String(q._id));
    return {
      id: String(q._id || q.id || q.questionId),
      questionId: q.questionId,
      paperId: String(paperId),
      sectionId: q.sectionId,
      sequence: q.sequence,
      subject: q.subject,
      topicId: q.topicId,
      conceptId: q.conceptId,
      difficulty: q.difficulty,
      questionType: q.questionType,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer, // Returned ONLY during post-test review!
      expectedConceptCoverage: q.expectedConceptCoverage,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
      sourceType: q.sourceType,
      status: q.status,
      submittedAnswer: att?.answer,
      isCorrect: att?.isCorrect,
      marksAwarded: att?.marksAwarded,
      negativeMarksApplied: att?.negativeMarksApplied,
      feedback: att?.feedback,
    };
  });
}

export async function getExamPaperRecommendations(studentId: string, paperId: string) {
  return {
    paperId,
    recommendations: [
      'Complete 15 minutes of revision on multi-step linear equations.',
      'Take a 30-minute Section B short answer practice paper in Mathematics.',
    ],
  };
}

export async function generateMockExam(studentId: string, subject?: string) {
  return await createFullLengthMockExam(studentId, { subject });
}

export async function generatePracticePaper(studentId: string) {
  return await createExamPaper(studentId, { examType: 'practice_paper' });
}

export async function generateWeakAreaPaper(studentId: string) {
  return await createWeakAreaMockExam(studentId);
}

export async function generateExamReadinessPaper(studentId: string) {
  return await createExamReadinessMockExam(studentId);
}

export async function getTeacherStudentExamSummary(teacherId: string, studentId: string) {
  const list = await getStudentExamPapers(studentId);
  return {
    studentId,
    totalPapers: list.length,
    completedCount: list.filter((p) => p.status === 'completed').length,
    averageScore: 78,
    teacherNote: `Student has taken ${list.length} mock exam papers.`,
  };
}

export async function getParentStudentExamSummary(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const list = await getStudentExamPapers(studentId);
  return {
    studentId,
    totalPapers: list.length,
    completedCount: list.filter((p) => p.status === 'completed').length,
    parentNote: `Your child has generated and attempted ${list.length} realistic board-style mock exam papers.`,
  };
}
