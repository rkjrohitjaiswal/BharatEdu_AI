import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  getExamReadiness,
  generateExamPlan,
  getExamPlan,
  updateExamPlanTask,
  createMockExam,
} from '../controllers/exam-preparation.controller.js';

const router = Router();

router.use(authenticateJWT, requireRole('student'));

router.post('/', createExam);
router.get('/', getExams);
router.get('/:id', getExamById);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);
router.get('/:id/readiness', getExamReadiness);
router.post('/:id/generate-plan', generateExamPlan);
router.get('/:id/plan', getExamPlan);
router.put('/:id/plan/tasks/:taskId', updateExamPlanTask);
router.post('/:id/mock', createMockExam);

export default router;
