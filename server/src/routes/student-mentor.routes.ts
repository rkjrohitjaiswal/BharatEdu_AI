import { Router } from 'express';
import {
  getStudentMentorAdviceHandler,
  getStudentMentorPlan,
  getStudentMentorSummaryHandler,
  getStudentMentorToday,
} from '../controllers/student-mentor.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('student'));

router.get('/today', getStudentMentorToday);
router.get('/plan', getStudentMentorPlan);
router.get('/advice', getStudentMentorAdviceHandler);
router.get('/summary', getStudentMentorSummaryHandler);

export default router;
