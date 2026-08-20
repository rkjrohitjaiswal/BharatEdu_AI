import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  handleAddRevision,
  handleFeedbackDoubt,
  handleFollowupDoubt,
  handleGetContext,
  handleGetDoubtById,
  handleGetDoubts,
  handleGetParentStudentSummary,
  handleGetRecommendations,
  handleGetTeacherStudentSummary,
  handlePractice,
  handleSolveDoubt,
} from '../controllers/doubt-solver.controller.js';

export const doubtSolverRouter = Router();

// Student Endpoints
doubtSolverRouter.get('/history', authenticateJWT, requireRole('student'), handleGetDoubts);
doubtSolverRouter.get('/', authenticateJWT, requireRole('student'), handleGetDoubts);
doubtSolverRouter.post('/', authenticateJWT, requireRole('student'), handleSolveDoubt);

doubtSolverRouter.get('/:doubtId', authenticateJWT, requireRole('student'), handleGetDoubtById);
doubtSolverRouter.post('/:doubtId/solve', authenticateJWT, requireRole('student'), handleSolveDoubt);
doubtSolverRouter.post('/:doubtId/followup', authenticateJWT, requireRole('student'), handleFollowupDoubt);
doubtSolverRouter.post('/:doubtId/feedback', authenticateJWT, requireRole('student'), handleFeedbackDoubt);
doubtSolverRouter.get('/:doubtId/context', authenticateJWT, requireRole('student'), handleGetContext);
doubtSolverRouter.get('/:doubtId/recommendations', authenticateJWT, requireRole('student'), handleGetRecommendations);
doubtSolverRouter.post('/:doubtId/add-to-revision', authenticateJWT, requireRole('student'), handleAddRevision);
doubtSolverRouter.post('/:doubtId/practice', authenticateJWT, requireRole('student'), handlePractice);

// Teacher Endpoints
export const teacherDoubtRouter = Router();
teacherDoubtRouter.get('/student/:studentId/summary', authenticateJWT, requireRole('teacher'), handleGetTeacherStudentSummary);

// Parent Endpoints
export const parentDoubtRouter = Router();
parentDoubtRouter.get('/student/:studentId/summary', authenticateJWT, requireRole('parent'), handleGetParentStudentSummary);

export default doubtSolverRouter;
