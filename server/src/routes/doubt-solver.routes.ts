import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  handleCreateSession,
  handleDeleteSession,
  handleFeedback,
  handleGetContext,
  handleGetMessages,
  handleGetParentStudentSummary,
  handleGetRecommendations,
  handleGetSessionById,
  handleGetSessions,
  handleGetTeacherStudentSummary,
  handleSendMessage,
  handleSocraticMode,
  handleSolveSession,
} from '../controllers/doubt-solver.controller.js';

const router = Router();

// Student Routes
router.post('/sessions', authenticateJWT, requireRole('student'), handleCreateSession);
router.get('/sessions', authenticateJWT, requireRole('student'), handleGetSessions);
router.get('/sessions/:id', authenticateJWT, requireRole('student'), handleGetSessionById);
router.delete('/sessions/:id', authenticateJWT, requireRole('student'), handleDeleteSession);

router.post('/sessions/:id/messages', authenticateJWT, requireRole('student'), handleSendMessage);
router.get('/sessions/:id/messages', authenticateJWT, requireRole('student'), handleGetMessages);

router.post('/sessions/:id/solve', authenticateJWT, requireRole('student'), handleSolveSession);
router.post('/sessions/:id/socratic', authenticateJWT, requireRole('student'), handleSocraticMode);

router.post('/messages/:id/feedback', authenticateJWT, requireRole('student'), handleFeedback);

router.get('/context', authenticateJWT, requireRole('student'), handleGetContext);
router.get('/recommendations', authenticateJWT, requireRole('student'), handleGetRecommendations);

// Teacher & Parent Summary Routes
router.get('/teacher/student/:studentId/summary', authenticateJWT, requireRole('teacher'), handleGetTeacherStudentSummary);
router.get('/parent/student/:studentId/summary', authenticateJWT, requireRole('parent'), handleGetParentStudentSummary);

export default router;
