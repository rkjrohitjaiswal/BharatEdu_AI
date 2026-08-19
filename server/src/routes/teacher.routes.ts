import { Router } from 'express';
import { getTeacherProfile } from '../controllers/profile.controller.js';
import {
  getTeacherClasses,
  getTeacherStudents,
  getTeacherAnalyticsOverview,
} from '../controllers/teacher-data.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// All routes require teacher authentication
router.use(authenticateJWT, requireRole('teacher'));

router.get('/profile', getTeacherProfile);
router.get('/classes', getTeacherClasses);
router.get('/students', getTeacherStudents);
router.get('/analytics/overview', getTeacherAnalyticsOverview);

export default router;
