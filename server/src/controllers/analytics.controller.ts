import { Request, Response } from 'express';
import { buildParentProgressSummary, buildStudentAnalytics, buildTeacherClassAnalytics } from '../ai/analytics/engine.js';

export const getStudentAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const studentId = user?.id;
    if (!studentId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user?.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access student analytics' });
      return;
    }

    const analytics = await buildStudentAnalytics(studentId);
    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to generate student analytics',
    });
  }
};

export const getTeacherAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const teacherId = user?.id;
    if (!teacherId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user?.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'Only teachers can access class analytics' });
      return;
    }

    const analytics = await buildTeacherClassAnalytics(teacherId);
    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to generate teacher analytics',
    });
  }
};

export const getParentStudentAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const parentId = user?.id;
    const { studentId } = req.params;

    if (!parentId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user?.role !== 'parent') {
      res.status(403).json({ success: false, message: 'Only parents can access student progress summary' });
      return;
    }

    if (!studentId) {
      res.status(400).json({ success: false, message: 'Student ID is required' });
      return;
    }

    const analytics = await buildParentProgressSummary(parentId, studentId);
    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    if (error?.message?.includes('Unauthorized')) {
      res.status(403).json({ success: false, message: 'You are not linked to this student' });
      return;
    }
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to generate parent student analytics',
    });
  }
};
