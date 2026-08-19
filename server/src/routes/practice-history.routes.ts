import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  getPracticeHistory,
  getPracticeHistorySummary,
  getPracticeHistorySessionDetail,
} from '../controllers/practice-history.controller.js';

const router = Router();

// Protect all history routes for authenticated student role
router.use(authenticateJWT);
router.use(requireRole('student'));

router.get('/', getPracticeHistory);
router.get('/summary', getPracticeHistorySummary);
router.get('/:sessionId', getPracticeHistorySessionDetail);

export default router;
