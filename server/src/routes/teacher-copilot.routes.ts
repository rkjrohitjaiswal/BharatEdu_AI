import { Router } from 'express';
import {
  getTeacherCopilotAdvice,
  getTeacherCopilotParentMessage,
  getTeacherCopilotStudents,
  getTeacherCopilotStudentSnapshot,
} from '../controllers/teacher-copilot.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('teacher'));

router.get('/students', getTeacherCopilotStudents);
router.get('/student/:studentId', getTeacherCopilotStudentSnapshot);
router.post('/student/:studentId/advice', getTeacherCopilotAdvice);
router.post('/student/:studentId/parent-message', getTeacherCopilotParentMessage);

export default router;
