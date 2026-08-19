import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { createGoal, deleteGoal, getRoadmap, listCareers, listGoals } from '../controllers/career.controller.js';

const router = Router();
router.get('/catalog', authenticateJWT, requireRole('student'), listCareers);
router.get('/goals', authenticateJWT, requireRole('student'), listGoals);
router.post('/goals', authenticateJWT, requireRole('student'), createGoal);
router.get('/goals/:id/roadmap', authenticateJWT, requireRole('student'), getRoadmap);
router.delete('/goals/:id', authenticateJWT, requireRole('student'), deleteGoal);
export default router;
