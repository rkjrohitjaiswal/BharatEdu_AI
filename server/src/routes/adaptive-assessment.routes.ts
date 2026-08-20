import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  handleCreateAssessment,
  handleCreateDiagnostic,
  handleCreateExamSimulation,
  handleCreateFromDoubt,
  handleCreateMasteryCheck,
  handleCreateRevisionTest,
  handleDeleteAssessment,
  handleFinishAssessment,
  handleGetAssessmentById,
  handleGetAssessments,
  handleGetCurrentQuestion,
  handleGetParentStudentSummary,
  handleGetRecommendations,
  handleGetResults,
  handleGetReview,
  handleGetTeacherStudentSummary,
  handleSkipQuestion,
  handleStartAssessment,
  handleSubmitAnswer,
} from '../controllers/adaptive-assessment.controller.js';

export const adaptiveAssessmentRouter = Router();

// Student Endpoints
adaptiveAssessmentRouter.post('/', authenticateJWT, requireRole('student'), handleCreateAssessment);
adaptiveAssessmentRouter.get('/', authenticateJWT, requireRole('student'), handleGetAssessments);

adaptiveAssessmentRouter.post('/from-doubt', authenticateJWT, requireRole('student'), handleCreateFromDoubt);
adaptiveAssessmentRouter.post('/diagnostic', authenticateJWT, requireRole('student'), handleCreateDiagnostic);
adaptiveAssessmentRouter.post('/exam-simulation', authenticateJWT, requireRole('student'), handleCreateExamSimulation);
adaptiveAssessmentRouter.post('/mastery-check', authenticateJWT, requireRole('student'), handleCreateMasteryCheck);
adaptiveAssessmentRouter.post('/revision-test', authenticateJWT, requireRole('student'), handleCreateRevisionTest);

adaptiveAssessmentRouter.get('/:id', authenticateJWT, requireRole('student'), handleGetAssessmentById);
adaptiveAssessmentRouter.delete('/:id', authenticateJWT, requireRole('student'), handleDeleteAssessment);

adaptiveAssessmentRouter.post('/:id/start', authenticateJWT, requireRole('student'), handleStartAssessment);
adaptiveAssessmentRouter.get('/:id/current-question', authenticateJWT, requireRole('student'), handleGetCurrentQuestion);
adaptiveAssessmentRouter.post('/:id/questions/:questionId/answer', authenticateJWT, requireRole('student'), handleSubmitAnswer);
adaptiveAssessmentRouter.post('/:id/questions/:questionId/skip', authenticateJWT, requireRole('student'), handleSkipQuestion);
adaptiveAssessmentRouter.post('/:id/finish', authenticateJWT, requireRole('student'), handleFinishAssessment);

adaptiveAssessmentRouter.get('/:id/results', authenticateJWT, requireRole('student'), handleGetResults);
adaptiveAssessmentRouter.get('/:id/review', authenticateJWT, requireRole('student'), handleGetReview);
adaptiveAssessmentRouter.get('/:id/recommendations', authenticateJWT, requireRole('student'), handleGetRecommendations);

// Teacher Summary Endpoint
export const teacherAssessmentRouter = Router();
teacherAssessmentRouter.get('/student/:studentId/summary', authenticateJWT, requireRole('teacher'), handleGetTeacherStudentSummary);

// Parent Summary Endpoint
export const parentAssessmentRouter = Router();
parentAssessmentRouter.get('/student/:studentId/summary', authenticateJWT, requireRole('parent'), handleGetParentStudentSummary);
