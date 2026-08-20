import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { ResourceRecommendationController } from '../controllers/resource-recommendation.controller.js';

export const studentResourceRouter = Router();
export const teacherResourceRouter = Router();
export const parentResourceRouter = Router();

// --- STUDENT RESOURCE ROUTES ---
studentResourceRouter.use(authenticateJWT, requireRole('student'));

studentResourceRouter.get('/recommended', ResourceRecommendationController.getRecommendedResources);
studentResourceRouter.get('/today', ResourceRecommendationController.getTodayRecommendations);
studentResourceRouter.get('/exam', ResourceRecommendationController.getExamResources);
studentResourceRouter.get('/gaps', ResourceRecommendationController.getGapResources);
studentResourceRouter.get('/prerequisites', ResourceRecommendationController.getPrerequisiteResources);
studentResourceRouter.get('/career', ResourceRecommendationController.getCareerResources);
studentResourceRouter.get('/revision', ResourceRecommendationController.getRevisionResources);
studentResourceRouter.get('/search', ResourceRecommendationController.searchResources);

studentResourceRouter.get('/:resourceId', ResourceRecommendationController.getResourceById);
studentResourceRouter.post('/:resourceId/start', ResourceRecommendationController.startResource);
studentResourceRouter.post('/:resourceId/complete', ResourceRecommendationController.completeResource);
studentResourceRouter.post('/:resourceId/save', ResourceRecommendationController.saveResource);
studentResourceRouter.post('/:resourceId/dismiss', ResourceRecommendationController.dismissResource);
studentResourceRouter.post('/:resourceId/feedback', ResourceRecommendationController.submitFeedback);

// --- TEACHER RESOURCE ROUTES ---
teacherResourceRouter.use(authenticateJWT, requireRole('teacher'));

teacherResourceRouter.get('/class/:classId', ResourceRecommendationController.getClassResources);
teacherResourceRouter.get('/class/:classId/analytics', ResourceRecommendationController.getClassResourceAnalytics);

// --- PARENT RESOURCE ROUTES ---
parentResourceRouter.use(authenticateJWT, requireRole('parent'));

parentResourceRouter.get('/student/:studentId', ResourceRecommendationController.getParentChildResources);
