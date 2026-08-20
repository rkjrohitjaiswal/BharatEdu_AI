import { Router } from 'express';
import { AssessmentEngineController } from '../controllers/assessment-engine.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Student Routes
router.get(
  '/student/assessments',
  authenticateJWT,
  requireRole('student'),
  AssessmentEngineController.getStudentAssessments
);
router.get(
  '/student/assessments/:assessmentId',
  authenticateJWT,
  requireRole('student'),
  AssessmentEngineController.getStudentAssessment
);
router.post(
  '/student/assessments/:assessmentId/start',
  authenticateJWT,
  requireRole('student'),
  AssessmentEngineController.startAssessmentAttempt
);
router.post(
  '/student/assessments/:assessmentId/questions/:questionId/answer',
  authenticateJWT,
  requireRole('student'),
  AssessmentEngineController.recordQuestionAnswer
);
router.post(
  '/student/assessments/:assessmentId/questions/:questionId/flag',
  authenticateJWT,
  requireRole('student'),
  AssessmentEngineController.recordQuestionFlag
);
router.post(
  '/student/assessments/:assessmentId/questions/:questionId/confidence',
  authenticateJWT,
  requireRole('student'),
  AssessmentEngineController.recordQuestionConfidence
);
router.post(
  '/student/assessments/:assessmentId/submit',
  authenticateJWT,
  requireRole('student'),
  AssessmentEngineController.submitAssessment
);
router.get(
  '/student/assessments/:assessmentId/result',
  authenticateJWT,
  requireRole('student'),
  AssessmentEngineController.getAssessmentResult
);
router.get(
  '/student/assessments/:assessmentId/recommendations',
  authenticateJWT,
  requireRole('student'),
  AssessmentEngineController.getStudentAssessmentRecommendations
);

// Teacher Routes
router.get(
  '/teacher/assessments',
  authenticateJWT,
  requireRole('teacher'),
  AssessmentEngineController.getTeacherAssessments
);
router.post(
  '/teacher/assessments',
  authenticateJWT,
  requireRole('teacher'),
  AssessmentEngineController.createTeacherAssessment
);
router.post(
  '/teacher/assessments/generate',
  authenticateJWT,
  requireRole('teacher'),
  AssessmentEngineController.generateAIAssessment
);
router.get(
  '/teacher/assessments/:assessmentId',
  authenticateJWT,
  requireRole('teacher'),
  AssessmentEngineController.getTeacherAssessmentDetail
);
router.put(
  '/teacher/assessments/:assessmentId',
  authenticateJWT,
  requireRole('teacher'),
  AssessmentEngineController.updateTeacherAssessment
);
router.post(
  '/teacher/assessments/:assessmentId/publish',
  authenticateJWT,
  requireRole('teacher'),
  AssessmentEngineController.publishTeacherAssessment
);
router.post(
  '/teacher/assessments/:assessmentId/questions/:questionId/approve',
  authenticateJWT,
  requireRole('teacher'),
  AssessmentEngineController.approveQuestion
);
router.post(
  '/teacher/assessments/:assessmentId/questions/:questionId/reject',
  authenticateJWT,
  requireRole('teacher'),
  AssessmentEngineController.rejectQuestion
);
router.post(
  '/teacher/assessments/:assessmentId/questions/:questionId/regenerate',
  authenticateJWT,
  requireRole('teacher'),
  AssessmentEngineController.regenerateQuestion
);
router.get(
  '/teacher/assessments/:assessmentId/analytics',
  authenticateJWT,
  requireRole('teacher'),
  AssessmentEngineController.getTeacherAssessmentAnalytics
);
router.get(
  '/teacher/assessments/:assessmentId/questions/analytics',
  authenticateJWT,
  requireRole('teacher'),
  AssessmentEngineController.getTeacherQuestionAnalytics
);

// Parent Routes
router.get(
  '/parent/assessments/student/:studentId',
  authenticateJWT,
  requireRole('parent'),
  AssessmentEngineController.getParentChildAssessments
);
router.get(
  '/parent/assessments/student/:studentId/:assessmentId',
  authenticateJWT,
  requireRole('parent'),
  AssessmentEngineController.getParentChildAssessmentDetail
);

export default router;
