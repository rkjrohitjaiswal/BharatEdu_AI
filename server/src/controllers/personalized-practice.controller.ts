import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { PersonalizedPracticeService } from '../ai/personalized-practice/service.js';
import { dataRepository } from '../repositories/data.repository.js';

export const getPracticeRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const recs = await PersonalizedPracticeService.getPracticeRecommendations(studentId);
    res.status(200).json({ success: true, data: recs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch recommendations' });
  }
};

export const createPracticeSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { mode, questionCount, conceptId } = req.body;
    const session = await PersonalizedPracticeService.createSession(studentId, mode, questionCount, conceptId);
    res.status(201).json({ success: true, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create session' });
  }
};

export const getSessionQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { sessionId } = req.params;

    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const qData = await PersonalizedPracticeService.getQuestion(sessionId, studentId);
    res.status(200).json({ success: true, data: qData });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message || 'Question not found' });
  }
};

export const submitAnswer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { sessionId } = req.params;
    const { selectedAnswer, responseTimeSeconds } = req.body;

    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const result = await PersonalizedPracticeService.submitAnswer(sessionId, studentId, selectedAnswer, responseTimeSeconds);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to submit answer' });
  }
};

export const requestHint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { sessionId } = req.params;
    const { hintLevel } = req.body;

    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const hint = await PersonalizedPracticeService.getHint(sessionId, studentId, hintLevel || 1);
    res.status(200).json({ success: true, data: hint });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to request hint' });
  }
};

export const getSessionResult = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { sessionId } = req.params;

    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const result = await PersonalizedPracticeService.getResult(sessionId, studentId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch result' });
  }
};

export const getPracticeHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const history = await PersonalizedPracticeService.getHistory(studentId);
    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch history' });
  }
};

export const getTeacherStudentPracticeSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const summary = await PersonalizedPracticeService.getTeacherPracticeSummary(studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch teacher summary' });
  }
};

export const getParentStudentPracticeSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parentId = req.user?.id;
    const { studentId } = req.params;

    if (!parentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const isLinked = await dataRepository.checkParentStudentLinkActive(parentId, studentId);
    if (!isLinked) {
      res.status(403).json({ success: false, message: 'Access denied. Parent is not linked to this student.' });
      return;
    }

    const summary = await PersonalizedPracticeService.getParentPracticeSummary(studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch parent summary' });
  }
};
