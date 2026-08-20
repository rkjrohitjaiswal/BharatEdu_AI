import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dataRepository } from '../repositories/data.repository.js';
import { LearningResourceService } from '../ai/resource-recommendation/service.js';
import { STARTER_RESOURCE_CATALOG } from '../ai/resource-recommendation/catalog.js';

export const getRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const recs = await LearningResourceService.getRecommendations(studentId);
    res.status(200).json({ success: true, data: recs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch recommendations' });
  }
};

export const getRecommendationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { id } = req.params;
    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const rec = await LearningResourceService.getRecommendation(studentId, id);
    if (!rec) {
      res.status(404).json({ success: false, message: 'Recommendation not found' });
      return;
    }

    res.status(200).json({ success: true, data: rec });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch recommendation' });
  }
};

export const refreshRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const recs = await LearningResourceService.refreshRecommendations(studentId);
    res.status(200).json({ success: true, data: recs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to refresh recommendations' });
  }
};

export const dismissRecommendation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { id } = req.params;
    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const dismissed = await LearningResourceService.dismissRecommendation(studentId, id);
    res.status(200).json({ success: true, data: { dismissed } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to dismiss recommendation' });
  }
};

export const getAllResources = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const dbResources = (await dataRepository.getLearningResources()) || [];
    const combined = [...STARTER_RESOURCE_CATALOG, ...dbResources];
    res.status(200).json({ success: true, data: combined });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch resources' });
  }
};

export const getResourceById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { resourceId } = req.params;
    const resource = await LearningResourceService.getResourceDetails(resourceId);
    if (!resource) {
      res.status(404).json({ success: false, message: 'Resource not found' });
      return;
    }

    res.status(200).json({ success: true, data: resource });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch resource details' });
  }
};

export const recordInteraction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { resourceId } = req.params;
    const { interactionType, progressPercent, durationSeconds } = req.body;

    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const interaction = await LearningResourceService.recordInteraction(
      studentId,
      resourceId,
      interactionType,
      progressPercent,
      durationSeconds
    );

    res.status(201).json({ success: true, data: interaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to record interaction' });
  }
};

export const getBookmarks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const bookmarks = await LearningResourceService.getBookmarks(studentId);
    res.status(200).json({ success: true, data: bookmarks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch bookmarks' });
  }
};

export const bookmarkResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { resourceId } = req.params;
    const { note } = req.body;

    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const bookmark = await LearningResourceService.bookmarkResource(studentId, resourceId, note);
    res.status(201).json({ success: true, data: bookmark });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to bookmark resource' });
  }
};

export const removeBookmark = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { resourceId } = req.params;

    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const removed = await LearningResourceService.removeBookmark(studentId, resourceId);
    res.status(200).json({ success: true, data: { removed } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to remove bookmark' });
  }
};

export const getHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const history = await LearningResourceService.getHistory(studentId);
    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch resource history' });
  }
};

export const getTeacherStudentSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const summary = await LearningResourceService.getTeacherResourceSummary(studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch teacher summary' });
  }
};

export const getParentStudentSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parentId = req.user?.id;
    const { studentId } = req.params;

    if (!parentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const isLinked = await dataRepository.checkParentStudentLinkActive(parentId, studentId);

    if (!isLinked) {
      res.status(403).json({ success: false, message: 'Access denied. Parent is not linked to this student.' });
      return;
    }

    const summary = await LearningResourceService.getParentResourceSummary(studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch parent summary' });
  }
};
