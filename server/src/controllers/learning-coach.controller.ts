import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { AILearningCoach } from '../ai/learning-coach/coach.js';

export const getTodayLearningCoach = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const plan = await AILearningCoach.generateDailyPlan(req.user.id);

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshTodayLearningCoach = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const plan = await AILearningCoach.generateDailyPlan(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Learning Coach plan refreshed',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};
