import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  createIntervention,
  getTeacherInterventions,
  getTeacherInterventionById,
  updateTeacherIntervention,
  getTeacherInterventionAnalytics,
  getStudentInterventions,
  getStudentInterventionById,
  updateStudentInterventionStatus,
} from '../controllers/intervention.controller.js';

export const teacherInterventionRouter = Router();
export const studentInterventionRouter = Router();

// Teacher Interventions Router (/api/teacher/interventions)
teacherInterventionRouter.use(authenticateJWT);
teacherInterventionRouter.use(requireRole('teacher'));

teacherInterventionRouter.post('/', createIntervention);
teacherInterventionRouter.get('/', getTeacherInterventions);
teacherInterventionRouter.get('/analytics', getTeacherInterventionAnalytics);
teacherInterventionRouter.get('/:id', getTeacherInterventionById);
teacherInterventionRouter.put('/:id', updateTeacherIntervention);

// Student Interventions Router (/api/student/interventions)
studentInterventionRouter.use(authenticateJWT);
studentInterventionRouter.use(requireRole('student'));

studentInterventionRouter.get('/', getStudentInterventions);
studentInterventionRouter.get('/:id', getStudentInterventionById);
studentInterventionRouter.put('/:id/status', updateStudentInterventionStatus);
