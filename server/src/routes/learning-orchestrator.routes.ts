import { Router } from 'express';
import { LearningOrchestratorController } from '../controllers/learning-orchestrator.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Student Routes
router.get('/student/orchestrator', authenticateJWT, requireRole('student'), LearningOrchestratorController.getStudentOrchestrator);
router.get('/student/orchestrator/today', authenticateJWT, requireRole('student'), LearningOrchestratorController.getStudentTodayPlan);
router.get('/student/orchestrator/week', authenticateJWT, requireRole('student'), LearningOrchestratorController.getStudentWeekPlan);
router.get('/student/orchestrator/next', authenticateJWT, requireRole('student'), LearningOrchestratorController.getNextBestAction);
router.get('/student/orchestrator/insights', authenticateJWT, requireRole('student'), LearningOrchestratorController.getOrchestratorInsights);
router.post('/student/orchestrator/refresh', authenticateJWT, requireRole('student'), LearningOrchestratorController.refreshStudentPlan);
router.post('/student/orchestrator/actions/:actionId/start', authenticateJWT, requireRole('student'), LearningOrchestratorController.startAction);
router.post('/student/orchestrator/actions/:actionId/complete', authenticateJWT, requireRole('student'), LearningOrchestratorController.completeAction);
router.post('/student/orchestrator/actions/:actionId/skip', authenticateJWT, requireRole('student'), LearningOrchestratorController.skipAction);

// Teacher Routes
router.get('/teacher/orchestrator', authenticateJWT, requireRole('teacher'), LearningOrchestratorController.getTeacherOrchestrator);
router.get('/teacher/orchestrator/class/:classId', authenticateJWT, requireRole('teacher'), LearningOrchestratorController.getClassOrchestrator);
router.get('/teacher/orchestrator/student/:studentId', authenticateJWT, requireRole('teacher'), LearningOrchestratorController.getStudentOrchestratorForTeacher);

// Parent Routes
router.get('/parent/orchestrator/student/:studentId', authenticateJWT, requireRole('parent'), LearningOrchestratorController.getParentChildOrchestrator);
router.get('/parent/orchestrator/student/:studentId/today', authenticateJWT, requireRole('parent'), LearningOrchestratorController.getParentChildTodayPlan);

export const studentOrchestratorRouter = router;
export const teacherOrchestratorRouter = router;
export const parentOrchestratorRouter = router;
export default router;
