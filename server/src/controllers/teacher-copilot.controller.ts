import { Request, Response } from 'express';
import {
  generateAdviceForTeacher,
  generateParentMessageDraftForTeacher,
  getAuthoritativeStudentSnapshotForTeacher,
  getAuthorizedTeacherStudents,
} from '../ai/teacher-copilot/service.js';

export const getTeacherCopilotStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'Only teachers can access Teacher Copilot' });
      return;
    }

    const students = await getAuthorizedTeacherStudents(user.id);
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to retrieve authorized teacher students',
    });
  }
};

export const getTeacherCopilotStudentSnapshot = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'Only teachers can access Teacher Copilot' });
      return;
    }

    if (!studentId) {
      res.status(400).json({ success: false, message: 'Student ID is required' });
      return;
    }

    const snapshot = await getAuthoritativeStudentSnapshotForTeacher(user.id, studentId);
    res.status(200).json({
      success: true,
      data: snapshot,
    });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED_TEACHER_STUDENT_ACCESS') {
      res.status(403).json({ success: false, message: 'You are not authorized to view this student' });
      return;
    }
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to retrieve student intelligence snapshot',
    });
  }
};

export const getTeacherCopilotAdvice = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'Only teachers can access Teacher Copilot' });
      return;
    }

    if (!studentId) {
      res.status(400).json({ success: false, message: 'Student ID is required' });
      return;
    }

    const advice = await generateAdviceForTeacher(user.id, studentId);
    res.status(200).json({
      success: true,
      data: advice,
    });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED_TEACHER_STUDENT_ACCESS') {
      res.status(403).json({ success: false, message: 'You are not authorized to view this student' });
      return;
    }
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to generate teacher advice',
    });
  }
};

export const getTeacherCopilotParentMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (user.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'Only teachers can access Teacher Copilot' });
      return;
    }

    if (!studentId) {
      res.status(400).json({ success: false, message: 'Student ID is required' });
      return;
    }

    const draft = await generateParentMessageDraftForTeacher(user.id, studentId);
    res.status(200).json({
      success: true,
      data: draft,
    });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED_TEACHER_STUDENT_ACCESS') {
      res.status(403).json({ success: false, message: 'You are not authorized to view this student' });
      return;
    }
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to generate parent message draft',
    });
  }
};
