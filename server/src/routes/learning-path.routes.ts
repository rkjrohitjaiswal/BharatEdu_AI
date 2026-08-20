import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  handleCompleteItem,
  handleCompleteStage,
  handleCreateLearningPath,
  handleGenerateLearningPath,
  handleGetAdvice,
  handleGetCurrentLearningPath,
  handleGetLearningPathDetails,
  handleGetLearningPathItems,
  handleGetLearningPathStages,
  handleGetLearningPathSummary,
  handleGetNextLearningTask,
  handleGetParentStudentLearningPathSummary,
  handleGetStudentLearningPaths,
  handleGetTeacherStudentLearningPathSummary,
  handlePauseLearningPath,
  handleRefreshLearningPath,
  handleResumeLearningPath,
  handleSkipItem,
  handleStartItem,
} from '../controllers/learning-path.controller.js';

const router = Router();

// Student Routes
router.get('/current', authenticateJWT, requireRole('student'), handleGetCurrentLearningPath);
router.post('/generate', authenticateJWT, requireRole('student'), handleGenerateLearningPath);
router.post('/', authenticateJWT, requireRole('student'), handleCreateLearningPath);
router.get('/', authenticateJWT, requireRole('student'), handleGetStudentLearningPaths);
router.get('/summary', authenticateJWT, requireRole('student'), handleGetLearningPathSummary);
router.post('/refresh', authenticateJWT, requireRole('student'), handleRefreshLearningPath);

router.get('/:id', authenticateJWT, requireRole('student'), handleGetLearningPathDetails);
router.post('/:id/refresh', authenticateJWT, requireRole('student'), handleRefreshLearningPath);
router.get('/:id/stages', authenticateJWT, requireRole('student'), handleGetLearningPathStages);
router.get('/:id/items', authenticateJWT, requireRole('student'), handleGetLearningPathItems);
router.get('/:id/tasks', authenticateJWT, requireRole('student'), handleGetLearningPathItems);
router.get('/:id/next', authenticateJWT, requireRole('student'), handleGetNextLearningTask);
router.get('/:id/summary', authenticateJWT, requireRole('student'), handleGetLearningPathSummary);
router.get('/:id/advice', authenticateJWT, requireRole('student'), handleGetAdvice);

router.post('/:id/items/:itemId/start', authenticateJWT, requireRole('student'), handleStartItem);
router.post('/:id/items/:itemId/complete', authenticateJWT, requireRole('student'), handleCompleteItem);
router.post('/:id/items/:itemId/skip', authenticateJWT, requireRole('student'), handleSkipItem);

router.post('/:id/tasks/:taskId/start', authenticateJWT, requireRole('student'), handleStartItem);
router.post('/:id/tasks/:taskId/complete', authenticateJWT, requireRole('student'), handleCompleteItem);
router.post('/:id/stages/:stageId/complete', authenticateJWT, requireRole('student'), handleCompleteStage);

router.post('/:id/pause', authenticateJWT, requireRole('student'), handlePauseLearningPath);
router.post('/:id/resume', authenticateJWT, requireRole('student'), handleResumeLearningPath);

// Teacher & Parent Summary Routes
router.get('/teacher/student/:studentId/summary', authenticateJWT, requireRole('teacher'), handleGetTeacherStudentLearningPathSummary);
router.get('/parent/student/:studentId/summary', authenticateJWT, requireRole('parent'), handleGetParentStudentLearningPathSummary);

export default router;
