import { Request, Response, NextFunction } from 'express';
import { dataRepository } from '../repositories/data.repository.js';

export const getTopics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { subjectId, classLevel } = req.query;
    const level = classLevel ? parseInt(classLevel as string, 10) : undefined;
    const topics = await dataRepository.getTopics(subjectId as string, level);

    res.status(200).json({
      success: true,
      data: topics || [],
    });
  } catch (error) {
    next(error);
  }
};
