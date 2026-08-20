import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  autosaveExam,
  createMockExam,
  getExamRecommendations,
  getMockExamById,
  getMockExamInstructions,
  getMockExamQuestion,
  getMockExamResult,
  getParentStudentSummary,
  getStudentExamHistory,
  getTeacherStudentSummary,
  startMockExam,
  submitAnswer,
  submitExam,
} from '../controllers/mock-exam.controller.js';

export const studentMockExamRouter = Router();
export const teacherMockExamRouter = Router();
export const parentMockExamRouter = Router();

// Student Routes
studentMockExamRouter.use(authenticateJWT, requireRole('student'));
studentMockExamRouter.get('/recommendations', getExamRecommendations);
studentMockExamRouter.post('/', createMockExam);
studentMockExamRouter.get('/history', getStudentExamHistory);
studentMockExamRouter.get('/:examId', getMockExamById);
studentMockExamRouter.get('/:examId/instructions', getMockExamInstructions);
studentMockExamRouter.post('/:examId/start', startMockExam);
studentMockExamRouter.get('/:examId/questions/:questionNumber', getMockExamQuestion);
studentMockExamRouter.post('/:examId/answers', submitAnswer);
studentMockExamRouter.post('/:examId/autosave', autosaveExam);
studentMockExamRouter.post('/:examId/submit', submitExam);
studentMockExamRouter.get('/:examId/result', getMockExamResult);

// Teacher Routes
teacherMockExamRouter.use(authenticateJWT, requireRole('teacher'));
teacherMockExamRouter.get('/student/:studentId/summary', getTeacherStudentSummary);

// Parent Routes
parentMockExamRouter.use(authenticateJWT, requireRole('parent'));
parentMockExamRouter.get('/student/:studentId/summary', getParentStudentSummary);
