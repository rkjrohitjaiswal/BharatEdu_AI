import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  addQuestionToAssessment,
  approveAIEvaluation,
  closeAssessment,
  createAssessment,
  createRubric,
  getAssessmentAnalytics,
  getAssessmentById,
  getAssessmentForStudent,
  getAssessmentQuestionsForStudent,
  getAssessmentSubmissions,
  getParentStudentSummary,
  getStudentAssessments,
  getStudentSubmissionResult,
  getSubmissionAIEvaluation,
  getSubmissionById,
  getTeacherAssessments,
  modifyAndFinalizeGrade,
  publishAssessment,
  reopenAssessment,
  saveDraftSubmission,
  submitAssessment,
  updateAssessment,
} from '../controllers/assessment.controller.js';

export const teacherTeacherAssessmentRouter = Router();
export const studentTeacherAssessmentRouter = Router();
export const parentTeacherAssessmentRouter = Router();

// Teacher Endpoints
teacherTeacherAssessmentRouter.use(authenticateJWT, requireRole('teacher'));
teacherTeacherAssessmentRouter.post('/', createAssessment);
teacherTeacherAssessmentRouter.get('/', getTeacherAssessments);
teacherTeacherAssessmentRouter.post('/rubrics', createRubric);
teacherTeacherAssessmentRouter.get('/:assessmentId', getAssessmentById);
teacherTeacherAssessmentRouter.put('/:assessmentId', updateAssessment);
teacherTeacherAssessmentRouter.post('/:assessmentId/publish', publishAssessment);
teacherTeacherAssessmentRouter.post('/:assessmentId/close', closeAssessment);
teacherTeacherAssessmentRouter.post('/:assessmentId/reopen', reopenAssessment);
teacherTeacherAssessmentRouter.post('/:assessmentId/questions', addQuestionToAssessment);
teacherTeacherAssessmentRouter.get('/:assessmentId/submissions', getAssessmentSubmissions);
teacherTeacherAssessmentRouter.get('/:assessmentId/analytics', getAssessmentAnalytics);

// Teacher Submission Endpoints
export const teacherSubmissionsRouter = Router();
teacherSubmissionsRouter.use(authenticateJWT, requireRole('teacher'));
teacherSubmissionsRouter.get('/:submissionId', getSubmissionById);
teacherSubmissionsRouter.get('/:submissionId/evaluation', getSubmissionAIEvaluation);
teacherSubmissionsRouter.post('/:submissionId/approve-ai', approveAIEvaluation);
teacherSubmissionsRouter.post('/:submissionId/modify-grade', modifyAndFinalizeGrade);
teacherSubmissionsRouter.post('/:submissionId/finalize', modifyAndFinalizeGrade);

// Student Endpoints
studentTeacherAssessmentRouter.use(authenticateJWT, requireRole('student'));
studentTeacherAssessmentRouter.get('/', getStudentAssessments);
studentTeacherAssessmentRouter.get('/:assessmentId', getAssessmentForStudent);
studentTeacherAssessmentRouter.get('/:assessmentId/questions', getAssessmentQuestionsForStudent);
studentTeacherAssessmentRouter.post('/:assessmentId/save', saveDraftSubmission);
studentTeacherAssessmentRouter.post('/:assessmentId/submit', submitAssessment);

// Student Submission Endpoints
export const studentSubmissionsRouter = Router();
studentSubmissionsRouter.use(authenticateJWT, requireRole('student'));
studentSubmissionsRouter.get('/:submissionId', getStudentSubmissionResult);
studentSubmissionsRouter.get('/:submissionId/result', getStudentSubmissionResult);

// Parent Endpoints
parentTeacherAssessmentRouter.use(authenticateJWT, requireRole('parent'));
parentTeacherAssessmentRouter.get('/student/:studentId/summary', getParentStudentSummary);
