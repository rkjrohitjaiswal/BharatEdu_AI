import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  handleComplete,
  handleDismiss,
  handleGetExplanation,
  handleGetHistory,
  handleGetNext,
  handleGetParentStudentSummary,
  handleGetRecommended,
  handleGetSummary,
  handleGetTeacherStudentSummary,
  handleGetToday,
  handleRefresh,
  handleStart,
} from '../controllers/resource-recommendation.controller.js';

const router = Router();

// Student Routes
router.get('/recommended', authenticateJWT, requireRole('student'), handleGetRecommended);
router.get('/today', authenticateJWT, requireRole('student'), handleGetToday);
router.get('/next', authenticateJWT, requireRole('student'), handleGetNext);
router.post('/refresh', authenticateJWT, requireRole('student'), handleRefresh);
router.get('/history', authenticateJWT, requireRole('student'), handleGetHistory);
router.get('/summary', authenticateJWT, requireRole('student'), handleGetSummary);

router.post('/:id/start', authenticateJWT, requireRole('student'), handleStart);
router.post('/:id/complete', authenticateJWT, requireRole('student'), handleComplete);
router.post('/:id/dismiss', authenticateJWT, requireRole('student'), handleDismiss);
router.get('/:id/explanation', authenticateJWT, requireRole('student'), handleGetExplanation);

// Teacher & Parent Summary Routes
router.get('/teacher/student/:studentId/summary', authenticateJWT, requireRole('teacher'), handleGetTeacherStudentSummary);
router.get('/parent/student/:studentId/summary', authenticateJWT, requireRole('parent'), handleGetParentStudentSummary);

export default router;
