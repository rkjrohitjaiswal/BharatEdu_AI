import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dataRepository } from '../repositories/data.repository.js';
import { ExamReadinessEngine } from '../ai/exam-readiness/engine.js';
import { ExamPlanner } from '../ai/exam-readiness/planner.js';
import { ExamAICoach } from '../ai/exam-readiness/ai-coach.js';

export const createExam = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { title, examType, board, classLevel, examDate, subjects, targetScore } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ success: false, message: 'Exam title is required' });
      return;
    }

    if (!examDate || isNaN(Date.parse(examDate))) {
      res.status(400).json({ success: false, message: 'Valid exam date is required' });
      return;
    }

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      res.status(400).json({ success: false, message: 'At least one subject configuration is required' });
      return;
    }

    const examInput = {
      title: title.trim(),
      examType: examType || 'school_exam',
      board,
      classLevel,
      examDate: new Date(examDate).toISOString(),
      subjects,
      targetScore: targetScore || 85,
    };

    const createdExam = await dataRepository.createExamPreparation(req.user.id, examInput);

    res.status(201).json({
      success: true,
      message: 'Exam preparation created successfully',
      data: createdExam,
    });
  } catch (error) {
    next(error);
  }
};

export const getExams = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const exams = await dataRepository.getExamPreparations(req.user.id);
    res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

export const getExamById = async (
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
    const exam = await dataRepository.getExamPreparationById(req.user.id, id);

    if (!exam) {
      res.status(404).json({ success: false, message: 'Exam not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExam = async (
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
    const updates = { ...req.body };
    delete updates.studentId;

    const updated = await dataRepository.updateExamPreparation(req.user.id, id, updates);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Exam not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExam = async (
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
    const deleted = await dataRepository.deleteExamPreparation(req.user.id, id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Exam not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getExamReadiness = async (
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
    const readiness = await ExamReadinessEngine.evaluateExamReadiness(req.user.id, id);

    if (!readiness) {
      res.status(404).json({ success: false, message: 'Exam not found or access denied' });
      return;
    }

    // Enrich using AI coach
    const enriched = await ExamAICoach.enrichReadinessExplanation(readiness);
    readiness.explanation = enriched.explanation;
    readiness.recommendations = enriched.recommendations;
    readiness.aiEnhanced = enriched.aiEnhanced;

    res.status(200).json({
      success: true,
      data: readiness,
    });
  } catch (error) {
    next(error);
  }
};

export const generateExamPlan = async (
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
    const { availableDailyMinutes } = req.body;

    const readiness = await ExamReadinessEngine.evaluateExamReadiness(req.user.id, id);

    if (!readiness) {
      res.status(404).json({ success: false, message: 'Exam not found or access denied' });
      return;
    }

    const plan = ExamPlanner.generateExamPlan(readiness, availableDailyMinutes || 60);
    await dataRepository.saveExamPlan(req.user.id, id, plan);

    res.status(200).json({
      success: true,
      message: 'Exam plan generated successfully',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

export const getExamPlan = async (
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
    let plan = await dataRepository.getExamPlan(req.user.id, id);

    if (!plan) {
      const readiness = await ExamReadinessEngine.evaluateExamReadiness(req.user.id, id);
      if (!readiness) {
        res.status(404).json({ success: false, message: 'Exam not found or access denied' });
        return;
      }
      plan = ExamPlanner.generateExamPlan(readiness, 60);
      await dataRepository.saveExamPlan(req.user.id, id, plan);
    }

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExamPlanTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id, taskId } = req.params;
    const { completed } = req.body;

    const updatedPlan = await dataRepository.updateExamPlanTask(
      req.user.id,
      id,
      taskId,
      Boolean(completed)
    );

    if (!updatedPlan) {
      res.status(404).json({ success: false, message: 'Exam plan or task not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Exam task updated successfully',
      data: updatedPlan,
    });
  } catch (error) {
    next(error);
  }
};

export const createMockExam = async (
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
    const exam = await dataRepository.getExamPreparationById(req.user.id, id);

    if (!exam) {
      res.status(404).json({ success: false, message: 'Exam not found or access denied' });
      return;
    }

    const subjectConfig = exam.subjects[0] || { subjectId: 'math', subjectName: 'Mathematics' };
    const subjectIdStr = String(subjectConfig.subjectId);

    // Reuse existing practice session creation
    const sessionData = {
      studentId: req.user.id,
      subjectId: subjectIdStr,
      topicId: subjectConfig.includedTopicIds?.[0] || 'algebra',
      difficulty: 'medium',
      totalQuestions: 5,
      questions: [
        {
          questionId: 'q_mock_1',
          questionText: `Mock Exam Q1: Solve for x in 2x + 4 = 12`,
          questionType: 'mcq',
          options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'],
          correctAnswer: 'x = 4',
          explanation: 'Subtract 4 from 12 to get 8, then divide by 2 to get 4.',
          difficulty: 'medium',
        },
        {
          questionId: 'q_mock_2',
          questionText: `Mock Exam Q2: What is the derivative of x^2?`,
          questionType: 'mcq',
          options: ['2x', 'x', 'x^2', '2'],
          correctAnswer: '2x',
          explanation: 'Power rule: d/dx(x^n) = n*x^(n-1).',
          difficulty: 'medium',
        },
      ],
      currentQuestionIndex: 0,
      completedQuestions: 0,
      correctAnswers: 0,
      score: 0,
      status: 'in_progress',
      startedAt: new Date(),
    };

    const session = await dataRepository.createPracticeSession(sessionData as any);

    // Strip correctAnswer before returning to frontend
    const clientSafeQuestions = (session.questions || []).map((q: any) => {
      const { correctAnswer, ...safeQ } = q;
      return safeQ;
    });

    res.status(201).json({
      success: true,
      message: 'Mock exam practice session created successfully',
      data: {
        sessionId: session._id || session.id,
        examId: id,
        subjectName: subjectConfig.subjectName,
        totalQuestions: session.totalQuestions,
        questions: clientSafeQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};
