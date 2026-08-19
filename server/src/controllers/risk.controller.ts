import { Request, Response } from 'express';
import { evaluateParentStudentRisk, evaluateStudentRisk, evaluateTeacherClassRisk } from '../ai/risk/engine.js';

export const getStudentRiskProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const studentId = user?.id;

    if (!studentId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user?.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access student risk profile' });
      return;
    }

    const riskProfile = await evaluateStudentRisk(studentId);
    res.status(200).json({
      success: true,
      data: riskProfile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to evaluate student risk profile',
    });
  }
};

export const getTeacherRiskAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const teacherId = user?.id;

    if (!teacherId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user?.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'Only teachers can access class risk analytics' });
      return;
    }

    const riskAnalytics = await evaluateTeacherClassRisk(teacherId);
    res.status(200).json({
      success: true,
      data: riskAnalytics,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to evaluate teacher class risk analytics',
    });
  }
};

export const getParentStudentRiskSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const parentId = user?.id;
    const { studentId } = req.params;

    if (!parentId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user?.role !== 'parent') {
      res.status(403).json({ success: false, message: 'Only parents can access student risk summary' });
      return;
    }

    if (!studentId) {
      res.status(400).json({ success: false, message: 'Student ID is required' });
      return;
    }

    const riskSummary = await evaluateParentStudentRisk(parentId, studentId);
    res.status(200).json({
      success: true,
      data: riskSummary,
    });
  } catch (error: any) {
    if (error?.message?.includes('Unauthorized')) {
      res.status(403).json({ success: false, message: 'You are not linked to this student' });
      return;
    }
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to evaluate parent student risk summary',
    });
  }
};
