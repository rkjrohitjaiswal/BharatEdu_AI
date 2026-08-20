import { Router } from 'express';
import { ResourceRecommendationController } from '../controllers/resource-recommendation.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Student Routes
router.get('/student/resources', authenticateJWT, requireRole('student'), ResourceRecommendationController.getStudentResources);
router.get(
  '/student/resources/recommended',
  authenticateJWT,
  requireRole('student'),
  ResourceRecommendationController.getRecommendedResources
);
router.get('/student/resources/next', authenticateJWT, requireRole('student'), ResourceRecommendationController.getNextResource);
router.get('/student/resources/:resourceId', authenticateJWT, requireRole('student'), ResourceRecommendationController.getResourceDetail);
router.get(
  '/student/resources/:resourceId/reason',
  authenticateJWT,
  requireRole('student'),
  ResourceRecommendationController.getResourceReason
);
router.post(
  '/student/resources/:resourceId/start',
  authenticateJWT,
  requireRole('student'),
  ResourceRecommendationController.startResource
);
router.post(
  '/student/resources/:resourceId/progress',
  authenticateJWT,
  requireRole('student'),
  ResourceRecommendationController.updateResourceProgress
);
router.post(
  '/student/resources/:resourceId/complete',
  authenticateJWT,
  requireRole('student'),
  ResourceRecommendationController.completeResource
);
router.post(
  '/student/resources/:resourceId/bookmark',
  authenticateJWT,
  requireRole('student'),
  ResourceRecommendationController.bookmarkResource
);
router.post(
  '/student/resources/:resourceId/rating',
  authenticateJWT,
  requireRole('student'),
  ResourceRecommendationController.rateResource
);

// Teacher Routes
router.get('/teacher/resources', authenticateJWT, requireRole('teacher'), ResourceRecommendationController.getTeacherResources);
router.get(
  '/teacher/resources/recommended',
  authenticateJWT,
  requireRole('teacher'),
  ResourceRecommendationController.getTeacherRecommendedResources
);
router.post(
  '/teacher/resources/recommend',
  authenticateJWT,
  requireRole('teacher'),
  ResourceRecommendationController.recommendResourceToClass
);
router.get(
  '/teacher/resources/class/:classId/analytics',
  authenticateJWT,
  requireRole('teacher'),
  ResourceRecommendationController.getClassResourceAnalytics
);

// Parent Routes
router.get(
  '/parent/resources/student/:studentId',
  authenticateJWT,
  requireRole('parent'),
  ResourceRecommendationController.getParentChildResources
);
router.get(
  '/parent/resources/student/:studentId/progress',
  authenticateJWT,
  requireRole('parent'),
  ResourceRecommendationController.getParentChildResourceProgress
);

export const studentResourceRouter = router;
export const teacherResourceRouter = router;
export const parentResourceRouter = router;
export default router;
