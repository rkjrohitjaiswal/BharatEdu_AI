import { Router } from 'express';
import { LearningEffectivenessController } from '../controllers/learning-effectiveness.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Student Routes
router.get('/student/effectiveness', authenticateJWT, requireRole('student'), LearningEffectivenessController.getStudentEffectiveness);
router.get('/student/effectiveness/actions', authenticateJWT, requireRole('student'), LearningEffectivenessController.getActionEffectiveness);
router.get('/student/effectiveness/concepts', authenticateJWT, requireRole('student'), LearningEffectivenessController.getConceptEffectiveness);
router.get('/student/effectiveness/outcomes', authenticateJWT, requireRole('student'), LearningEffectivenessController.getStudentOutcomes);
router.get('/student/effectiveness/recommendations', authenticateJWT, requireRole('student'), LearningEffectivenessController.getRecommendations);
router.get('/student/effectiveness/summary', authenticateJWT, requireRole('student'), LearningEffectivenessController.getEffectivenessSummary);
router.post('/student/effectiveness/refresh', authenticateJWT, requireRole('student'), LearningEffectivenessController.refreshStudentEffectiveness);

// Teacher Routes
router.get('/teacher/effectiveness', authenticateJWT, requireRole('teacher'), LearningEffectivenessController.getTeacherEffectiveness);
router.get('/teacher/effectiveness/class/:classId', authenticateJWT, requireRole('teacher'), LearningEffectivenessController.getClassEffectiveness);
router.get('/teacher/effectiveness/student/:studentId', authenticateJWT, requireRole('teacher'), LearningEffectivenessController.getStudentEffectivenessForTeacher);

// Parent Routes
router.get('/parent/effectiveness/student/:studentId', authenticateJWT, requireRole('parent'), LearningEffectivenessController.getParentChildEffectiveness);

export const studentEffectivenessRouter = router;
export const teacherEffectivenessRouter = router;
export const parentEffectivenessRouter = router;
export default router;
