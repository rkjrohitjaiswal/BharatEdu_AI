import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dataRepository } from '../repositories/data.repository.js';

export const getTeacherClasses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const classes = await dataRepository.getTeacherClasses(req.user.id);

    res.status(200).json({
      success: true,
      data: classes || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherStudents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const students = await dataRepository.getTeacherStudents(req.user.id);

    res.status(200).json({
      success: true,
      data: students || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherAnalyticsOverview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const overview = await dataRepository.getTeacherAnalyticsOverview(req.user.id);

    res.status(200).json({
      success: true,
      data: overview || {
        totalClasses: 0,
        totalActiveGaps: 0,
        recentActivityCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
