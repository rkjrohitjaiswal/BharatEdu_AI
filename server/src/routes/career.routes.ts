import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { createGoal, deleteGoal, getAdvice, getRoadmap, listCareers, listGoals } from '../controllers/career.controller.js';

const router = Router();
router.use(authenticateJWT, requireRole('student'));
router.get('/catalog', listCareers);
router.get('/goals', listGoals);
router.post('/goals', createGoal);
router.get('/goals/:id/roadmap', getRoadmap);
router.get('/goals/:id/advice', getAdvice);
router.delete('/goals/:id', deleteGoal);
export default router;
