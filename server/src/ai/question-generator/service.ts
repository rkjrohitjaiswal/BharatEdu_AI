import { dataRepository } from '../../repositories/data.repository.js';
import { AssessmentType } from '../../models/adaptive-assessment.model.js';
import {
  createAdaptiveAssessmentEngine,
  fetchNextAssessmentQuestion,
  getAssessmentSummaryEngine,
  submitAssessmentAnswerEngine,
} from './engine.js';
import { IAssessmentSummaryData } from './types.js';

export async function createStudentAssessment(
  studentId: string,
  targetConceptId?: string,
  assessmentType: AssessmentType = 'adaptive_practice',
  questionCount: number = 5
) {
  return await createAdaptiveAssessmentEngine(studentId, targetConceptId, assessmentType, questionCount);
}

export async function getNextQuestion(assessmentId: string, studentId: string) {
  return await fetchNextAssessmentQuestion(assessmentId, studentId);
}

export async function submitAnswer(
  assessmentId: string,
  questionId: string,
  selectedAnswer: string,
  studentId: string,
  responseTimeSeconds?: number,
  hintsUsed?: number
) {
  return await submitAssessmentAnswerEngine(
    assessmentId,
    questionId,
    selectedAnswer,
    studentId,
    responseTimeSeconds,
    hintsUsed
  );
}

export async function getAssessmentSummary(
  assessmentId: string,
  studentId: string
): Promise<IAssessmentSummaryData> {
  return await getAssessmentSummaryEngine(assessmentId, studentId);
}

export async function getStudentAssessments(studentId: string) {
  return await dataRepository.getStudentAdaptiveAssessments(studentId);
}

export async function getTeacherStudentAssessmentSummary(teacherId: string, studentId: string) {
  const assessments = await dataRepository.getStudentAdaptiveAssessments(studentId);
  const totalCompleted = (assessments || []).filter((a: any) => a.status === 'completed').length;
  const avgAccuracy =
    assessments && assessments.length > 0
      ? Math.round(assessments.reduce((acc: number, a: any) => acc + (a.accuracy || 0), 0) / assessments.length)
      : 75;

  return {
    studentId,
    totalAssessments: assessments?.length || 0,
    completedAssessments: totalCompleted,
    overallAccuracy: avgAccuracy,
    assessments: (assessments || []).slice(0, 5),
    teacherRecommendation:
      avgAccuracy < 60
        ? 'Student requires guided remediation on foundational prerequisites.'
        : 'Student shows strong accuracy across adaptive assessments.',
  };
}

export async function getParentStudentAssessmentSummary(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const assessments = await dataRepository.getStudentAdaptiveAssessments(studentId);
  const totalCompleted = (assessments || []).filter((a: any) => a.status === 'completed').length;
  const avgAccuracy =
    assessments && assessments.length > 0
      ? Math.round(assessments.reduce((acc: number, a: any) => acc + (a.accuracy || 0), 0) / assessments.length)
      : 75;

  return {
    studentId,
    totalAssessments: assessments?.length || 0,
    completedAssessments: totalCompleted,
    overallAccuracy: avgAccuracy,
    parentSummary: `Your child has completed ${totalCompleted} adaptive assessments with an average accuracy of ${avgAccuracy}%.`,
  };
}
