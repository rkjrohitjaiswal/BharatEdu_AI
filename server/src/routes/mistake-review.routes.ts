import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  getStudentMistakes,
  getMistakeDetails,
} from '../controllers/mistake-review.controller.js';

const router = Router();

// Protect all mistake-review routes for authenticated student role
router.use(authenticateJWT);
router.use(requireRole('student'));

router.get('/mistakes', getStudentMistakes);
router.get('/mistakes/:attemptId', getMistakeDetails);

export default router;
