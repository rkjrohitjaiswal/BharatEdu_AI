import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { ClassroomIntelligenceController } from '../controllers/classroom-intelligence.controller.js';

export const teacherInterventionRouter = Router();
export const studentInterventionRouter = Router();

teacherInterventionRouter.use(authenticateJWT, requireRole('teacher'));
teacherInterventionRouter.post('/:interventionId/start', ClassroomIntelligenceController.startIntervention);
teacherInterventionRouter.post('/:interventionId/complete', ClassroomIntelligenceController.completeIntervention);
teacherInterventionRouter.post('/:interventionId/dismiss', ClassroomIntelligenceController.dismissIntervention);
teacherInterventionRouter.get('/:interventionId/effectiveness', ClassroomIntelligenceController.getEffectiveness);

studentInterventionRouter.use(authenticateJWT, requireRole('student'));
studentInterventionRouter.get('/my-interventions', (req, res) => res.json({ success: true, data: [] }));

export default teacherInterventionRouter;
