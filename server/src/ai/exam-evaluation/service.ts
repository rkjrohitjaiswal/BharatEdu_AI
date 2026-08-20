import { dataRepository } from '../../repositories/data.repository.js';
import { evaluateStudentExamPaperEngine, getExamEvaluationByIdEngine } from './engine.js';
import { generateEvaluationFeedback } from './feedback.js';
import { IExamEvaluationDTO } from './types.js';

export async function getStudentExamEvaluations(studentId: string): Promise<IExamEvaluationDTO[]> {
  const list = await dataRepository.getStudentExamEvaluations(studentId);
  if (!list || list.length === 0) return [];
  const results: IExamEvaluationDTO[] = [];
  for (const item of list) {
    try {
      const dto = await getExamEvaluationByIdEngine(studentId, item.evaluationId || String(item._id));
      results.push(dto);
    } catch (e) {
      // ignore individual errors
    }
  }
  return results;
}

export async function getExamEvaluationById(studentId: string, evaluationId: string): Promise<IExamEvaluationDTO> {
  return await getExamEvaluationByIdEngine(studentId, evaluationId);
}

export async function evaluateExamPaper(studentId: string, paperId: string): Promise<IExamEvaluationDTO> {
  return await evaluateStudentExamPaperEngine(studentId, paperId);
}

export async function getEvaluationResults(studentId: string, evaluationId: string) {
  const dto = await getExamEvaluationByIdEngine(studentId, evaluationId);
  return {
    evaluationId,
    earnedMarks: dto.earnedMarks,
    totalMarks: dto.totalMarks,
    percentage: dto.percentage,
    accuracy: dto.accuracy,
    overallLevel: dto.overallLevel,
    aiInsight: dto.aiInsight,
  };
}

export async function getEvaluationQuestions(studentId: string, evaluationId: string) {
  const dto = await getExamEvaluationByIdEngine(studentId, evaluationId);
  return dto.questionEvaluations;
}

export async function getEvaluationTopics(studentId: string, evaluationId: string) {
  const dto = await getExamEvaluationByIdEngine(studentId, evaluationId);
  return dto.topicEvaluations;
}

export async function getEvaluationConcepts(studentId: string, evaluationId: string) {
  const dto = await getExamEvaluationByIdEngine(studentId, evaluationId);
  return dto.conceptEvaluations;
}

export async function getEvaluationMisconceptions(studentId: string, evaluationId: string) {
  const dto = await getExamEvaluationByIdEngine(studentId, evaluationId);
  return dto.misconceptions;
}

export async function getEvaluationRecommendations(studentId: string, evaluationId: string) {
  const dto = await getExamEvaluationByIdEngine(studentId, evaluationId);
  return dto.recommendations;
}

export async function getEvaluationFeedback(studentId: string, evaluationId: string) {
  const dto = await getExamEvaluationByIdEngine(studentId, evaluationId);
  return generateEvaluationFeedback(dto.earnedMarks, dto.totalMarks, dto.accuracy, dto.overallLevel);
}

export async function recalculateEvaluation(studentId: string, evaluationId: string): Promise<IExamEvaluationDTO> {
  const dto = await getExamEvaluationByIdEngine(studentId, evaluationId);
  return await evaluateStudentExamPaperEngine(studentId, dto.paperId);
}

export async function getTeacherStudentEvaluationSummary(teacherId: string, studentId: string) {
  const evals = await getStudentExamEvaluations(studentId);
  return {
    studentId,
    totalEvaluations: evals.length,
    averagePercentage: evals.length > 0 ? Math.round(evals.reduce((a, b) => a + b.percentage, 0) / evals.length) : 0,
    teacherNote: `Student has ${evals.length} completed exam evaluations.`,
  };
}

export async function getTeacherStudentMisconceptions(teacherId: string, studentId: string) {
  return await dataRepository.getStudentMisconceptions(studentId);
}

export async function getTeacherStudentRecommendations(teacherId: string, studentId: string) {
  const evals = await getStudentExamEvaluations(studentId);
  if (evals.length > 0) return evals[0].recommendations;
  return ['Complete a full-length mock paper to identify learning recommendations.'];
}

export async function getParentStudentEvaluationSummary(parentId: string, studentId: string) {
  const isLinked = await dataRepository.isParentLinkedToStudent(parentId, studentId);
  if (!isLinked) {
    throw new Error('Access denied: Parent is not linked to this student');
  }

  const evals = await getStudentExamEvaluations(studentId);
  return {
    studentId,
    totalEvaluations: evals.length,
    averagePercentage: evals.length > 0 ? Math.round(evals.reduce((a, b) => a + b.percentage, 0) / evals.length) : 0,
    parentNote: `Your child has completed ${evals.length} exam evaluations with detailed performance analysis.`,
  };
}
