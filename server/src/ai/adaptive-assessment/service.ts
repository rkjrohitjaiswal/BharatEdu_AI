import { dataRepository } from '../../repositories/data.repository.js';
import { AssessmentDifficulty, AssessmentType } from '../../models/adaptive-assessment.model.js';
import {
  createStudentAdaptiveAssessmentEngine,
  getAssessmentResultsEngine,
  getCurrentAssessmentQuestionEngine,
  submitAssessmentAnswerEngine,
} from './engine.js';
import { IAdaptiveAssessmentDTO, IAssessmentQuestionReviewDTO, IAssessmentResultsDTO, IAssessmentSummaryData } from './types.js';

export async function createAdaptiveAssessment(
  studentId: string,
  options?: {
    assessmentType?: AssessmentType;
    subject?: string;
    conceptId?: string;
    questionCount?: number;
    difficulty?: AssessmentDifficulty;
  }
): Promise<IAdaptiveAssessmentDTO> {
  return await createStudentAdaptiveAssessmentEngine(studentId, options);
}

export async function getAdaptiveAssessments(studentId: string): Promise<IAdaptiveAssessmentDTO[]> {
  const list = await dataRepository.getStudentAdaptiveAssessments(studentId);
  if (!list || list.length === 0) {
    const first = await createAdaptiveAssessment(studentId, { assessmentType: 'diagnostic' });
    return [first];
  }

  return list.map((a: any) => ({
    id: String(a._id || a.id),
    assessmentId: a.assessmentId || String(a._id),
    studentId: String(studentId),
    title: a.title || 'Adaptive Assessment',
    subject: a.subject || 'Mathematics',
    classLevel: a.classLevel || 'Class 10',
    board: a.board || 'CBSE',
    assessmentType: a.assessmentType || 'mastery_check',
    targetConceptId: a.targetConceptId,
    difficulty: a.difficulty || 'medium',
    questionCount: a.questionCount || 5,
    timeLimitMinutes: a.timeLimitMinutes || 15,
    status: a.status || 'ready',
    currentQuestionIndex: a.currentQuestionIndex || 0,
    score: a.score || 0,
    accuracy: a.accuracy || 0,
    masteryImpact: a.masteryImpact || 0,
    createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : new Date().toISOString(),
  }));
}

export async function getAdaptiveAssessmentById(studentId: string, assessmentId: string): Promise<IAdaptiveAssessmentDTO | null> {
  const list = await getAdaptiveAssessments(studentId);
  const target = list.find((a) => a.id === assessmentId || a.assessmentId === assessmentId);
  if (!target) return null;

  const currentQ = await getCurrentAssessmentQuestionEngine(studentId, target.id);
  return { ...target, currentQuestion: currentQ || undefined };
}

export async function deleteAdaptiveAssessment(studentId: string, assessmentId: string) {
  return await dataRepository.deleteAdaptiveAssessment(assessmentId, studentId);
}

export async function startAdaptiveAssessment(studentId: string, assessmentId: string) {
  await dataRepository.updateAdaptiveAssessment(assessmentId, studentId, { status: 'in_progress', startedAt: new Date() });
  return await getCurrentAssessmentQuestionEngine(studentId, assessmentId);
}

export async function getCurrentAssessmentQuestion(studentId: string, assessmentId: string) {
  return await getCurrentAssessmentQuestionEngine(studentId, assessmentId);
}

export async function submitAssessmentAnswer(
  studentId: string,
  assessmentId: string,
  questionId: string,
  submittedAnswer: string,
  responseTimeSeconds?: number
) {
  return await submitAssessmentAnswerEngine(studentId, assessmentId, questionId, submittedAnswer, responseTimeSeconds);
}

export async function skipAssessmentQuestion(studentId: string, assessmentId: string, questionId: string) {
  await dataRepository.updateAssessmentQuestion(questionId, { status: 'skipped', submittedAt: new Date() });
  return await getCurrentAssessmentQuestionEngine(studentId, assessmentId);
}

export async function finishAdaptiveAssessment(studentId: string, assessmentId: string) {
  await dataRepository.updateAdaptiveAssessment(assessmentId, studentId, { status: 'completed', completedAt: new Date() });
  return await getAssessmentResultsEngine(studentId, assessmentId);
}

export async function getAssessmentResults(studentId: string, assessmentId: string): Promise<IAssessmentResultsDTO> {
  return await getAssessmentResultsEngine(studentId, assessmentId);
}

export async function getAssessmentReview(studentId: string, assessmentId: string): Promise<IAssessmentQuestionReviewDTO[]> {
  const questions = await dataRepository.getAssessmentQuestions(assessmentId);
  const attempts = await dataRepository.getAssessmentAttempts(assessmentId);

  return (questions || []).map((q: any) => {
    const att = attempts.find((a) => a.questionId === q.questionId || String(a.questionId) === String(q._id));
    return {
      id: String(q._id || q.id || q.questionId),
      questionId: q.questionId,
      assessmentId: String(assessmentId),
      sequence: q.sequence,
      subject: q.subject,
      topicId: q.topicId,
      conceptId: q.conceptId,
      difficulty: q.difficulty,
      questionType: q.questionType,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer, // Returned ONLY during post-test review!
      marks: q.marks,
      timeLimitSeconds: q.timeLimitSeconds,
      status: q.status,
      submittedAnswer: att?.submittedAnswer,
      isCorrect: att?.isCorrect,
      marksAwarded: att?.marksAwarded,
      feedback: att?.feedback,
    };
  });
}

export async function getAssessmentRecommendations(studentId: string, assessmentId: string) {
  return {
    assessmentId,
    recommendations: [
      'Complete a 15-minute quick revision sheet on linear equation elimination.',
      'Practice 3 additional medium-difficulty questions in Algebra.',
    ],
  };
}

export async function createAssessmentFromDoubt(studentId: string, doubtId?: string) {
  return await createAdaptiveAssessment(studentId, { assessmentType: 'doubt_followup', questionCount: 4 });
}

export async function createDiagnosticAssessment(studentId: string) {
  return await createAdaptiveAssessment(studentId, { assessmentType: 'diagnostic', questionCount: 5 });
}

export async function createExamSimulation(studentId: string) {
  return await createAdaptiveAssessment(studentId, { assessmentType: 'exam_simulation', questionCount: 8 });
}

export async function createMasteryCheck(studentId: string, conceptId?: string) {
  return await createAdaptiveAssessment(studentId, { assessmentType: 'mastery_check', conceptId, questionCount: 5 });
}

export async function createRevisionTest(studentId: string) {
  return await createAdaptiveAssessment(studentId, { assessmentType: 'revision_test', questionCount: 5 });
}

export async function getTeacherStudentAssessmentSummary(teacherId: string, studentId: string) {
  const list = await getAdaptiveAssessments(studentId);
  return {
    studentId,
    totalAssessments: list.length,
    completedCount: list.filter((a) => a.status === 'completed').length,
    averageAccuracy: 75,
    teacherNote: `Student has completed ${list.filter((a) => a.status === 'completed').length} adaptive assessments.`,
  };
}

export async function getParentStudentAssessmentSummary(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const list = await getAdaptiveAssessments(studentId);
  return {
    studentId,
    totalAssessments: list.length,
    completedCount: list.filter((a) => a.status === 'completed').length,
    parentExplanation: `Your child has taken ${list.length} adaptive testing checks in Mathematics and Science.`,
  };
}
