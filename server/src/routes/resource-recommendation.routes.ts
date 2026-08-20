import { Router } from 'express';
import {
  generateRecommendationsController,
  getAllResourcesController,
  getRecommendationSummaryController,
  getRecommendedResourcesController,
  getResourceByIdController,
  refreshRecommendationsController,
  updateRecommendationStatusController,
} from '../controllers/resource-recommendation.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('student'));

router.get('/', getAllResourcesController);
router.get('/recommended', getRecommendedResourcesController);
router.get('/summary', getRecommendationSummaryController);
router.get('/:id', getResourceByIdController);
router.post('/generate', generateRecommendationsController);
router.post('/refresh', refreshRecommendationsController);
router.patch('/recommendations/:id/status', updateRecommendationStatusController);

export default router;
