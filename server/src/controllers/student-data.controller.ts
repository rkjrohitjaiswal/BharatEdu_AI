import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dataRepository } from '../repositories/data.repository.js';

export const getStudentDashboard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const dashboardData = await dataRepository.getStudentDashboardData(req.user.id);

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudyTaskStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { taskId } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
      res.status(400).json({ success: false, message: 'completed boolean status is required' });
      return;
    }

    const success = await dataRepository.updateStudyPlanTask(req.user.id, taskId, completed);

    if (!success) {
      res.status(404).json({ success: false, message: 'Study plan or task not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentLearningProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const learningProfile = await dataRepository.getLearningProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: learningProfile || {
        overallMastery: 0,
        confidenceScore: 0,
        strengths: [],
        weaknesses: [],
        learningGoals: [],
        recommendedTopics: [],
        currentLearningPath: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentMastery = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const masteryList = await dataRepository.getTopicMastery(req.user.id);

    res.status(200).json({
      success: true,
      data: masteryList || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentLearningGaps = async (
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

export const getStudentEngagement = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const events = await dataRepository.getEngagementEvents(req.user.id);

    res.status(200).json({
      success: true,
      data: events || [],
    });
  } catch (error) {
    next(error);
  }
};
