import { Router } from 'express';
import {
  getStudentAnalyticsAdvice,
  getStudentAnalyticsOverview,
  getStudentAnalyticsPractice,
  getStudentAnalyticsSubjects,
  getStudentAnalyticsSummary,
  getStudentAnalyticsTopics,
  getStudentAnalyticsWeekly,
} from '../controllers/learning-analytics.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('student'));

router.get('/overview', getStudentAnalyticsOverview);
router.get('/subjects', getStudentAnalyticsSubjects);
router.get('/topics', getStudentAnalyticsTopics);
router.get('/practice', getStudentAnalyticsPractice);
router.get('/weekly', getStudentAnalyticsWeekly);
router.get('/advice', getStudentAnalyticsAdvice);
router.get('/summary', getStudentAnalyticsSummary);

export default router;
