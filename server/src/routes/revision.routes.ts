import { Router } from 'express';
import {
  completeRevisionOutcomeController,
  getDailyRevisionQueueController,
  getParentStudentRevisionSummaryController,
  getRevisionScheduleController,
  getTeacherStudentRevisionSummaryController,
  refreshStudentRevisionQueueController,
  startRevisionSessionController,
} from '../controllers/revision.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);

// Student endpoints
router.get('/today', requireRole('student'), getDailyRevisionQueueController);
router.get('/schedule', requireRole('student'), getRevisionScheduleController);
router.post('/refresh', requireRole('student'), refreshStudentRevisionQueueController);
router.post('/:id/start', requireRole('student'), startRevisionSessionController);
router.post('/:id/complete', requireRole('student'), completeRevisionOutcomeController);

// Teacher analytics summary
router.get('/teacher/student/:studentId/summary', requireRole('teacher'), getTeacherStudentRevisionSummaryController);

// Parent progress summary
router.get('/parent/student/:studentId/summary', requireRole('parent'), getParentStudentRevisionSummaryController);

export default router;
