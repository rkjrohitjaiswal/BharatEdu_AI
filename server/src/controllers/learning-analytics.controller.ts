import { Request, Response } from 'express';
import {
  getLearningAnalyticsAdvice,
  getLearningAnalyticsOverview,
  getLearningAnalyticsPractice,
  getLearningAnalyticsSubjects,
  getLearningAnalyticsSummary,
  getLearningAnalyticsTopics,
  getLearningAnalyticsWeekly,
} from '../ai/learning-analytics/service.js';

export const getStudentAnalyticsOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access student analytics' });
      return;
    }

    const data = await getLearningAnalyticsOverview(user.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch analytics overview' });
  }
};

export const getStudentAnalyticsSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access student analytics' });
      return;
    }

    const data = await getLearningAnalyticsSubjects(user.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch subject analytics' });
  }
};

export const getStudentAnalyticsTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access student analytics' });
      return;
    }

    const data = await getLearningAnalyticsTopics(user.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch topic analytics' });
  }
};

export const getStudentAnalyticsPractice = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access student analytics' });
      return;
    }

    const data = await getLearningAnalyticsPractice(user.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch practice analytics' });
  }
};

export const getStudentAnalyticsWeekly = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access student analytics' });
      return;
    }

    const data = await getLearningAnalyticsWeekly(user.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch weekly analytics' });
  }
};

export const getStudentAnalyticsAdvice = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access student analytics' });
      return;
    }

    const data = await getLearningAnalyticsAdvice(user.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to generate analytics advice' });
  }
};

export const getStudentAnalyticsSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access student analytics' });
      return;
    }

    const data = await getLearningAnalyticsSummary(user.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch analytics summary' });
  }
};
