import { Router } from 'express';
import {
  getAllConceptsController,
  getConceptByIdController,
  getConceptDependentsController,
  getConceptPathController,
  getConceptPrerequisitesController,
  getParentStudentOverviewController,
  getStudentReadinessController,
  getStudentRecommendationsController,
  getStudentRootGapsController,
  getTeacherStudentOverviewController,
} from '../controllers/knowledge-graph.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateJWT);

router.get('/concepts', getAllConceptsController);
router.get('/concepts/:id', getConceptByIdController);
router.get('/concepts/:id/prerequisites', getConceptPrerequisitesController);
router.get('/concepts/:id/dependents', getConceptDependentsController);
router.get('/concepts/:id/path', getConceptPathController);

router.get('/student/:studentId/readiness', requireRole('student'), getStudentReadinessController);
router.get('/student/:studentId/root-gaps', requireRole('student'), getStudentRootGapsController);
router.get('/student/:studentId/recommendations', requireRole('student'), getStudentRecommendationsController);

router.get('/teacher/students/:studentId/overview', requireRole('teacher'), getTeacherStudentOverviewController);
router.get('/parent/students/:studentId/overview', requireRole('parent'), getParentStudentOverviewController);

export default router;
