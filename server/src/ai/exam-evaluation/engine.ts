import { dataRepository } from '../../repositories/data.repository.js';
import { OverallPerformanceLevel } from '../../models/exam-evaluation.model.js';
import { generateAIEvaluationInsight } from './ai-coach.js';
import { analyzeConceptPerformance } from './concept-analysis.js';
import { evaluateDeterministicQuestion } from './deterministic.js';
import { generateEvaluationFeedback } from './feedback.js';
import { detectMisconceptionFromQuestionAttempt } from './misconceptions.js';
import { generateRemediationRecommendations } from './recommendations.js';
import { evaluateQuestionRubric } from './rubrics.js';
import { analyzeTopicPerformance } from './topic-analysis.js';
import { IExamEvaluationDTO, IQuestionEvaluationDTO } from './types.js';

export async function evaluateStudentExamPaperEngine(studentId: string, paperId: string): Promise<IExamEvaluationDTO> {
  // Idempotency Check: return existing evaluation if completed
  const existingList = await dataRepository.getStudentExamEvaluations(studentId);
  const existing = existingList.find((e: any) => String(e.paperId) === String(paperId));
  if (existing && existing.evaluationStatus === 'completed') {
    return await getExamEvaluationByIdEngine(studentId, existing.evaluationId || String(existing._id));
  }

  const paper = await dataRepository.getExamPaper(paperId, studentId);
  if (!paper) throw new Error('Exam paper not found or access denied');

  const questions = await dataRepository.getExamPaperQuestions(paperId);
  const attempts = await dataRepository.getExamPaperAttempts(paperId);

  const evaluationId = `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const qEvaluations: IQuestionEvaluationDTO[] = [];
  let totalEarnedMarks = 0;
  let totalNegativeMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  for (const q of questions) {
    const att = attempts.find((a) => String(a.questionId) === String(q.questionId) || String(a.questionId) === String(q._id));
    const subAns = att?.answer || '';
    const qType = q.questionType || 'mcq';

    let evalRes: any;
    let evalMethod: 'deterministic' | 'rubric' | 'semantic' | 'hybrid' = 'deterministic';

    if (qType === 'mcq' || qType === 'true_false' || qType === 'numerical' || qType === 'multiple_select') {
      evalRes = evaluateDeterministicQuestion(qType, subAns, q.correctAnswer, q.marks, q.negativeMarks);
      evalMethod = 'deterministic';
    } else {
      evalRes = evaluateQuestionRubric(qType, subAns, q.correctAnswer, q.rubric, q.marks);
      evalMethod = 'rubric';
    }

    if (!subAns) unansweredCount++;
    else if (evalRes.isCorrect) correctCount++;
    else incorrectCount++;

    totalEarnedMarks += evalRes.marksAwarded || 0;
    const negMarks = evalRes.negativeMarksApplied || 0;
    totalNegativeMarks += negMarks;

    const misc = detectMisconceptionFromQuestionAttempt(
      evalRes.isCorrect,
      subAns,
      q.correctAnswer,
      qType,
      att?.responseTimeSeconds || 30,
      q.topicId || 'Algebra',
      q.conceptId || 'math_linear_eq'
    );

    if (misc.misconceptionType) {
      await dataRepository.createStudentMisconception({
        studentId,
        topicId: q.topicId || 'Algebra',
        conceptId: q.conceptId || 'math_linear_eq',
        misconceptionType: misc.misconceptionType,
        description: misc.description || 'Misconception identified',
        severity: misc.severity || 'medium',
        status: 'active',
        sourceEvaluationId: evaluationId,
        recommendedAction: misc.action || 'Review topic concept.',
      });
    }

    const qEval: IQuestionEvaluationDTO = {
      questionId: q.questionId,
      paperId: String(paperId),
      questionType: qType,
      topicId: q.topicId || 'Algebra',
      conceptId: q.conceptId || 'math_linear_eq',
      difficulty: q.difficulty || 'medium',
      submittedAnswer: subAns,
      isCorrect: evalRes.isCorrect,
      marksAvailable: q.marks || 1,
      marksAwarded: evalRes.marksAwarded || 0,
      negativeMarks: negMarks,
      responseTimeSeconds: att?.responseTimeSeconds || 30,
      confidence: att?.confidence || 80,
      evaluationMethod: evalMethod,
      misconceptionType: misc.misconceptionType,
      feedback: evalRes.feedback,
    };

    qEvaluations.push(qEval);
    await dataRepository.createQuestionEvaluation({ ...qEval, evaluationId, studentId });
  }

  const netEarnedMarks = Math.max(0, totalEarnedMarks - totalNegativeMarks);
  const totalMarks = paper.totalMarks || 50;
  const percentage = Math.round((netEarnedMarks / (totalMarks || 1)) * 100);
  const accuracy = Math.round((correctCount / (questions.length || 1)) * 100);

  let overallLevel: OverallPerformanceLevel = 'developing';
  if (percentage >= 85) overallLevel = 'strong';
  else if (percentage >= 70) overallLevel = 'good';
  else if (percentage >= 50) overallLevel = 'developing';
  else if (percentage >= 35) overallLevel = 'needs_improvement';
  else overallLevel = 'critical';

  const tEvaluations = analyzeTopicPerformance(qEvaluations);
  for (const t of tEvaluations) {
    await dataRepository.createTopicEvaluation({ ...t, evaluationId, studentId, paperId });
  }

  const cEvaluations = analyzeConceptPerformance(qEvaluations);
  for (const c of cEvaluations) {
    await dataRepository.createConceptEvaluation({ ...c, evaluationId, studentId, paperId });
  }

  const aiInsight = await generateAIEvaluationInsight(netEarnedMarks, totalMarks, accuracy, overallLevel);
  const feedbackData = generateEvaluationFeedback(netEarnedMarks, totalMarks, accuracy, overallLevel);
  const recommendations = generateRemediationRecommendations(tEvaluations, cEvaluations);

  const evalRecord = await dataRepository.createExamEvaluation({
    evaluationId,
    paperId: String(paperId),
    studentId,
    totalMarks,
    earnedMarks: netEarnedMarks,
    percentage,
    accuracy,
    completionRate: 100,
    averageResponseTimeSeconds: 30,
    unansweredCount,
    correctCount,
    incorrectCount,
    skippedCount: unansweredCount,
    negativeMarks: totalNegativeMarks,
    evaluationStatus: 'completed',
    overallLevel,
    aiInsight,
    completedAt: new Date(),
  });

  const eDbId = String(evalRecord._id || evalRecord.id || evaluationId);
  const misconceptions = await dataRepository.getStudentMisconceptions(studentId);

  return {
    id: eDbId,
    evaluationId,
    paperId: String(paperId),
    studentId: String(studentId),
    totalMarks,
    earnedMarks: netEarnedMarks,
    percentage,
    accuracy,
    completionRate: 100,
    averageResponseTimeSeconds: 30,
    unansweredCount,
    correctCount,
    incorrectCount,
    skippedCount: unansweredCount,
    negativeMarks: totalNegativeMarks,
    evaluationStatus: 'completed',
    overallLevel,
    aiInsight,
    questionEvaluations: qEvaluations,
    topicEvaluations: tEvaluations,
    conceptEvaluations: cEvaluations,
    misconceptions: (misconceptions || []).map((m: any) => ({
      id: String(m._id || m.id),
      studentId: String(studentId),
      topicId: m.topicId,
      conceptId: m.conceptId,
      misconceptionType: m.misconceptionType,
      description: m.description,
      evidenceCount: m.evidenceCount || 1,
      severity: m.severity || 'medium',
      status: m.status || 'active',
      recommendedAction: m.recommendedAction || '',
      lastDetectedAt: m.lastDetectedAt ? new Date(m.lastDetectedAt).toISOString() : new Date().toISOString(),
    })),
    recommendations,
    generatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };
}

export async function getExamEvaluationByIdEngine(studentId: string, evaluationId: string): Promise<IExamEvaluationDTO> {
  const list = await dataRepository.getStudentExamEvaluations(studentId);
  const target = list.find((e: any) => String(e._id || e.id) === String(evaluationId) || e.evaluationId === evaluationId);
  if (!target) throw new Error('Evaluation record not found');

  const eDbId = String(target._id || target.id || evaluationId);
  const paperId = target.paperId;

  const qEvaluations = await dataRepository.getQuestionEvaluations(target.evaluationId || eDbId);
  const tEvaluations = await dataRepository.getTopicEvaluations(target.evaluationId || eDbId);
  const cEvaluations = await dataRepository.getConceptEvaluations(target.evaluationId || eDbId);
  const misconceptions = await dataRepository.getStudentMisconceptions(studentId);
  const recommendations = generateRemediationRecommendations(tEvaluations, cEvaluations);

  return {
    id: eDbId,
    evaluationId: target.evaluationId || eDbId,
    paperId: String(paperId),
    studentId: String(studentId),
    totalMarks: target.totalMarks || 50,
    earnedMarks: target.earnedMarks || 0,
    percentage: target.percentage || 0,
    accuracy: target.accuracy || 0,
    completionRate: target.completionRate || 100,
    averageResponseTimeSeconds: target.averageResponseTimeSeconds || 30,
    unansweredCount: target.unansweredCount || 0,
    correctCount: target.correctCount || 0,
    incorrectCount: target.incorrectCount || 0,
    skippedCount: target.skippedCount || 0,
    negativeMarks: target.negativeMarks || 0,
    evaluationStatus: target.evaluationStatus || 'completed',
    overallLevel: target.overallLevel || 'developing',
    aiInsight: target.aiInsight || '',
    questionEvaluations: (qEvaluations || []).map((q: any) => ({
      questionId: q.questionId,
      paperId: String(paperId),
      questionType: q.questionType,
      topicId: q.topicId,
      conceptId: q.conceptId,
      difficulty: q.difficulty,
      submittedAnswer: q.submittedAnswer,
      isCorrect: q.isCorrect,
      marksAvailable: q.marksAvailable,
      marksAwarded: q.marksAwarded,
      negativeMarks: q.negativeMarks,
      responseTimeSeconds: q.responseTimeSeconds,
      confidence: q.confidence,
      evaluationMethod: q.evaluationMethod,
      misconceptionType: q.misconceptionType,
      feedback: q.feedback,
    })),
    topicEvaluations: (tEvaluations || []).map((t: any) => ({
      topicId: t.topicId,
      questionsAttempted: t.questionsAttempted,
      correctAnswers: t.correctAnswers,
      accuracy: t.accuracy,
      marksAvailable: t.marksAvailable,
      marksEarned: t.marksEarned,
      status: t.status,
    })),
    conceptEvaluations: (cEvaluations || []).map((c: any) => ({
      conceptId: c.conceptId,
      prerequisiteConceptIds: c.prerequisiteConceptIds || [],
      accuracy: c.accuracy,
      misconceptionCount: c.misconceptionCount,
      readinessScore: c.readinessScore,
      recommendedAction: c.recommendedAction,
    })),
    misconceptions: (misconceptions || []).map((m: any) => ({
      id: String(m._id || m.id),
      studentId: String(studentId),
      topicId: m.topicId,
      conceptId: m.conceptId,
      misconceptionType: m.misconceptionType,
      description: m.description,
      evidenceCount: m.evidenceCount || 1,
      severity: m.severity || 'medium',
      status: m.status || 'active',
      recommendedAction: m.recommendedAction || '',
      lastDetectedAt: m.lastDetectedAt ? new Date(m.lastDetectedAt).toISOString() : new Date().toISOString(),
    })),
    recommendations,
    generatedAt: target.generatedAt ? new Date(target.generatedAt).toISOString() : new Date().toISOString(),
    completedAt: target.completedAt ? new Date(target.completedAt).toISOString() : new Date().toISOString(),
  };
}
