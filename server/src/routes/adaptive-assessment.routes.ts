import { Router } from 'express';
import {
  completeAssessmentController,
  createAssessmentController,
  getAssessmentSummaryController,
  getNextQuestionController,
  getParentStudentAssessmentSummaryController,
  getRecommendedQuestionsController,
  getStudentAssessmentsController,
  getTeacherStudentAssessmentSummaryController,
  submitAnswerController,
} from '../controllers/adaptive-assessment.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);

// Student endpoints
router.post('/', requireRole('student'), createAssessmentController);
router.get('/', requireRole('student'), getStudentAssessmentsController);
router.get('/questions/recommended', requireRole('student'), getRecommendedQuestionsController);
router.post('/:id/questions/next', requireRole('student'), getNextQuestionController);
router.post('/:id/questions/:questionId/answer', requireRole('student'), submitAnswerController);
router.post('/:id/complete', requireRole('student'), completeAssessmentController);
router.get('/:id/summary', requireRole('student'), getAssessmentSummaryController);

// Teacher analytics endpoints
router.get('/teacher/student/:studentId/summary', requireRole('teacher'), getTeacherStudentAssessmentSummaryController);

// Parent progress endpoints
router.get('/parent/student/:studentId/summary', requireRole('parent'), getParentStudentAssessmentSummaryController);

export default router;
