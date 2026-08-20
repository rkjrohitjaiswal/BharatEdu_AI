import { Router } from 'express';
import {
  completeRevisionSessionController,
  generateRevisionController,
  getDueRevisionController,
  getOverdueRevisionController,
  getRevisionItemByIdController,
  getRevisionSummaryController,
  getTodayRevisionController,
  getWeeklyRevisionController,
  refreshRevisionController,
  startRevisionSessionController,
} from '../controllers/revision.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('student'));

router.get('/today', getTodayRevisionController);
router.get('/week', getWeeklyRevisionController);
router.get('/summary', getRevisionSummaryController);
router.get('/due', getDueRevisionController);
router.get('/overdue', getOverdueRevisionController);
router.get('/:id', getRevisionItemByIdController);
router.post('/generate', generateRevisionController);
router.post('/refresh', refreshRevisionController);
router.post('/:id/start', startRevisionSessionController);
router.post('/:id/complete', completeRevisionSessionController);

export default router;
