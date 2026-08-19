import { Router } from 'express';
import {
  getParentCopilotAdvice,
  getParentCopilotStudents,
  getParentCopilotStudentSnapshot,
  getParentCopilotWeeklyPlan,
} from '../controllers/parent-copilot.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('parent'));

router.get('/students', getParentCopilotStudents);
router.get('/student/:studentId', getParentCopilotStudentSnapshot);
router.post('/student/:studentId/advice', getParentCopilotAdvice);
router.get('/student/:studentId/weekly-plan', getParentCopilotWeeklyPlan);

export default router;
