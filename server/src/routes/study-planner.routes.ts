import { Router } from 'express';
import {
  completeTaskController,
  generatePlannerController,
  getPlannerSummaryController,
  getTodayPlannerController,
  getWeekPlannerController,
  refreshPlannerController,
} from '../controllers/study-planner.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('student'));

router.get('/today', getTodayPlannerController);
router.get('/week', getWeekPlannerController);
router.post('/generate', generatePlannerController);
router.post('/refresh', refreshPlannerController);
router.patch('/tasks/:taskId/complete', completeTaskController);
router.get('/summary', getPlannerSummaryController);

export default router;
