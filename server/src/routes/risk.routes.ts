import { Router } from 'express';
import { getParentStudentRiskSummary, getStudentRiskProfile, getTeacherRiskAnalytics } from '../controllers/risk.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);

router.get('/student', requireRole('student'), getStudentRiskProfile);
router.get('/teacher', requireRole('teacher'), getTeacherRiskAnalytics);
router.get('/parent/:studentId', requireRole('parent'), getParentStudentRiskSummary);

export default router;
