import { Request, Response } from 'express';
import {
  getStudentMentorAdvice,
  getStudentMentorSummary,
  getTodayStudentMentorPlan,
  getTodayStudentMentorSnapshot,
} from '../ai/student-mentor/service.js';

export const getStudentMentorToday = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access Student Mentor' });
      return;
    }

    const snapshot = await getTodayStudentMentorSnapshot(user.id);
    res.status(200).json({
      success: true,
      data: snapshot,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to retrieve today\'s student mentor snapshot',
    });
  }
};

export const getStudentMentorPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access Student Mentor' });
      return;
    }

    const plan = await getTodayStudentMentorPlan(user.id);
    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to generate student mentor plan',
    });
  }
};

export const getStudentMentorAdviceHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access Student Mentor' });
      return;
    }

    const advice = await getStudentMentorAdvice(user.id);
    res.status(200).json({
      success: true,
      data: advice,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to generate student mentor advice',
    });
  }
};

export const getStudentMentorSummaryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access Student Mentor' });
      return;
    }

    const summary = await getStudentMentorSummary(user.id);
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to retrieve student mentor summary',
    });
  }
};
