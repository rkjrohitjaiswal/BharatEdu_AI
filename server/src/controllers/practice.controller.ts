import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dataRepository } from '../repositories/data.repository.js';
import { PracticeTopicSelector } from '../ai/practice/selector.js';
import { PracticeDifficultyEngine } from '../ai/practice/difficulty.js';
import { GroundedQuestionGenerator } from '../ai/practice/generator.js';
import { LearningIntelligenceEngine } from '../ai/learning/analyzer.js';
import { GoalService } from '../learning-goals/service.js';

// Utility helper to strip correctAnswer from question objects before sending to frontend
const sanitizeQuestionForClient = (q: any) => {
  if (!q) return null;
  const { correctAnswer, ...clientSafe } = q.toObject ? q.toObject() : q;
  return clientSafe;
};

export const createPracticeSession = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { subjectId, topicId, questionCount = 5 } = req.body;

    // 1. Select Target Topic & Learning Gap Context
    const topicSelection = await PracticeTopicSelector.selectTargetTopic(
      req.user.id,
      subjectId,
      topicId
    );

    // 2. Fetch Student Profile & Masteries for Initial Difficulty
    const masteries = await dataRepository.getTopicMastery(req.user.id);
    const targetMastery = masteries.find(
      (m) => String(m.topicId?._id || m.topicId) === topicSelection.topicId
    );
    const masteryScore = targetMastery?.masteryScore || 0;

    const initialDifficulty = PracticeDifficultyEngine.calculateInitialDifficulty(
      masteryScore,
      topicSelection.priority
    );

    // 3. Generate / Retrieve Questions
    const count = Math.min(10, Math.max(1, Number(questionCount) || 5));
    const questionsList: any[] = [];
    const excludeTexts: string[] = [];

    for (let i = 0; i < count; i++) {
      const qPayload = await GroundedQuestionGenerator.generateOrRetrieveQuestion({
        subjectId: topicSelection.subjectId,
        topicId: topicSelection.topicId,
        difficulty: initialDifficulty,
        language: req.user.preferredLanguage || 'english',
        excludeQuestionTexts: excludeTexts,
      });

      excludeTexts.push(qPayload.questionText);
      questionsList.push({
        questionText: qPayload.questionText,
        questionType: qPayload.questionType,
        options: qPayload.options,
        correctAnswer: qPayload.correctAnswer,
        explanation: qPayload.explanation,
        difficulty: qPayload.difficulty,
        learningObjective: qPayload.learningObjective,
        presentedAt: new Date(),
        sources: qPayload.sources || [],
      });
    }

    // 4. Create PracticeSession in Repository
    const session = await dataRepository.createPracticeSession({
      studentId: req.user.id as any,
      subjectId: topicSelection.subjectId as any,
      topicId: topicSelection.topicId as any,
      learningGapId: topicSelection.learningGapId as any,
      questions: questionsList,
      currentQuestionIndex: 0,
      difficulty: initialDifficulty,
      totalQuestions: questionsList.length,
      completedQuestions: 0,
      correctAnswers: 0,
      score: 0,
      status: 'in_progress',
      startedAt: new Date(),
    });

    const clientCurrentQuestion = sanitizeQuestionForClient(session.questions[0]);

    res.status(201).json({
      success: true,
      message: 'Adaptive practice session created successfully',
      data: {
        session: {
          ...session,
          questions: session.questions.map((q: any) =>
            q.answeredAt ? q : sanitizeQuestionForClient(q)
          ),
        },
        currentQuestion: clientCurrentQuestion,
        selectionReason: topicSelection.reason,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPracticeSessions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const sessions = await dataRepository.getPracticeSessions(req.user.id);
    const sanitizedSessions = sessions.map((s) => ({
      ...s,
      questions: (s.questions || []).map((q: any) =>
        q.answeredAt ? q : sanitizeQuestionForClient(q)
      ),
    }));

    res.status(200).json({
      success: true,
      data: sanitizedSessions || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getPracticeSessionById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const session = await dataRepository.getPracticeSessionById(req.user.id, id);

    if (!session) {
      res.status(404).json({ success: false, message: 'Practice session not found or access denied' });
      return;
    }

    const sanitizedQuestions = (session.questions || []).map((q: any) =>
      q.answeredAt ? q : sanitizeQuestionForClient(q)
    );

    res.status(200).json({
      success: true,
      data: {
        ...session,
        questions: sanitizedQuestions,
        currentQuestion: sanitizedQuestions[session.currentQuestionIndex] || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitPracticeAnswer = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { questionIndex, answer, confidence, timeSpentSeconds } = req.body;

    if (typeof answer !== 'string' || answer.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Answer string is required' });
      return;
    }

    // 1. Ownership & Session Check
    const session = await dataRepository.getPracticeSessionById(req.user.id, id);
    if (!session) {
      res.status(404).json({ success: false, message: 'Practice session not found or access denied' });
      return;
    }

    if (session.status === 'completed') {
      res.status(400).json({ success: false, message: 'Practice session is already completed' });
      return;
    }

    const qIdx = typeof questionIndex === 'number' ? questionIndex : session.currentQuestionIndex;
    const targetQ = session.questions[qIdx];

    if (!targetQ) {
      res.status(404).json({ success: false, message: 'Question not found in practice session' });
      return;
    }

    // 2. Server-Side Authoritative Answer Evaluation (Strict comparison for MCQ)
    const normalizedStudentAns = answer.trim().toLowerCase();
    const normalizedCorrectAns = (targetQ.correctAnswer || '').trim().toLowerCase();
    const isCorrect = normalizedStudentAns === normalizedCorrectAns;

    const feedbackText = isCorrect
      ? `Correct! Excellent work isolating the correct solution.`
      : `Not quite. Correct answer: "${targetQ.correctAnswer}". ${targetQ.explanation || ''}`;

    // 3. Update Question Item inside Session
    targetQ.studentAnswer = answer.trim();
    targetQ.isCorrect = isCorrect;
    targetQ.answeredAt = new Date();
    targetQ.score = isCorrect ? 100 : 0;
    targetQ.timeSpentSeconds = Number(timeSpentSeconds) || 15;
    targetQ.confidence = typeof confidence === 'number' ? confidence : 0.5;
    targetQ.feedback = feedbackText;

    const updatedCompletedQuestions = (session.completedQuestions || 0) + 1;
    const updatedCorrectAnswers = (session.correctAnswers || 0) + (isCorrect ? 1 : 0);
    const updatedScore = Math.round((updatedCorrectAnswers / updatedCompletedQuestions) * 100);

    // 4. In-Session Difficulty Adaptation
    const answeredHistory = session.questions
      .filter((q: any) => typeof q.isCorrect === 'boolean')
      .map((q: any) => q.isCorrect as boolean);

    const nextDifficulty = PracticeDifficultyEngine.adaptDifficulty(session.difficulty, answeredHistory);

    const nextQuestionIdx = qIdx + 1;
    const isFinished = nextQuestionIdx >= session.totalQuestions;

    const updatedSession = await dataRepository.updatePracticeSession(req.user.id, id, {
      questions: session.questions,
      currentQuestionIndex: isFinished ? qIdx : nextQuestionIdx,
      completedQuestions: updatedCompletedQuestions,
      correctAnswers: updatedCorrectAnswers,
      score: updatedScore,
      difficulty: nextDifficulty,
      status: isFinished ? 'completed' : 'in_progress',
      completedAt: isFinished ? new Date() : undefined,
    });

    // 5. Trigger Phase 6A Learning Intelligence Engine Evidence Analysis
    const evidenceId = `ps_ans_${id}_q${qIdx}_${Date.now()}`;
    const topicIdStr = String(session.topicId?._id || session.topicId);

    const learningAnalysis = await LearningIntelligenceEngine.processLearningEvidence({
      studentId: req.user.id,
      topicId: topicIdStr,
      evidenceId,
      analysisType: 'practice_attempt',
      isCorrect,
      studentAnswer: answer.trim(),
      confidence: targetQ.confidence,
    });

    const nextQuestionClient = !isFinished && updatedSession.questions[nextQuestionIdx]
      ? sanitizeQuestionForClient(updatedSession.questions[nextQuestionIdx])
      : null;

    res.status(200).json({
      success: true,
      message: 'Answer evaluated successfully',
      data: {
        isCorrect,
        correctAnswer: targetQ.correctAnswer, // Returned now that question is answered
        explanation: targetQ.explanation,
        feedback: feedbackText,
        sessionProgress: {
          completedQuestions: updatedCompletedQuestions,
          totalQuestions: session.totalQuestions,
          currentScore: updatedScore,
          difficulty: nextDifficulty,
          isCompleted: isFinished,
        },
        learningAnalysis,
        nextQuestion: nextQuestionClient,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const completePracticeSession = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const session = await dataRepository.getPracticeSessionById(req.user.id, id);

    if (!session) {
      res.status(404).json({ success: false, message: 'Practice session not found or access denied' });
      return;
    }

    const updated = await dataRepository.updatePracticeSession(req.user.id, id, {
      status: 'completed',
      completedAt: new Date(),
    });

    // Trigger goal progress recalculation and achievement evaluation
    await GoalService.recalculateAllStudentGoals(req.user.id);

    const updatedSession = await dataRepository.updatePracticeSession(req.user.id, id, {
      status: 'completed',
      completedAt: new Date(),
    });

    const masteries = await dataRepository.getTopicMastery(req.user.id);
    const currentMastery = masteries.find(
      (m) => String(m.topicId?._id || m.topicId) === String(session.topicId?._id || session.topicId)
    );

    res.status(200).json({
      success: true,
      message: 'Practice session completed successfully',
      data: {
        session: updatedSession,
        summary: {
          totalQuestions: session.totalQuestions,
          correctAnswers: session.correctAnswers,
          score: session.score,
          accuracy: session.completedQuestions > 0 ? Math.round((session.correctAnswers / session.completedQuestions) * 100) : 0,
          currentMasteryScore: currentMastery?.masteryScore || 0,
          masteryStatus: currentMastery?.status || 'learning',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPracticeRecommendations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const recommendations = await PracticeTopicSelector.generateRecommendations(req.user.id);
    res.status(200).json({
      success: true,
      data: recommendations || [],
    });
  } catch (error) {
    next(error);
  }
};
