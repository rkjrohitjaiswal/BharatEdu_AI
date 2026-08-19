import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { GoalService } from '../learning-goals/service.js';
import { dataRepository } from '../repositories/data.repository.js';
import { DeterministicAchievementEngine } from '../ai/achievements/engine.js';

export const createGoal = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { title, description, goalType, targetValue, unit, targetDate } = req.body;

    // Field Validations
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Goal title is required.' });
      return;
    }

    if (title.trim().length > 120) {
      res.status(400).json({ success: false, message: 'Goal title must not exceed 120 characters.' });
      return;
    }

    if (description && typeof description === 'string' && description.trim().length > 500) {
      res.status(400).json({ success: false, message: 'Goal description must not exceed 500 characters.' });
      return;
    }

    const validTypes = ['mastery', 'practice_questions', 'practice_accuracy', 'study_minutes', 'study_streak', 'topic_completion', 'custom'];
    if (!goalType || !validTypes.includes(goalType)) {
      res.status(400).json({ success: false, message: 'Invalid or unsupported goal type.' });
      return;
    }

    const numericTarget = Number(targetValue);
    if (isNaN(numericTarget) || numericTarget <= 0 || !Number.isFinite(numericTarget)) {
      res.status(400).json({ success: false, message: 'Target value must be a positive number greater than 0.' });
      return;
    }

    if (!targetDate || isNaN(new Date(targetDate).getTime())) {
      res.status(400).json({ success: false, message: 'A valid target date is required.' });
      return;
    }

    const createdGoal = await GoalService.createGoal(req.user.id, {
      title,
      description,
      goalType,
      targetValue: numericTarget,
      unit,
      targetDate,
    });

    res.status(201).json({
      success: true,
      message: 'Learning goal created successfully.',
      data: createdGoal,
    });
  } catch (error) {
    next(error);
  }
};

export const getGoals = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const goals = await GoalService.recalculateAllStudentGoals(req.user.id);

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

export const getGoalById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const goal = await GoalService.recalculateGoalProgress(req.user.id, id);

    if (!goal || String(goal.studentId) !== String(req.user.id)) {
      res.status(404).json({ success: false, message: 'Goal not found or access denied.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const existing = await dataRepository.getStudentGoalById(req.user.id, id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Goal not found or access denied.' });
      return;
    }

    const { title, description, targetValue, unit, targetDate } = req.body;
    const updates: any = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 120) {
        res.status(400).json({ success: false, message: 'Invalid goal title.' });
        return;
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = String(description).trim();
    }

    if (targetValue !== undefined) {
      const numVal = Number(targetValue);
      if (isNaN(numVal) || numVal <= 0) {
        res.status(400).json({ success: false, message: 'Target value must be greater than 0.' });
        return;
      }
      updates.targetValue = numVal;
    }

    if (unit !== undefined) {
      updates.unit = String(unit).trim();
    }

    if (targetDate !== undefined) {
      if (isNaN(new Date(targetDate).getTime())) {
        res.status(400).json({ success: false, message: 'Invalid target date.' });
        return;
      }
      updates.targetDate = new Date(targetDate);
    }

    // Security check: strip client-spoofed internal progress fields
    delete updates.studentId;
    delete updates.currentValue;
    delete updates.progressPercent;
    delete updates.status;
    delete updates.completedAt;

    await dataRepository.updateStudentGoal(req.user.id, id, updates);
    const updated = await GoalService.recalculateGoalProgress(req.user.id, id);

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const pauseGoal = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const updated = await dataRepository.updateStudentGoal(req.user.id, id, { status: 'paused' });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Goal not found or access denied.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Goal paused.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const resumeGoal = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    await dataRepository.updateStudentGoal(req.user.id, id, { status: 'active' });
    const updated = await GoalService.recalculateGoalProgress(req.user.id, id);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Goal not found or access denied.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Goal resumed.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const deleted = await dataRepository.deleteStudentGoal(req.user.id, id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Goal not found or access denied.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAchievements = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Trigger deterministic achievement evaluation
    await DeterministicAchievementEngine.evaluateAndGrantAchievements(req.user.id);
    const achievements = await dataRepository.getStudentAchievements(req.user.id);

    res.status(200).json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

export const getAchievementSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    await DeterministicAchievementEngine.evaluateAndGrantAchievements(req.user.id);
    const summary = await dataRepository.getAchievementSummary(req.user.id);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
