import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { LearningIntelligenceEngine } from '../ai/learning/analyzer.js';
import { dataRepository } from '../repositories/data.repository.js';

export const analyzeEvidence = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { topicId, evidenceId, analysisType, isCorrect, studentAnswer, confidence } = req.body;

    if (!topicId || typeof isCorrect !== 'boolean') {
      res.status(400).json({
        success: false,
        message: 'Missing required evidence fields: topicId and isCorrect boolean are required',
      });
      return;
    }

    const uniqueEvidenceId = evidenceId || `ev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const result = await LearningIntelligenceEngine.processLearningEvidence({
      studentId: req.user.id,
      topicId,
      evidenceId: uniqueEvidenceId,
      analysisType: analysisType || 'practice_attempt',
      isCorrect,
      studentAnswer: studentAnswer || '',
      confidence: typeof confidence === 'number' ? confidence : 0.5,
    });

    res.status(200).json({
      success: true,
      message: 'Learning evidence analyzed and profile updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentGaps = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const gaps = await dataRepository.getLearningGaps(req.user.id);
    res.status(200).json({
      success: true,
      data: gaps || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentGapById = async (
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
    const gap = await dataRepository.getLearningGapById(req.user.id, id);

    if (!gap) {
      res.status(404).json({ success: false, message: 'Learning gap not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      data: gap,
    });
  } catch (error) {
    next(error);
  }
};

export const resolveStudentGap = async (
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
    const success = await dataRepository.resolveLearningGap(req.user.id, id);

    if (!success) {
      res.status(404).json({ success: false, message: 'Learning gap not found or already resolved' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Learning gap status updated to resolved successfully',
    });
  } catch (error) {
    next(error);
  }
};
