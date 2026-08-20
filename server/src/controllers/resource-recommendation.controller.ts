import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  completeResourceRecommendation,
  dismissResourceRecommendation,
  getNextResource,
  getParentStudentResourceSummary,
  getRecommendedResources,
  getResourceExplanation,
  getResourceHistory,
  getResourceSummary,
  getTeacherStudentResourceSummary,
  getTodayResources,
  refreshResourceRecommendations,
  startResourceRecommendation,
} from '../ai/resource-recommendation/service.js';

export const handleGetRecommended = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const recs = await getRecommendedResources(studentId);
    res.status(200).json({ success: true, data: recs });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch recommended resources' });
  }
};

export const handleGetToday = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const recs = await getTodayResources(studentId);
    res.status(200).json({ success: true, data: recs });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch today recommendations' });
  }
};

export const handleGetNext = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const nextRec = await getNextResource(studentId);
    res.status(200).json({ success: true, data: nextRec });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch next resource' });
  }
};

export const handleRefresh = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const recs = await refreshResourceRecommendations(studentId);
    res.status(200).json({ success: true, data: recs });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to refresh recommendations' });
  }
};

export const handleStart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const rec = await startResourceRecommendation(studentId, req.params.id);
    res.status(200).json({ success: true, data: rec });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to start resource recommendation' });
  }
};

export const handleComplete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const rec = await completeResourceRecommendation(studentId, req.params.id);
    res.status(200).json({ success: true, data: rec });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to complete resource recommendation' });
  }
};

export const handleDismiss = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const rec = await dismissResourceRecommendation(studentId, req.params.id);
    res.status(200).json({ success: true, data: rec });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to dismiss resource recommendation' });
  }
};

export const handleGetHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const history = await getResourceHistory(studentId);
    res.status(200).json({ success: true, data: history });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch recommendation history' });
  }
};

export const handleGetSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const summary = await getResourceSummary(studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch resource summary' });
  }
};

export const handleGetExplanation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const explanation = await getResourceExplanation(studentId, req.params.id);
    res.status(200).json({ success: true, data: explanation });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch resource explanation' });
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
    const summary = await getTeacherStudentResourceSummary(teacherId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch teacher student resource summary' });
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
    const summary = await getParentStudentResourceSummary(parentId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Access denied' });
  }
};
