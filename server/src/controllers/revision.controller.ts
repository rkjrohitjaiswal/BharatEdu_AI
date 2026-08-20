import { Request, Response } from 'express';
import {
  completeRevisionOutcome,
  getDailyRevisionQueue,
  getParentStudentRevisionSummary,
  getRevisionSchedule,
  getTeacherStudentRevisionSummary,
  refreshStudentRevisionQueue,
  startRevisionSession,
} from '../ai/smart-revision/service.js';

export const getDailyRevisionQueueController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const queue = await getDailyRevisionQueue(user.id);
    res.status(200).json({ success: true, data: queue });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch daily revision queue' });
  }
};

export const getRevisionScheduleController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { days = '7', subject, priority } = req.query;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const schedule = await getRevisionSchedule(
      user.id,
      Number(days),
      subject ? String(subject) : undefined,
      priority ? String(priority) : undefined
    );
    res.status(200).json({ success: true, data: schedule });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch revision schedule' });
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

    const result = await startRevisionSession(user.id, id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to start revision session' });
  }
};

export const completeRevisionOutcomeController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { outcome } = req.body;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (!outcome || !['again', 'hard', 'good', 'easy'].includes(outcome)) {
      res.status(400).json({ success: false, message: 'Valid outcome is required (again, hard, good, easy)' });
      return;
    }

    const result = await completeRevisionOutcome(user.id, id, outcome);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to submit revision outcome' });
  }
};

export const refreshStudentRevisionQueueController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const refreshed = await refreshStudentRevisionQueue(user.id);
    res.status(200).json({ success: true, data: refreshed });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to refresh revision queue' });
  }
};

export const getTeacherStudentRevisionSummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'Only teachers can access student revision analytics' });
      return;
    }

    const summary = await getTeacherStudentRevisionSummary(user.id, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch teacher revision summary' });
  }
};

export const getParentStudentRevisionSummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'parent') {
      res.status(403).json({ success: false, message: 'Only parents can access student revision analytics' });
      return;
    }

    const summary = await getParentStudentRevisionSummary(user.id, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error?.message || 'Access denied for parent revision summary' });
  }
};
