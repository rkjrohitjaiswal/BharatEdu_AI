import { Request, Response } from 'express';
import {
  completeResource,
  getParentStudentResourceSummary,
  getRecommendedResources,
  getResourceDetails,
  getStudentResourceHistory,
  getTeacherStudentResourceSummary,
  searchResources,
  startResource,
  updateResourceProgress,
} from '../ai/resource-recommendations/service.js';

export const getRecommendedResourcesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const data = await getRecommendedResources(user.id);
    res.status(200).json({ success: true, data: data.recommendations, aiExplanation: data.aiExplanation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch recommendations' });
  }
};

export const searchResourcesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, subject, topic, type } = req.query;
    const resources = await searchResources(
      query ? String(query) : undefined,
      subject ? String(subject) : undefined,
      topic ? String(topic) : undefined,
      type ? String(type) : undefined
    );
    res.status(200).json({ success: true, data: resources });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to search resources' });
  }
};

export const getResourceDetailsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const resource = await getResourceDetails(id);
    if (!resource) {
      res.status(404).json({ success: false, message: 'Resource not found' });
      return;
    }
    res.status(200).json({ success: true, data: resource });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch resource details' });
  }
};

export const startResourceController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const result = await startResource(user.id, id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to start resource' });
  }
};

export const updateResourceProgressController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { progressPercent = 50 } = req.body;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const result = await updateResourceProgress(user.id, id, Number(progressPercent));
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to update resource progress' });
  }
};

export const completeResourceController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const result = await completeResource(user.id, id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to complete resource' });
  }
};

export const getStudentResourceHistoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const history = await getStudentResourceHistory(user.id);
    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch resource history' });
  }
};

export const refreshRecommendationsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const data = await getRecommendedResources(user.id);
    res.status(200).json({ success: true, data: data.recommendations, aiExplanation: data.aiExplanation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to refresh recommendations' });
  }
};

export const getTeacherStudentResourceSummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'Only teachers can access student resource analytics' });
      return;
    }

    const summary = await getTeacherStudentResourceSummary(user.id, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch teacher resource summary' });
  }
};

export const getParentStudentResourceSummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'parent') {
      res.status(403).json({ success: false, message: 'Only parents can access student resource analytics' });
      return;
    }

    const summary = await getParentStudentResourceSummary(user.id, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error?.message || 'Access denied for parent resource summary' });
  }
};
