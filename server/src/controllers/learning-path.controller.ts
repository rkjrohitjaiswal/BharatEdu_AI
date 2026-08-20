import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  completeLearningPathItem,
  completeLearningStage,
  createLearningPath,
  generateLearningPath,
  getCurrentLearningPath,
  getLearningPathAdvice,
  getLearningPathById,
  getLearningPathItems,
  getLearningPathStages,
  getLearningPathSummary,
  getNextLearningItem,
  getParentStudentLearningPathSummary,
  getStudentLearningPaths,
  getTeacherStudentLearningPathSummary,
  pauseLearningPath,
  refreshLearningPath,
  resumeLearningPath,
  skipLearningPathItem,
  startLearningPathItem,
} from '../ai/learning-path/service.js';

export const handleCreateLearningPath = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const path = await createLearningPath(studentId, req.body);
    res.status(201).json({ success: true, data: path });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create learning path' });
  }
};

export const handleGenerateLearningPath = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const path = await generateLearningPath(studentId, req.body);
    res.status(201).json({ success: true, data: path });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate learning path' });
  }
};

export const handleGetCurrentLearningPath = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const path = await getCurrentLearningPath(studentId);
    res.status(200).json({ success: true, data: path });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch current learning path' });
  }
};

export const handleGetStudentLearningPaths = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const paths = await getStudentLearningPaths(studentId);
    res.status(200).json({ success: true, data: paths });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch learning paths' });
  }
};

export const handleGetLearningPathDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const pathDetails = await getLearningPathById(studentId, req.params.id);
    res.status(200).json({ success: true, data: pathDetails });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch learning path details' });
  }
};

export const handleGetLearningPathStages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const stages = await getLearningPathStages(studentId, req.params.id);
    res.status(200).json({ success: true, data: stages });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch learning path stages' });
  }
};

export const handleGetLearningPathItems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const items = await getLearningPathItems(studentId, req.params.id);
    res.status(200).json({ success: true, data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch learning path items' });
  }
};

export const handleGetNextLearningTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const nextData = await getNextLearningItem(studentId, req.params.id);
    res.status(200).json({ success: true, data: nextData });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch next learning task' });
  }
};

export const handleRefreshLearningPath = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const path = await refreshLearningPath(studentId, req.params.id);
    res.status(200).json({ success: true, data: path });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to refresh learning path' });
  }
};

export const handleStartItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const item = await startLearningPathItem(studentId, req.params.id, req.params.itemId || req.params.taskId);
    res.status(200).json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to start learning path item' });
  }
};

export const handleCompleteItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const item = await completeLearningPathItem(studentId, req.params.id, req.params.itemId || req.params.taskId);
    res.status(200).json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to complete learning path item' });
  }
};

export const handleSkipItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const item = await skipLearningPathItem(studentId, req.params.id, req.params.itemId);
    res.status(200).json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to skip learning path item' });
  }
};

export const handleCompleteStage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const stage = await completeLearningStage(studentId, req.params.id, req.params.stageId);
    res.status(200).json({ success: true, data: stage });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to complete learning stage' });
  }
};

export const handlePauseLearningPath = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const path = await pauseLearningPath(studentId, req.params.id);
    res.status(200).json({ success: true, data: path });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to pause learning path' });
  }
};

export const handleResumeLearningPath = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const path = await resumeLearningPath(studentId, req.params.id);
    res.status(200).json({ success: true, data: path });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to resume learning path' });
  }
};

export const handleGetLearningPathSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const summary = await getLearningPathSummary(studentId, req.params.id);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch learning path summary' });
  }
};

export const handleGetAdvice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const advice = await getLearningPathAdvice(studentId, req.params.id);
    res.status(200).json({ success: true, data: advice });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch learning path advice' });
  }
};

export const handleGetTeacherStudentLearningPathSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { studentId } = req.params;
    const summary = await getTeacherStudentLearningPathSummary(teacherId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch teacher student learning path summary' });
  }
};

export const handleGetParentStudentLearningPathSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parentId = req.user?.id;
    if (!parentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { studentId } = req.params;
    const summary = await getParentStudentLearningPathSummary(parentId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Access denied' });
  }
};
