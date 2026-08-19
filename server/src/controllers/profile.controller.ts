import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { User } from '../models/user.model.js';
import { isDBConnected } from '../services/db.js';

export const getStudentProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let userProfile = req.user;

    if (isDBConnected()) {
      const dbUser = await User.findById(req.user.id);
      if (dbUser) {
        userProfile = dbUser.toSafeObject();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Student profile retrieved successfully',
      profile: {
        ...userProfile,
        academicOverview: {
          enrolledCourses: 3,
          completedModules: 12,
          adaptiveScore: 84,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let userProfile = req.user;

    if (isDBConnected()) {
      const dbUser = await User.findById(req.user.id);
      if (dbUser) {
        userProfile = dbUser.toSafeObject();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Teacher profile retrieved successfully',
      profile: {
        ...userProfile,
        teachingOverview: {
          assignedClasses: ['Grade 8 - Science', 'Grade 8 - Mathematics'],
          totalStudents: 42,
          pendingInterventions: 3,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
