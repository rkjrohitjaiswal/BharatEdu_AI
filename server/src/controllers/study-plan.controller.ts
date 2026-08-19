import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dataRepository } from '../repositories/data.repository.js';
import { StudyPlanGenerator } from '../ai/study-plan/planner.js';

export const generateStudyPlan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { dailyStudyMinutes, planDuration, preferredLanguage } = req.body;

    const options = {
      dailyStudyMinutes: typeof dailyStudyMinutes === 'number' ? dailyStudyMinutes : 60,
      planDuration: planDuration === 'weekly' ? ('weekly' as const) : ('daily' as const),
      preferredLanguage: preferredLanguage || req.user.preferredLanguage || 'english',
    };

    // Generate Plan Payload via Generator Engine
    const generatedPayload = await StudyPlanGenerator.generateStudyPlan(req.user.id, options);

    // Persist via Data Repository
    const savedPlan = await dataRepository.saveGeneratedStudyPlan(req.user.id, generatedPayload);

    res.status(201).json({
      success: true,
      message: 'Personalized study plan generated successfully',
      data: savedPlan,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentStudyPlan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const plan = await dataRepository.getStudyPlan(req.user.id);

    res.status(200).json({
      success: true,
      data: plan || null,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { taskId } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
      res.status(400).json({ success: false, message: 'completed status (boolean) is required' });
      return;
    }

    const updated = await dataRepository.updateStudyPlanTask(req.user.id, taskId, completed);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Study task not found or access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Study task ${completed ? 'completed' : 'uncompleted'} successfully`,
    });
  } catch (error) {
    next(error);
  }
};
