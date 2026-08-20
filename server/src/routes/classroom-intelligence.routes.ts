import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { ClassroomIntelligenceController } from '../controllers/classroom-intelligence.controller.js';

const router = Router();

// All classroom intelligence endpoints require teacher authentication
router.use(authenticateJWT, requireRole('teacher'));

router.get('/classes', ClassroomIntelligenceController.getClasses);
router.get('/comparison', ClassroomIntelligenceController.getComparison);

router.get('/:classId/overview', ClassroomIntelligenceController.getOverview);
router.get('/:classId/students', ClassroomIntelligenceController.getStudents);
router.get('/:classId/subjects', ClassroomIntelligenceController.getSubjects);
router.get('/:classId/topics', ClassroomIntelligenceController.getTopics);
router.get('/:classId/gaps', ClassroomIntelligenceController.getGaps);
router.get('/:classId/misconceptions', ClassroomIntelligenceController.getMisconceptions);
router.get('/:classId/assessments', ClassroomIntelligenceController.getAssessments);
router.get('/:classId/risk', ClassroomIntelligenceController.getRisk);
router.get('/:classId/velocity', ClassroomIntelligenceController.getVelocity);
router.get('/:classId/action-plan', ClassroomIntelligenceController.getActionPlan);
router.get('/:classId/insights', ClassroomIntelligenceController.getInsights);

router.post('/:classId/interventions', ClassroomIntelligenceController.createIntervention);
router.get('/:classId/interventions', ClassroomIntelligenceController.getInterventions);

router.post('/:classId/copilot', ClassroomIntelligenceController.askCopilot);

export default router;
