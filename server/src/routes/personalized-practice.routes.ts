import { Router } from 'express';
import {
  createPracticeSession,
  getParentStudentPracticeSummary,
  getPracticeHistory,
  getPracticeRecommendations,
  getSessionQuestion,
  getSessionResult,
  getTeacherStudentPracticeSummary,
  requestHint,
  submitAnswer,
} from '../controllers/personalized-practice.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const studentRouter = Router();
const teacherRouter = Router();
const parentRouter = Router();

// Student Endpoints
studentRouter.use(authenticateJWT, requireRole('student'));

studentRouter.get('/recommendations', getPracticeRecommendations);
studentRouter.post('/sessions', createPracticeSession);
studentRouter.get('/sessions/:sessionId/question', getSessionQuestion);
studentRouter.post('/sessions/:sessionId/answer', submitAnswer);
studentRouter.post('/sessions/:sessionId/hint', requestHint);
studentRouter.get('/sessions/:sessionId/result', getSessionResult);
studentRouter.get('/history', getPracticeHistory);

// Teacher Endpoints
teacherRouter.use(authenticateJWT, requireRole('teacher'));
teacherRouter.get('/student/:studentId/summary', getTeacherStudentPracticeSummary);

// Parent Endpoints
parentRouter.use(authenticateJWT, requireRole('parent'));
parentRouter.get('/student/:studentId/summary', getParentStudentPracticeSummary);

export {
  studentRouter as studentPersonalizedPracticeRouter,
  teacherRouter as teacherPersonalizedPracticeRouter,
  parentRouter as parentPersonalizedPracticeRouter,
};
