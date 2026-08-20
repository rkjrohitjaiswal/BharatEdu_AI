import { Request, Response } from 'express';
import {
  completeReviewSession,
  generateRevisionPlan,
  getDueRevisionItems,
  getOverdueRevisionItems,
  getRevisionItemById,
  getRevisionSummary,
  getTodayRevisionPlan,
  getWeeklyRevisionPlanService,
  refreshRevisionPlan,
  startReviewSession,
} from '../ai/revision/service.js';

export const getTodayRevisionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access daily revision plan' });
      return;
    }

    const plan = await getTodayRevisionPlan(user.id);
    res.status(200).json({ success: true, data: plan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch daily revision plan' });
  }
};

export const getWeeklyRevisionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access weekly revision plan' });
      return;
    }

    const plan = await getWeeklyRevisionPlanService(user.id);
    res.status(200).json({ success: true, data: plan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch weekly revision plan' });
  }
};

export const getRevisionSummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access revision summary' });
      return;
    }

    const summary = await getRevisionSummary(user.id);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch revision summary' });
  }
};

export const getDueRevisionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access due revision items' });
      return;
    }

    const items = await getDueRevisionItems(user.id);
    res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch due revision items' });
  }
};

export const getOverdueRevisionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access overdue revision items' });
      return;
    }

    const items = await getOverdueRevisionItems(user.id);
    res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch overdue revision items' });
  }
};

export const getRevisionItemByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access revision item details' });
      return;
    }

    const item = await getRevisionItemById(user.id, id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Revision item not found' });
      return;
    }

    res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch revision item details' });
  }
};

export const generateRevisionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can generate revision items' });
      return;
    }

    const items = await generateRevisionPlan(user.id);
    res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to generate revision items' });
  }
};

export const refreshRevisionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can refresh revision plan' });
      return;
    }

    const plan = await refreshRevisionPlan(user.id);
    res.status(200).json({ success: true, data: plan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to refresh revision plan' });
  }
};

export const startRevisionSessionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can start revision sessions' });
      return;
    }

    const session = await startReviewSession(user.id, id);
    res.status(200).json({ success: true, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to start revision session' });
  }
};

export const completeRevisionSessionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { questionsAttempted = 5, questionsCorrect = 4 } = req.body;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can complete revision sessions' });
      return;
    }

    const result = await completeReviewSession(
      user.id,
      id,
      Number(questionsAttempted),
      Number(questionsCorrect)
    );
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to complete revision session' });
  }
};
