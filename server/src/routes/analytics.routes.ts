import { Router } from 'express';
import { getParentStudentAnalytics, getStudentAnalytics, getTeacherAnalytics } from '../controllers/analytics.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);

router.get('/student', requireRole('student'), getStudentAnalytics);
router.get('/teacher', requireRole('teacher'), getTeacherAnalytics);
router.get('/parent/:studentId', requireRole('parent'), getParentStudentAnalytics);

export default router;
