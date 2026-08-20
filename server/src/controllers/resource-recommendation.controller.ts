import { Request, Response } from 'express';
import {
  changeRecommendationStatus,
  generateRecommendations,
  getAllCatalogResources,
  getRecommendationSummary,
  getRecommendedResources,
  getResourceById,
  refreshRecommendations,
} from '../ai/resource-recommendations/service.js';

export const getAllResourcesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access learning resources' });
      return;
    }

    const resources = await getAllCatalogResources();
    res.status(200).json({ success: true, data: resources });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch learning resources' });
  }
};

export const getRecommendedResourcesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access recommended resources' });
      return;
    }

    const recommendations = await getRecommendedResources(user.id);
    res.status(200).json({ success: true, data: recommendations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch resource recommendations' });
  }
};

export const getResourceByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access resource details' });
      return;
    }

    const resource = await getResourceById(id);
    if (!resource) {
      res.status(404).json({ success: false, message: 'Resource not found' });
      return;
    }

    res.status(200).json({ success: true, data: resource });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch resource details' });
  }
};

export const generateRecommendationsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can generate resource recommendations' });
      return;
    }

    const recommendations = await generateRecommendations(user.id);
    res.status(200).json({ success: true, data: recommendations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to generate recommendations' });
  }
};

export const refreshRecommendationsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can refresh recommendations' });
      return;
    }

    const recommendations = await refreshRecommendations(user.id);
    res.status(200).json({ success: true, data: recommendations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to refresh recommendations' });
  }
};

export const updateRecommendationStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { status } = req.body;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can update recommendation status' });
      return;
    }
    if (!id || !status) {
      res.status(400).json({ success: false, message: 'Recommendation ID and status are required' });
      return;
    }

    const updated = await changeRecommendationStatus(user.id, id, status);
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to update recommendation status' });
  }
};

export const getRecommendationSummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student') {
      res.status(403).json({ success: false, message: 'Only students can access recommendation summary' });
      return;
    }

    const summary = await getRecommendationSummary(user.id);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch recommendation summary' });
  }
};
