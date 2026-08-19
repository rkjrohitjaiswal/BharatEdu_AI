import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { PracticeHistoryService } from '../learning-history/history.service.js';

export const getPracticeHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { limit, page, subjectId, topicId, difficulty, startDate, endDate } = req.query;

    const result = await PracticeHistoryService.getHistoryList(req.user.id, {
      limit: limit ? parseInt(limit as string, 10) : undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      subjectId: subjectId as string,
      topicId: topicId as string,
      difficulty: difficulty as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPracticeHistorySummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const summary = await PracticeHistoryService.getHistorySummary(req.user.id);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const getPracticeHistorySessionDetail = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { sessionId } = req.params;
    const sessionDetail = await PracticeHistoryService.getSessionDetail(req.user.id, sessionId);

    if (!sessionDetail) {
      res.status(404).json({ success: false, message: 'Practice session history not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      data: sessionDetail,
    });
  } catch (error) {
    next(error);
  }
};
