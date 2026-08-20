import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  handleCompleteStage,
  handleCompleteTask,
  handleCreateLearningPath,
  handleGetLearningPathDetails,
  handleGetLearningPathStages,
  handleGetLearningPathSummary,
  handleGetLearningPathTasks,
  handleGetNextLearningTask,
  handleGetParentStudentLearningPathSummary,
  handleGetStudentLearningPaths,
  handleGetTeacherStudentLearningPathSummary,
  handlePauseLearningPath,
  handleRefreshLearningPath,
  handleResumeLearningPath,
  handleStartTask,
} from '../controllers/learning-path.controller.js';

const router = Router();

// Student Routes
router.post('/', authenticateJWT, requireRole('student'), handleCreateLearningPath);
router.get('/', authenticateJWT, requireRole('student'), handleGetStudentLearningPaths);
router.get('/summary', authenticateJWT, requireRole('student'), handleGetLearningPathSummary);
router.post('/refresh', authenticateJWT, requireRole('student'), handleRefreshLearningPath);

router.get('/:id', authenticateJWT, requireRole('student'), handleGetLearningPathDetails);
router.get('/:id/stages', authenticateJWT, requireRole('student'), handleGetLearningPathStages);
router.get('/:id/tasks', authenticateJWT, requireRole('student'), handleGetLearningPathTasks);
router.get('/:id/next', authenticateJWT, requireRole('student'), handleGetNextLearningTask);

router.post('/:id/tasks/:taskId/start', authenticateJWT, requireRole('student'), handleStartTask);
router.post('/:id/tasks/:taskId/complete', authenticateJWT, requireRole('student'), handleCompleteTask);
router.post('/:id/stages/:stageId/complete', authenticateJWT, requireRole('student'), handleCompleteStage);

router.post('/:id/pause', authenticateJWT, requireRole('student'), handlePauseLearningPath);
router.post('/:id/resume', authenticateJWT, requireRole('student'), handleResumeLearningPath);

// Teacher & Parent Summary Routes
router.get('/teacher/student/:studentId/summary', authenticateJWT, requireRole('teacher'), handleGetTeacherStudentLearningPathSummary);
router.get('/parent/student/:studentId/summary', authenticateJWT, requireRole('parent'), handleGetParentStudentLearningPathSummary);

export default router;
