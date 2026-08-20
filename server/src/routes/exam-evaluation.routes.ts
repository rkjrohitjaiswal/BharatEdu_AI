import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  handleEvaluatePaper,
  handleGetConcepts,
  handleGetEvaluationById,
  handleGetEvaluations,
  handleGetFeedback,
  handleGetMisconceptions,
  handleGetParentStudentSummary,
  handleGetQuestions,
  handleGetRecommendations,
  handleGetResults,
  handleGetTeacherStudentMisconceptions,
  handleGetTeacherStudentRecommendations,
  handleGetTeacherStudentSummary,
  handleGetTopics,
  handleRecalculateEvaluation,
} from '../controllers/exam-evaluation.controller.js';

export const examEvaluationRouter = Router();

// Student Endpoints
examEvaluationRouter.get('/', authenticateJWT, requireRole('student'), handleGetEvaluations);
examEvaluationRouter.post('/:paperId/evaluate', authenticateJWT, requireRole('student'), handleEvaluatePaper);

examEvaluationRouter.get('/:evaluationId', authenticateJWT, requireRole('student'), handleGetEvaluationById);
examEvaluationRouter.get('/:evaluationId/results', authenticateJWT, requireRole('student'), handleGetResults);
examEvaluationRouter.get('/:evaluationId/questions', authenticateJWT, requireRole('student'), handleGetQuestions);
examEvaluationRouter.get('/:evaluationId/topics', authenticateJWT, requireRole('student'), handleGetTopics);
examEvaluationRouter.get('/:evaluationId/concepts', authenticateJWT, requireRole('student'), handleGetConcepts);
examEvaluationRouter.get('/:evaluationId/misconceptions', authenticateJWT, requireRole('student'), handleGetMisconceptions);
examEvaluationRouter.get('/:evaluationId/recommendations', authenticateJWT, requireRole('student'), handleGetRecommendations);
examEvaluationRouter.get('/:evaluationId/feedback', authenticateJWT, requireRole('student'), handleGetFeedback);
examEvaluationRouter.post('/:evaluationId/recalculate', authenticateJWT, requireRole('student'), handleRecalculateEvaluation);

// Teacher Endpoints
export const teacherEvaluationRouter = Router();
teacherEvaluationRouter.get('/student/:studentId/summary', authenticateJWT, requireRole('teacher'), handleGetTeacherStudentSummary);
teacherEvaluationRouter.get('/student/:studentId/misconceptions', authenticateJWT, requireRole('teacher'), handleGetTeacherStudentMisconceptions);
teacherEvaluationRouter.get('/student/:studentId/recommendations', authenticateJWT, requireRole('teacher'), handleGetTeacherStudentRecommendations);

// Parent Endpoints
export const parentEvaluationRouter = Router();
parentEvaluationRouter.get('/student/:studentId/summary', authenticateJWT, requireRole('parent'), handleGetParentStudentSummary);
