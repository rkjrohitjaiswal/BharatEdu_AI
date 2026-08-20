import { dataRepository } from '../../repositories/data.repository.js';
import { AssessmentDifficulty, AssessmentType } from '../../models/adaptive-assessment.model.js';
import { generateAIAssessmentPostInsight } from './ai-coach.js';
import { aggregateStudentAssessmentContext } from './context.js';
import { calculateNextAdaptiveDifficulty } from './difficulty-engine.js';
import { evaluateSubmittedQuestionAnswer } from './evaluation.js';
import { getFallbackQuestionForConcept } from './question-engine.js';
import { IAdaptiveAssessmentDTO, IAssessmentQuestionClientDTO, IAssessmentResultsDTO } from './types.js';

export async function createStudentAdaptiveAssessmentEngine(
  studentId: string,
  options?: {
    assessmentType?: AssessmentType;
    subject?: string;
    conceptId?: string;
    questionCount?: number;
    difficulty?: AssessmentDifficulty;
  }
): Promise<IAdaptiveAssessmentDTO> {
  const context = await aggregateStudentAssessmentContext(studentId, options?.conceptId);

  const assessmentId = `asst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const type = options?.assessmentType || 'mastery_check';
  const difficulty = options?.difficulty || context.recommendedDifficulty;
  const questionCount = Math.min(options?.questionCount || 5, 10);
  const subject = options?.subject || 'Mathematics';

  const title = `${subject}: ${type.replace('_', ' ').toUpperCase()} Assessment`;

  const created = await dataRepository.createAdaptiveAssessment({
    assessmentId,
    studentId,
    title,
    subject,
    classLevel: 'Class 10',
    board: 'CBSE',
    assessmentType: type,
    targetConceptId: context.conceptId,
    prerequisiteConceptIds: context.prerequisiteConceptIds,
    difficulty,
    questionCount,
    timeLimitMinutes: questionCount * 2,
    status: 'ready',
    currentQuestionIndex: 0,
    completedQuestions: 0,
    correctAnswers: 0,
    score: 0,
    accuracy: 0,
    masteryImpact: 0,
    startingDifficulty: difficulty,
    currentDifficulty: difficulty,
  });

  const asstDbId = String(created._id || created.id || assessmentId);

  // Pre-generate questions for assessment
  let currDiff = difficulty;
  for (let i = 1; i <= questionCount; i++) {
    const qData = getFallbackQuestionForConcept(subject, context.topicId, context.conceptId, currDiff, i);
    await dataRepository.createAssessmentQuestion({
      assessmentId: asstDbId,
      questionId: `q_${Date.now()}_${i}`,
      studentId,
      sequence: i,
      subject,
      topicId: context.topicId,
      conceptId: context.conceptId,
      difficulty: currDiff,
      questionType: qData.questionType,
      question: qData.question,
      options: qData.options,
      correctAnswer: qData.correctAnswer, // Server-side only!
      marks: qData.marks,
      timeLimitSeconds: qData.timeLimitSeconds,
      sourceType: qData.sourceType,
      generatedBy: qData.generatedBy,
      status: 'pending',
    });
  }

  const currentQ = await getCurrentAssessmentQuestionEngine(studentId, asstDbId);

  return {
    id: asstDbId,
    assessmentId,
    studentId: String(studentId),
    title,
    subject,
    classLevel: 'Class 10',
    board: 'CBSE',
    assessmentType: type,
    targetConceptId: context.conceptId,
    difficulty,
    questionCount,
    timeLimitMinutes: questionCount * 2,
    status: 'ready',
    currentQuestionIndex: 0,
    score: 0,
    accuracy: 0,
    masteryImpact: 0,
    currentQuestion: currentQ || undefined,
    createdAt: created.createdAt ? new Date(created.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: created.updatedAt ? new Date(created.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export async function getCurrentAssessmentQuestionEngine(
  studentId: string,
  assessmentId: string
): Promise<IAssessmentQuestionClientDTO | null> {
  const questions = await dataRepository.getAssessmentQuestions(assessmentId);
  const pending = questions.find((q) => q.status === 'pending');
  if (!pending) return null;

  // SANITIZE Payload: OMIT correctAnswer from payload returned to client!
  return {
    id: String(pending._id || pending.id || pending.questionId),
    questionId: pending.questionId,
    assessmentId: String(assessmentId),
    sequence: pending.sequence,
    subject: pending.subject,
    topicId: pending.topicId,
    conceptId: pending.conceptId,
    difficulty: pending.difficulty,
    questionType: pending.questionType,
    question: pending.question,
    options: pending.options,
    marks: pending.marks,
    timeLimitSeconds: pending.timeLimitSeconds,
    status: pending.status,
  };
}

export async function submitAssessmentAnswerEngine(
  studentId: string,
  assessmentId: string,
  questionId: string,
  submittedAnswer: string,
  responseTimeSeconds = 30
) {
  const asst = await dataRepository.getAdaptiveAssessment(assessmentId, studentId);
  const q = await dataRepository.getAssessmentQuestion(questionId);
  if (!asst || !q) throw new Error('Assessment or question not found');

  const evalResult = evaluateSubmittedQuestionAnswer(q.questionType, submittedAnswer, q.correctAnswer, q.marks);

  await dataRepository.createAssessmentAttempt({
    assessmentId,
    questionId,
    studentId,
    submittedAnswer,
    isCorrect: evalResult.isCorrect,
    marksAwarded: evalResult.marksAwarded,
    responseTimeSeconds,
    evaluatedBy: 'deterministic',
    feedback: evalResult.feedback,
  });

  await dataRepository.updateAssessmentQuestion(questionId, { status: 'answered', submittedAt: new Date() });

  // Adjust Adaptive Difficulty for Assessment
  const nextDiff = calculateNextAdaptiveDifficulty(asst.currentDifficulty || 'medium', evalResult.isCorrect);

  const completedCount = (asst.completedQuestions || 0) + 1;
  const correctCount = (asst.correctAnswers || 0) + (evalResult.isCorrect ? 1 : 0);
  const totalScore = (asst.score || 0) + evalResult.marksAwarded;
  const accuracy = Math.round((correctCount / completedCount) * 100);

  const updatedAsst = await dataRepository.updateAdaptiveAssessment(assessmentId, studentId, {
    completedQuestions: completedCount,
    correctAnswers: correctCount,
    score: totalScore,
    accuracy,
    currentDifficulty: nextDiff,
    currentQuestionIndex: completedCount,
    status: completedCount >= asst.questionCount ? 'completed' : 'in_progress',
  });

  const nextQ = await getCurrentAssessmentQuestionEngine(studentId, assessmentId);

  return {
    assessmentId,
    questionId,
    isCorrect: evalResult.isCorrect,
    marksAwarded: evalResult.marksAwarded,
    feedback: evalResult.feedback,
    nextDifficulty: nextDiff,
    nextQuestion: nextQ,
    isFinished: completedCount >= asst.questionCount,
  };
}

export async function getAssessmentResultsEngine(studentId: string, assessmentId: string): Promise<IAssessmentResultsDTO> {
  const asst = await dataRepository.getAdaptiveAssessment(assessmentId, studentId);
  const attempts = await dataRepository.getAssessmentAttempts(assessmentId);

  const totalMarks = attempts.length || 1;
  const earnedMarks = attempts.filter((a) => a.isCorrect).length;
  const accuracy = Math.round((earnedMarks / totalMarks) * 100);

  const { explanation } = await generateAIAssessmentPostInsight(
    earnedMarks,
    accuracy,
    asst?.subject || 'Mathematics',
    asst?.title || 'Assessment'
  );

  return {
    assessmentId,
    studentId,
    title: asst?.title || 'Adaptive Assessment',
    score: earnedMarks,
    totalMarks,
    accuracy,
    completionRate: 100,
    masteryImpact: Math.round(accuracy * 0.2),
    topicPerformance: [{ topicId: 'Algebra', topicName: 'Algebra', accuracy }],
    conceptPerformance: [{ conceptId: asst?.targetConceptId || 'math_linear_eq', conceptName: 'Linear Equations', accuracy }],
    difficultyPerformance: [{ difficulty: asst?.currentDifficulty || 'medium', accuracy }],
    aiExplanation: explanation,
    evaluatedAt: new Date().toISOString(),
  };
}
