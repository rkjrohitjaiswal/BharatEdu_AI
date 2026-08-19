import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  generateStudyPlan,
  getCurrentStudyPlan,
  updateTaskStatus,
} from '../controllers/study-plan.controller.js';

const router = Router();

// Protect all study-plan routes for authenticated student role
router.use(authenticateJWT);
router.use(requireRole('student'));

router.post('/generate', generateStudyPlan);
router.get('/current', getCurrentStudyPlan);
router.put('/tasks/:taskId', updateTaskStatus);

export default router;
