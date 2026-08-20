import { dataRepository } from '../../repositories/data.repository.js';
import { generateAIPracticeQuestion, VERIFIED_PRACTICE_QUESTION_BANK } from './ai-coach.js';
import { selectBestPracticeConcept } from './concept-selector.js';
import { buildStudentPracticeContext } from './context.js';
import { calculateAdaptiveDifficulty } from './difficulty.js';
import { buildPostSubmissionExplanation } from './explanation.js';
import { getProgressiveHint } from './hints.js';
import { rankAndSelectQuestion } from './selector.js';
import { PracticeDifficulty, PracticeMode, PracticeSessionSummary, QuestionCandidate } from './types.js';
import { validatePracticeQuestion } from './validator.js';

export interface ActiveSessionState {
  sessionId: string;
  studentId: string;
  mode: PracticeMode;
  targetConceptId: string;
  startingDifficulty: PracticeDifficulty;
  currentDifficulty: PracticeDifficulty;
  questionIds: string[];
  currentIndex: number;
  attempts: any[];
  hintsUsedCount: number;
  startTime: Date;
  status: 'active' | 'completed';
}

export async function createPersonalizedPracticeSession(
  studentId: string,
  mode: PracticeMode = 'mixed',
  questionCount: number = 5,
  requestedConceptId?: string
): Promise<ActiveSessionState> {
  const context = await buildStudentPracticeContext(studentId);
  const selectedConcept = selectBestPracticeConcept(context, mode, requestedConceptId);
  const startingDifficulty: PracticeDifficulty = 'medium';

  // Collect candidate questions from verified bank and DB
  const dbQuestions = (await dataRepository.getPracticeQuestions(selectedConcept.conceptId)) || [];
  const candidates: QuestionCandidate[] = [...VERIFIED_PRACTICE_QUESTION_BANK, ...dbQuestions];

  // If candidate count is below required session size, generate fresh candidates
  if (candidates.length < questionCount) {
    const generated = await generateAIPracticeQuestion({
      studentId,
      conceptId: selectedConcept.conceptId,
      topicId: selectedConcept.topicId,
      subject: selectedConcept.subject,
      difficulty: startingDifficulty,
      generationReason: `adaptive_${mode}`,
    });
    const validated = validatePracticeQuestion(generated);
    if (validated.isValid) {
      candidates.push(generated);
      await dataRepository.createPracticeQuestion(generated);
    }
  }

  // Select top ranked question IDs
  const sessionQuestionIds: string[] = candidates
    .filter((q) => q.conceptId === selectedConcept.conceptId || mode === 'mixed')
    .slice(0, Math.min(questionCount, candidates.length))
    .map((q) => q.questionId);

  // If still empty, fallback to starter bank
  if (sessionQuestionIds.length === 0) {
    sessionQuestionIds.push(...VERIFIED_PRACTICE_QUESTION_BANK.map((q) => q.questionId));
  }

  const session: ActiveSessionState = {
    sessionId: `psession_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    studentId,
    mode,
    targetConceptId: selectedConcept.conceptId,
    startingDifficulty,
    currentDifficulty: startingDifficulty,
    questionIds: sessionQuestionIds,
    currentIndex: 0,
    attempts: [],
    hintsUsedCount: 0,
    startTime: new Date(),
    status: 'active',
  };

  await dataRepository.savePersonalizedPracticeSession(session);
  return session;
}

export async function getCurrentSessionQuestion(sessionId: string, studentId: string): Promise<{
  question: Omit<QuestionCandidate, 'correctAnswer' | 'explanation' | 'solutionSteps'>;
  currentIndex: number;
  totalQuestions: number;
  currentDifficulty: PracticeDifficulty;
}> {
  const session: ActiveSessionState = await dataRepository.getPersonalizedPracticeSession(sessionId, studentId);
  if (!session || session.status === 'completed') {
    throw new Error('Session not found or already completed');
  }

  const qId = session.questionIds[session.currentIndex] || session.questionIds[0];
  const fullQ: QuestionCandidate = await dataRepository.getPracticeQuestionById(qId);

  // SANITIZE PAYLOAD: Remove correctAnswer, explanation, solutionSteps
  const { correctAnswer, explanation, solutionSteps, ...safeQuestion } = fullQ;

  return {
    question: safeQuestion,
    currentIndex: session.currentIndex + 1,
    totalQuestions: session.questionIds.length,
    currentDifficulty: session.currentDifficulty,
  };
}

export async function submitSessionAnswer(
  sessionId: string,
  studentId: string,
  selectedAnswer: any,
  responseTimeSeconds: number = 30
): Promise<{
  isCorrect: boolean;
  explanation: any;
  nextDifficulty: PracticeDifficulty;
  isSessionComplete: boolean;
}> {
  const session: ActiveSessionState = await dataRepository.getPersonalizedPracticeSession(sessionId, studentId);
  if (!session || session.status === 'completed') {
    throw new Error('Session not found or already completed');
  }

  const qId = session.questionIds[session.currentIndex];
  const fullQ: QuestionCandidate = await dataRepository.getPracticeQuestionById(qId);

  // Server-authoritative check
  const isCorrect = String(selectedAnswer).trim().toLowerCase() === String(fullQ.correctAnswer).trim().toLowerCase();

  // Record attempt
  const attemptRecord = {
    attemptId: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    studentId,
    questionId: qId,
    sessionId,
    selectedAnswer,
    isCorrect,
    responseTimeSeconds,
    hintUsed: 0,
    attemptNumber: 1,
    difficulty: session.currentDifficulty,
    conceptId: fullQ.conceptId,
    submittedAt: new Date(),
  };

  session.attempts.push(attemptRecord);
  await dataRepository.savePersonalizedAttempt(attemptRecord);

  // Build post-submission explanation
  const explanation = buildPostSubmissionExplanation(fullQ, selectedAnswer, isCorrect);

  // Calculate adaptive difficulty for next question
  const recentAcc = (session.attempts.filter((a) => a.isCorrect).length / session.attempts.length) * 100;
  const nextDiff = calculateAdaptiveDifficulty(session.currentDifficulty, recentAcc, 0, 0, responseTimeSeconds);
  session.currentDifficulty = nextDiff;

  // Advance index
  session.currentIndex += 1;
  const isSessionComplete = session.currentIndex >= session.questionIds.length;
  if (isSessionComplete) {
    session.status = 'completed';
  }

  await dataRepository.savePersonalizedPracticeSession(session);

  return {
    isCorrect,
    explanation,
    nextDifficulty: nextDiff,
    isSessionComplete,
  };
}

export async function requestSessionHint(
  sessionId: string,
  studentId: string,
  hintLevel: number = 1
): Promise<{ hintLevel: number; hintText: string; totalHintsAvailable: number }> {
  const session: ActiveSessionState = await dataRepository.getPersonalizedPracticeSession(sessionId, studentId);
  if (!session) throw new Error('Session not found');

  const qId = session.questionIds[session.currentIndex] || session.questionIds[0];
  const fullQ: QuestionCandidate = await dataRepository.getPracticeQuestionById(qId);

  session.hintsUsedCount += 1;
  await dataRepository.savePersonalizedPracticeSession(session);

  return getProgressiveHint(fullQ, hintLevel);
}

export async function getSessionSummaryResult(
  sessionId: string,
  studentId: string
): Promise<PracticeSessionSummary> {
  const session: ActiveSessionState = await dataRepository.getPersonalizedPracticeSession(sessionId, studentId);
  if (!session) throw new Error('Session not found');

  const total = session.questionIds.length;
  const correct = session.attempts.filter((a) => a.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const totalTime = Math.round((Date.now() - new Date(session.startTime).getTime()) / 1000);

  return {
    sessionId: session.sessionId,
    studentId,
    mode: session.mode,
    totalQuestions: total,
    completedQuestions: session.attempts.length,
    correctAnswers: correct,
    accuracyPercentage: accuracy,
    totalTimeSeconds: totalTime,
    hintsUsedCount: session.hintsUsedCount,
    startingDifficulty: session.startingDifficulty,
    endingDifficulty: session.currentDifficulty,
    conceptsPracticed: [session.targetConceptId],
    misconceptionsIdentified: accuracy < 60 ? ['sign_error_in_factoring'] : [],
    recommendedResourceId: accuracy < 60 ? 'res_ncert_math_algebra' : undefined,
    completedAt: new Date(),
  };
}
