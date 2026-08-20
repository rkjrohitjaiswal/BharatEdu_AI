import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  handleCreatePaper,
  handleDeletePaper,
  handleFinishPaper,
  handleGenerateExamReadinessPaper,
  handleGenerateMock,
  handleGeneratePracticePaper,
  handleGenerateWeakAreaPaper,
  handleGetCurrentQuestion,
  handleGetPaperById,
  handleGetPapers,
  handleGetParentStudentSummary,
  handleGetRecommendations,
  handleGetResults,
  handleGetReview,
  handleGetTeacherStudentSummary,
  handleMarkReview,
  handleSkipQuestion,
  handleStartPaper,
  handleSubmitAnswer,
} from '../controllers/exam-paper.controller.js';

export const examPaperRouter = Router();

// Student Endpoints
examPaperRouter.post('/', authenticateJWT, requireRole('student'), handleCreatePaper);
examPaperRouter.get('/', authenticateJWT, requireRole('student'), handleGetPapers);

examPaperRouter.post('/generate-mock', authenticateJWT, requireRole('student'), handleGenerateMock);
examPaperRouter.post('/generate-practice-paper', authenticateJWT, requireRole('student'), handleGeneratePracticePaper);
examPaperRouter.post('/generate-weak-area-paper', authenticateJWT, requireRole('student'), handleGenerateWeakAreaPaper);
examPaperRouter.post('/generate-exam-readiness-paper', authenticateJWT, requireRole('student'), handleGenerateExamReadinessPaper);

examPaperRouter.get('/:id', authenticateJWT, requireRole('student'), handleGetPaperById);
examPaperRouter.delete('/:id', authenticateJWT, requireRole('student'), handleDeletePaper);

examPaperRouter.post('/:id/start', authenticateJWT, requireRole('student'), handleStartPaper);
examPaperRouter.get('/:id/current', authenticateJWT, requireRole('student'), handleGetCurrentQuestion);
examPaperRouter.post('/:id/questions/:questionId/answer', authenticateJWT, requireRole('student'), handleSubmitAnswer);
examPaperRouter.post('/:id/questions/:questionId/skip', authenticateJWT, requireRole('student'), handleSkipQuestion);
examPaperRouter.post('/:id/questions/:questionId/mark-review', authenticateJWT, requireRole('student'), handleMarkReview);
examPaperRouter.post('/:id/finish', authenticateJWT, requireRole('student'), handleFinishPaper);

examPaperRouter.get('/:id/results', authenticateJWT, requireRole('student'), handleGetResults);
examPaperRouter.get('/:id/review', authenticateJWT, requireRole('student'), handleGetReview);
examPaperRouter.get('/:id/recommendations', authenticateJWT, requireRole('student'), handleGetRecommendations);

// Teacher Summary Endpoint
export const teacherExamPaperRouter = Router();
teacherExamPaperRouter.get('/student/:studentId/summary', authenticateJWT, requireRole('teacher'), handleGetTeacherStudentSummary);

// Parent Summary Endpoint
export const parentExamPaperRouter = Router();
parentExamPaperRouter.get('/student/:studentId/summary', authenticateJWT, requireRole('parent'), handleGetParentStudentSummary);
