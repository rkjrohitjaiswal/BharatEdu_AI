import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  addDoubtToRevision,
  getDoubtContext,
  getDoubtRecommendations,
  getParentStudentDoubtSummary,
  getStudentDoubtById,
  getStudentDoubts,
  getTeacherStudentDoubtSummary,
  practiceDoubtConcept,
  solveStudentDoubt,
  submitDoubtFeedback,
  submitDoubtFollowup,
} from '../ai/doubt-solver/service.js';

export const handleGetDoubts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const list = await getStudentDoubts(studentId);
    res.status(200).json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch student doubts' });
  }
};

export const handleGetDoubtById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const item = await getStudentDoubtById(studentId, req.params.doubtId);
    res.status(200).json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch doubt details' });
  }
};

export const handleSolveDoubt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { question, subject, sourceContext, sourceId, level, language } = req.body;
    if (!question) {
      res.status(400).json({ error: 'Question text is required' });
      return;
    }

    const result = await solveStudentDoubt(studentId, question, subject, sourceContext, sourceId, level, language);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to solve doubt' });
  }
};

export const handleFollowupDoubt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { question, level, language } = req.body;
    if (!question) {
      res.status(400).json({ error: 'Follow-up question is required' });
      return;
    }

    const followup = await submitDoubtFollowup(studentId, req.params.doubtId, question, level, language);
    res.status(201).json({ success: true, data: followup });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process doubt follow-up' });
  }
};

export const handleFeedbackDoubt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { responseId, helpful, feedbackType, comment } = req.body;
    const fb = await submitDoubtFeedback(studentId, req.params.doubtId, responseId, helpful, feedbackType, comment);
    res.status(200).json({ success: true, data: fb });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to record feedback' });
  }
};

export const handleGetContext = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const ctx = await getDoubtContext(studentId, req.params.doubtId);
    res.status(200).json({ success: true, data: ctx });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch doubt context' });
  }
};

export const handleGetRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const recs = await getDoubtRecommendations(studentId, req.params.doubtId);
    res.status(200).json({ success: true, data: recs });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch doubt recommendations' });
  }
};

export const handleAddRevision = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await addDoubtToRevision(studentId, req.params.doubtId);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add doubt to revision' });
  }
};

export const handlePractice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await practiceDoubtConcept(studentId, req.params.doubtId);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate concept practice' });
  }
};

export const handleGetTeacherStudentSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { studentId } = req.params;
    const summary = await getTeacherStudentDoubtSummary(teacherId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch teacher student doubt summary' });
  }
};

export const handleGetParentStudentSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parentId = req.user?.id;
    if (!parentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { studentId } = req.params;
    const summary = await getParentStudentDoubtSummary(parentId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Access denied' });
  }
};
