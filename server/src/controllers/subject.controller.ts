import { Request, Response, NextFunction } from 'express';
import { dataRepository } from '../repositories/data.repository.js';

export const getSubjects = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subjects = await dataRepository.getAllSubjects();
    res.status(200).json({
      success: true,
      data: subjects || [],
    });
  } catch (error) {
    next(error);
  }
};
