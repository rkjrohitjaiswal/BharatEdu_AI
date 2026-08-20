import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  createDoubtSession,
  deleteDoubtSession,
  getDoubtMessages,
  getDoubtRecommendations,
  getDoubtSessionById,
  getDoubtSessions,
  getParentStudentDoubtSummary,
  getSocraticHint,
  getStudentDoubtContext,
  getTeacherStudentDoubtSummary,
  sendDoubtMessage,
  solveDoubtSession,
  submitDoubtFeedback,
} from '../ai/doubt-solver/service.js';

export const handleCreateSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const session = await createDoubtSession(studentId, req.body);
    res.status(201).json({ success: true, data: session });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create doubt session' });
  }
};

export const handleGetSessions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const sessions = await getDoubtSessions(studentId);
    res.status(200).json({ success: true, data: sessions });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch doubt sessions' });
  }
};

export const handleGetSessionById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const session = await getDoubtSessionById(studentId, req.params.id);
    if (!session) {
      res.status(404).json({ error: 'Doubt session not found' });
      return;
    }

    res.status(200).json({ success: true, data: session });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch doubt session details' });
  }
};

export const handleDeleteSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const deleted = await deleteDoubtSession(studentId, req.params.id);
    res.status(200).json({ success: true, data: { deleted } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete doubt session' });
  }
};

export const handleSendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    const message = await sendDoubtMessage(studentId, req.params.id, content);
    res.status(201).json({ success: true, data: message });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to send doubt message' });
  }
};

export const handleGetMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const messages = await getDoubtMessages(studentId, req.params.id);
    res.status(200).json({ success: true, data: messages });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch doubt messages' });
  }
};

export const handleSolveSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { question } = req.body;
    if (!question) {
      res.status(400).json({ error: 'Question text is required' });
      return;
    }

    const solution = await solveDoubtSession(studentId, req.params.id, question);
    res.status(200).json({ success: true, data: solution });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to solve doubt' });
  }
};

export const handleSocraticMode = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { hintLevel, question } = req.body;
    const hint = await getSocraticHint(studentId, req.params.id, Number(hintLevel || 0), question || '');
    res.status(200).json({ success: true, data: hint });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch Socratic hint' });
  }
};

export const handleFeedback = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { isHelpful } = req.body;
    const result = await submitDoubtFeedback(studentId, req.params.id, Boolean(isHelpful));
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit doubt feedback' });
  }
};

export const handleGetContext = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const context = await getStudentDoubtContext(studentId, (req.query.sessionId as string) || 'default');
    res.status(200).json({ success: true, data: context });
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

    const recs = await getDoubtRecommendations(studentId);
    res.status(200).json({ success: true, data: recs });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch doubt recommendations' });
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
