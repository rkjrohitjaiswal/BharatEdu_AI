import { Request, Response } from 'express';
import { dataRepository } from '../repositories/data.repository.js';
import { ResourceRecommendationEngine } from '../ai/resource-recommendation/engine.js';
import { AIResourceCoach } from '../ai/resource-recommendation/ai-coach.js';
import { ResourceAnalyticsEngine } from '../ai/resource-recommendation/analytics.js';

export class ResourceRecommendationController {
  // --- STUDENT ENDPOINTS ---

  static async getStudentResources(req: Request, res: Response): Promise<void> {
    try {
      const { subject, topic, conceptId } = req.query;
      const resources = await dataRepository.getLearningResources({
        subject: subject as string,
        topic: topic as string,
        conceptId: conceptId as string,
      });

      res.status(200).json({ success: true, data: resources });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch resources' });
    }
  }

  static async getRecommendedResources(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const result = ResourceRecommendationEngine.getRecommendations({
        studentId,
        classLevel: 10,
        board: 'CBSE',
        subject: 'Mathematics',
        availableMinutes: 30,
        preferredLanguage: 'en',
      });

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch recommendations' });
    }
  }

  static async getResourceDetail(req: Request, res: Response): Promise<void> {
    try {
      const { resourceId } = req.params;
      const resource = await dataRepository.getLearningResource(resourceId);
      if (!resource) {
        res.status(404).json({ success: false, message: 'Resource not found' });
        return;
      }
      res.status(200).json({ success: true, data: resource });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch resource detail' });
    }
  }

  static async getResourceReason(req: Request, res: Response): Promise<void> {
    try {
      const { resourceId } = req.params;
      const resource = await dataRepository.getLearningResource(resourceId);
      const ranking = ResourceRecommendationEngine.getRecommendations({
        studentId: 'student_1',
        classLevel: 10,
        board: 'CBSE',
      });

      const rec = ranking.recommendations.find((r) => r.resource.resourceId === resourceId) || ranking.topRecommendation;
      const coach = AIResourceCoach.generateGuidance(rec);

      res.status(200).json({ success: true, data: { recommendation: rec, coach } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch recommendation reason' });
    }
  }

  static async startResource(req: Request, res: Response): Promise<void> {
    try {
      const { resourceId } = req.params;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';

      const interaction = await dataRepository.createResourceInteraction({
        interactionId: `int_${Date.now()}`,
        studentId,
        resourceId,
        interactionType: 'started',
        progressPercent: 5,
        timeSpentSeconds: 0,
      });

      res.status(200).json({ success: true, data: interaction });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to start resource' });
    }
  }

  static async updateResourceProgress(req: Request, res: Response): Promise<void> {
    try {
      const { resourceId } = req.params;
      const { progressPercent, timeSpentSeconds } = req.body;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';

      const interaction = await dataRepository.updateResourceProgress(studentId, resourceId, progressPercent, timeSpentSeconds);
      res.status(200).json({ success: true, data: interaction });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update progress' });
    }
  }

  static async completeResource(req: Request, res: Response): Promise<void> {
    try {
      const { resourceId } = req.params;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';

      const interaction = await dataRepository.completeResource(studentId, resourceId);
      res.status(200).json({ success: true, data: interaction });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to complete resource' });
    }
  }

  static async bookmarkResource(req: Request, res: Response): Promise<void> {
    try {
      const { resourceId } = req.params;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';

      const interaction = await dataRepository.bookmarkResource(studentId, resourceId);
      res.status(200).json({ success: true, data: interaction });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to bookmark resource' });
    }
  }

  static async rateResource(req: Request, res: Response): Promise<void> {
    try {
      const { resourceId } = req.params;
      const { rating, helpful, comment } = req.body;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';

      const feedback = await dataRepository.createResourceFeedback({
        feedbackId: `fb_${Date.now()}`,
        studentId,
        resourceId,
        rating,
        helpful,
        comment,
      });

      res.status(201).json({ success: true, data: feedback });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to rate resource' });
    }
  }

  static async getNextResource(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const ranking = ResourceRecommendationEngine.getRecommendations({
        studentId,
        classLevel: 10,
        board: 'CBSE',
      });

      res.status(200).json({ success: true, data: ranking.topRecommendation });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch next resource' });
    }
  }

  // --- TEACHER ENDPOINTS ---

  static async getTeacherResources(req: Request, res: Response): Promise<void> {
    try {
      const resources = await dataRepository.getLearningResources({});
      res.status(200).json({ success: true, data: resources });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch teacher resources' });
    }
  }

  static async getTeacherRecommendedResources(req: Request, res: Response): Promise<void> {
    try {
      const ranking = ResourceRecommendationEngine.getRecommendations({
        studentId: 'class_overview',
        classLevel: 10,
        board: 'CBSE',
      });
      res.status(200).json({ success: true, data: ranking });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch recommended resources' });
    }
  }

  static async recommendResourceToClass(req: Request, res: Response): Promise<void> {
    try {
      const { resourceId, classId } = req.body;
      res.status(200).json({ success: true, data: { resourceId, classId, status: 'recommended' } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to recommend resource' });
    }
  }

  static async getClassResourceAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const analytics = ResourceAnalyticsEngine.calculateAnalytics([
        { interactionType: 'completed', rating: 5 },
        { interactionType: 'started', rating: 4 },
      ]);
      res.status(200).json({ success: true, data: { classId, analytics } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch class resource analytics' });
    }
  }

  // --- PARENT ENDPOINTS ---

  static async getParentChildResources(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const parentId = (req as any).user?.id || (req as any).user?.userId;

      const isLinked = await dataRepository.verifyParentStudentLink(parentId, studentId);
      if (!isLinked && parentId) {
        res.status(403).json({ success: false, message: 'Unauthorized access to student resources' });
        return;
      }

      const ranking = ResourceRecommendationEngine.getRecommendations({
        studentId,
        classLevel: 10,
        board: 'CBSE',
      });
      res.status(200).json({ success: true, data: ranking });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch child resources' });
    }
  }

  static async getParentChildResourceProgress(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const parentId = (req as any).user?.id || (req as any).user?.userId;

      const isLinked = await dataRepository.verifyParentStudentLink(parentId, studentId);
      if (!isLinked && parentId) {
        res.status(403).json({ success: false, message: 'Unauthorized access to student resource progress' });
        return;
      }

      const interactions = await dataRepository.getResourceInteractions(studentId);
      const analytics = ResourceAnalyticsEngine.calculateAnalytics(interactions);

      res.status(200).json({ success: true, data: analytics });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch child resource progress' });
    }
  }
}
