import { Request, Response } from 'express';
import {
  completeTask,
  generatePlanner,
  getPlannerSummary,
  getTodayPlanner,
  getWeekPlanner,
  refreshPlanner,
} from '../ai/study-planner/service.js';

export const getTodayPlannerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access study planner' });
      return;
    }

    const availableMinutes = req.query.availableMinutes ? Number(req.query.availableMinutes) : undefined;
    const data = await getTodayPlanner(user.id, availableMinutes);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch today\'s study plan' });
  }
};

export const getWeekPlannerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access study planner' });
      return;
    }

    const data = await getWeekPlanner(user.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch weekly study plan' });
  }
};

export const generatePlannerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access study planner' });
      return;
    }

    const availableMinutes = req.body.availableMinutes ? Number(req.body.availableMinutes) : undefined;
    const data = await generatePlanner(user.id, availableMinutes);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to generate study plan' });
  }
};

export const refreshPlannerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access study planner' });
      return;
    }

    const availableMinutes = req.body.availableMinutes ? Number(req.body.availableMinutes) : undefined;
    const data = await refreshPlanner(user.id, availableMinutes);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to refresh study plan' });
  }
};

export const completeTaskController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { taskId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access study planner' });
      return;
    }
    if (!taskId) {
      res.status(400).json({ success: false, message: 'Task ID is required' });
      return;
    }

    const data = await completeTask(user.id, taskId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    if (error?.message === 'TASK_NOT_FOUND') {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(500).json({ success: false, message: error?.message || 'Failed to complete study task' });
  }
};

export const getPlannerSummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access study planner' });
      return;
    }

    const data = await getPlannerSummary(user.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch planner summary' });
  }
};
