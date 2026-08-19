import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  pauseGoal,
  resumeGoal,
  deleteGoal,
  getAchievements,
  getAchievementSummary,
} from '../controllers/student-goal.controller.js';

export const studentGoalRouter = Router();
export const achievementRouter = Router();

// Student Goal Routes
studentGoalRouter.use(authenticateJWT, requireRole('student'));
studentGoalRouter.post('/', createGoal);
studentGoalRouter.get('/', getGoals);
studentGoalRouter.get('/:id', getGoalById);
studentGoalRouter.put('/:id', updateGoal);
studentGoalRouter.put('/:id/pause', pauseGoal);
studentGoalRouter.put('/:id/resume', resumeGoal);
studentGoalRouter.delete('/:id', deleteGoal);

// Achievement Routes
achievementRouter.use(authenticateJWT, requireRole('student'));
achievementRouter.get('/', getAchievements);
achievementRouter.get('/summary', getAchievementSummary);
