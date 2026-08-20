import { Router } from 'express';
import {
  completeResourceController,
  getParentStudentResourceSummaryController,
  getRecommendedResourcesController,
  getResourceDetailsController,
  getStudentResourceHistoryController,
  getTeacherStudentResourceSummaryController,
  refreshRecommendationsController,
  searchResourcesController,
  startResourceController,
  updateResourceProgressController,
} from '../controllers/resource-recommendation.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);

// Student endpoints
router.get('/recommended', requireRole('student'), getRecommendedResourcesController);
router.get('/history', requireRole('student'), getStudentResourceHistoryController);
router.post('/refresh', requireRole('student'), refreshRecommendationsController);
router.get('/', searchResourcesController);
router.get('/:id', getResourceDetailsController);
router.post('/:id/start', requireRole('student'), startResourceController);
router.put('/:id/progress', requireRole('student'), updateResourceProgressController);
router.post('/:id/complete', requireRole('student'), completeResourceController);

// Teacher analytics endpoint
router.get('/teacher/student/:studentId/summary', requireRole('teacher'), getTeacherStudentResourceSummaryController);

// Parent progress endpoint
router.get('/parent/student/:studentId/summary', requireRole('parent'), getParentStudentResourceSummaryController);

export default router;
