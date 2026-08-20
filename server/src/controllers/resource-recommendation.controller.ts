import { Request, Response } from 'express';
import { ResourceRecommendationEngine } from '../ai/resource-recommendation/engine.js';
import { VERIFIED_RESOURCE_CATALOG } from '../ai/resource-recommendation/catalog.js';
import { ResourceAnalyticsEngine } from '../ai/resource-recommendation/analytics.js';
import { ResourceAICoach } from '../ai/resource-recommendation/ai-coach.js';
import { dataRepository } from '../repositories/data.repository.js';

export class ResourceRecommendationController {
  // --- STUDENT ENDPOINTS ---
  static async getRecommendedResources(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      if (!studentId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

      const recommendations = await ResourceRecommendationEngine.generateRecommendations(studentId);
      return res.status(200).json({ success: true, data: recommendations });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getTodayRecommendations(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      if (!studentId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

      const recs = await ResourceRecommendationEngine.generateRecommendations(studentId);
      return res.status(200).json({ success: true, data: recs.slice(0, 3) });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getExamResources(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      if (!studentId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

      const recs = await ResourceRecommendationEngine.generateRecommendations(studentId);
      const filtered = recs.filter((r) => r.examRelevance && r.examRelevance.length > 0);
      return res.status(200).json({ success: true, data: filtered });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getGapResources(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      if (!studentId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

      const recs = await ResourceRecommendationEngine.generateRecommendations(studentId);
      const filtered = recs.filter((r) => r.priority === 'critical' || r.priority === 'high');
      return res.status(200).json({ success: true, data: filtered });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getPrerequisiteResources(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      if (!studentId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

      const recs = await ResourceRecommendationEngine.generateRecommendations(studentId);
      const filtered = recs.filter((r) => r.resource?.prerequisites && r.resource.prerequisites.length > 0);
      return res.status(200).json({ success: true, data: filtered });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCareerResources(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      if (!studentId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

      const recs = await ResourceRecommendationEngine.generateRecommendations(studentId);
      const filtered = recs.filter((r) => r.careerRelevance && r.careerRelevance.length > 0);
      return res.status(200).json({ success: true, data: filtered });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getRevisionResources(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      if (!studentId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

      const recs = await ResourceRecommendationEngine.generateRecommendations(studentId);
      const filtered = recs.filter((r) => r.resource?.resourceType === 'reference' || r.resource?.resourceType === 'practice_set');
      return res.status(200).json({ success: true, data: filtered });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async searchResources(req: Request, res: Response) {
    try {
      const query = req.query || {};
      const results = await dataRepository.searchLearningResources(query);
      return res.status(200).json({ success: true, data: results });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getResourceById(req: Request, res: Response) {
    try {
      const { resourceId } = req.params;
      const resource = await dataRepository.getLearningResource(resourceId);
      if (!resource) {
        // Fallback to starter catalog
        const catRes = VERIFIED_RESOURCE_CATALOG.find((r) => r.resourceId === resourceId);
        if (catRes) return res.status(200).json({ success: true, data: catRes });
        return res.status(404).json({ success: false, message: 'Resource not found' });
      }
      return res.status(200).json({ success: true, data: resource });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async startResource(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      const { resourceId } = req.params;

      const interaction = await dataRepository.createResourceInteraction({
        studentId,
        resourceId,
        action: 'started',
        createdAt: new Date(),
      });
      return res.status(200).json({ success: true, data: interaction });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async completeResource(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      const { resourceId } = req.params;

      const interaction = await dataRepository.createResourceInteraction({
        studentId,
        resourceId,
        action: 'completed',
        durationSeconds: req.body?.durationSeconds || 900,
        completedAt: new Date(),
      });
      return res.status(200).json({ success: true, data: interaction });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async saveResource(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      const { resourceId } = req.params;

      const interaction = await dataRepository.createResourceInteraction({
        studentId,
        resourceId,
        action: 'saved',
        createdAt: new Date(),
      });
      return res.status(200).json({ success: true, data: interaction });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async dismissResource(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      const { resourceId } = req.params;

      const interaction = await dataRepository.createResourceInteraction({
        studentId,
        resourceId,
        action: 'skipped',
        createdAt: new Date(),
      });
      return res.status(200).json({ success: true, data: interaction });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async submitFeedback(req: Request, res: Response) {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId;
      const { resourceId } = req.params;
      const { feedbackType, comment } = req.body;

      const feedback = await dataRepository.createResourceFeedback({
        studentId,
        resourceId,
        feedbackType,
        comment,
        createdAt: new Date(),
      });
      return res.status(200).json({ success: true, data: feedback });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // --- TEACHER ENDPOINTS ---
  static async getClassResources(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const resources = await dataRepository.getLearningResources();
      return res.status(200).json({ success: true, data: resources.length > 0 ? resources : VERIFIED_RESOURCE_CATALOG });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getClassResourceAnalytics(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const allInteractions = await dataRepository.getAllResourceInteractions();
      const catalog = VERIFIED_RESOURCE_CATALOG;

      const analytics = catalog.map((resItem) => ResourceAnalyticsEngine.computeStats(resItem.resourceId, allInteractions));
      return res.status(200).json({ success: true, data: analytics });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // --- PARENT ENDPOINTS ---
  static async getParentChildResources(req: Request, res: Response) {
    try {
      const parentId = (req as any).user?.id || (req as any).user?.userId;
      const { studentId } = req.params;

      const recs = await ResourceRecommendationEngine.generateRecommendations(studentId);
      return res.status(200).json({ success: true, data: recs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
