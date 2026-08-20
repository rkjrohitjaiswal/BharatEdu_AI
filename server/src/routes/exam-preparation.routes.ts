import { Router } from 'express';
import { ExamPreparationController } from '../controllers/exam-preparation.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Student Routes
router.get(
  '/student/exam-preparation',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.getStudentExamPreparation
);
router.post(
  '/student/exam-preparation/plan',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.createOrUpdatePlan
);
router.get(
  '/student/exam-preparation/readiness',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.getReadiness
);
router.get(
  '/student/exam-preparation/priorities',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.getPriorities
);
router.get(
  '/student/exam-preparation/today',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.getTodayPlan
);
router.get(
  '/student/exam-preparation/week',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.getWeeklyPlan
);
router.get(
  '/student/exam-preparation/gaps',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.getGaps
);
router.get(
  '/student/exam-preparation/mock-recommendation',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.getMockRecommendation
);
router.post(
  '/student/exam-preparation/mock/generate',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.generateMockExam
);
router.get(
  '/student/exam-preparation/strategy',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.getExamStrategy
);
router.get(
  '/student/exam-preparation/resources',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.getExamResources
);
router.get(
  '/student/exam-preparation/summary',
  authenticateJWT,
  requireRole('student'),
  ExamPreparationController.getExamSummary
);

// Teacher Routes
router.get(
  '/teacher/exam-preparation',
  authenticateJWT,
  requireRole('teacher'),
  ExamPreparationController.getTeacherExamOverview
);
router.get(
  '/teacher/exam-preparation/class/:classId',
  authenticateJWT,
  requireRole('teacher'),
  ExamPreparationController.getClassExamPreparation
);
router.get(
  '/teacher/exam-preparation/student/:studentId',
  authenticateJWT,
  requireRole('teacher'),
  ExamPreparationController.getStudentExamPreparationForTeacher
);
router.post(
  '/teacher/exam-preparation/student/:studentId/mock',
  authenticateJWT,
  requireRole('teacher'),
  ExamPreparationController.assignMockExamToStudent
);
router.get(
  '/teacher/exam-preparation/class/:classId/analytics',
  authenticateJWT,
  requireRole('teacher'),
  ExamPreparationController.getClassExamAnalytics
);

// Parent Routes
router.get(
  '/parent/exam-preparation/student/:studentId',
  authenticateJWT,
  requireRole('parent'),
  ExamPreparationController.getParentChildExamPreparation
);
router.get(
  '/parent/exam-preparation/student/:studentId/readiness',
  authenticateJWT,
  requireRole('parent'),
  ExamPreparationController.getParentChildExamReadiness
);

export default router;
