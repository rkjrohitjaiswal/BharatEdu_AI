import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  getTodayLearningCoach,
  refreshTodayLearningCoach,
} from '../controllers/learning-coach.controller.js';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('student'));

router.get('/today', getTodayLearningCoach);
router.post('/refresh', refreshTodayLearningCoach);

export default router;
