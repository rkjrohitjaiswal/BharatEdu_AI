import { Request, Response } from 'express';
import {
  generateAdviceForParent,
  getAuthoritativeStudentSnapshotForParent,
  getLinkedStudentsForParentUser,
  getWeeklyPlanForParent,
} from '../ai/parent-copilot/service.js';

export const getParentCopilotStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'parent') {
      res.status(403).json({ success: false, message: 'Only parents can access Parent Copilot' });
      return;
    }

    const students = await getLinkedStudentsForParentUser(user.id);
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to retrieve linked parent students',
    });
  }
};

export const getParentCopilotStudentSnapshot = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'parent') {
      res.status(403).json({ success: false, message: 'Only parents can access Parent Copilot' });
      return;
    }

    if (!studentId) {
      res.status(400).json({ success: false, message: 'Student ID is required' });
      return;
    }

    const snapshot = await getAuthoritativeStudentSnapshotForParent(user.id, studentId);
    res.status(200).json({
      success: true,
      data: snapshot,
    });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED_PARENT_STUDENT_ACCESS') {
      res.status(403).json({ success: false, message: 'You are not linked to this student' });
      return;
    }
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to retrieve parent student snapshot',
    });
  }
};

export const getParentCopilotAdvice = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'parent') {
      res.status(403).json({ success: false, message: 'Only parents can access Parent Copilot' });
      return;
    }

    if (!studentId) {
      res.status(400).json({ success: false, message: 'Student ID is required' });
      return;
    }

    const advice = await generateAdviceForParent(user.id, studentId);
    res.status(200).json({
      success: true,
      data: advice,
    });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED_PARENT_STUDENT_ACCESS') {
      res.status(403).json({ success: false, message: 'You are not linked to this student' });
      return;
    }
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to generate parent advice',
    });
  }
};

export const getParentCopilotWeeklyPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'parent') {
      res.status(403).json({ success: false, message: 'Only parents can access Parent Copilot' });
      return;
    }

    if (!studentId) {
      res.status(400).json({ success: false, message: 'Student ID is required' });
      return;
    }

    const plan = await getWeeklyPlanForParent(user.id, studentId);
    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED_PARENT_STUDENT_ACCESS') {
      res.status(403).json({ success: false, message: 'You are not linked to this student' });
      return;
    }
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to retrieve weekly parent support plan',
    });
  }
};
