import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  completeLearningStage,
  completeLearningTask,
  createLearningPath,
  getLearningPathDetails,
  getNextLearningTask,
  getParentStudentLearningPathSummary,
  getStudentLearningPaths,
  getTeacherStudentLearningPathSummary,
  pauseLearningPath,
  refreshStudentLearningPath,
  resumeLearningPath,
  startLearningTask,
} from '../ai/learning-path/service.js';
import { getLearningPathSummaryEngine } from '../ai/learning-path/engine.js';

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

    const pathDetails = await getLearningPathDetails(studentId, req.params.id);
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

    const pathDetails = await getLearningPathDetails(studentId, req.params.id);
    res.status(200).json({ success: true, data: pathDetails.stages });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch learning path stages' });
  }
};

export const handleGetLearningPathTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const pathDetails = await getLearningPathDetails(studentId, req.params.id);
    const activeStage = pathDetails.stages.find((s) => s.stageIndex === pathDetails.currentStage) || pathDetails.stages[0];
    res.status(200).json({ success: true, data: activeStage?.tasks || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch learning path tasks' });
  }
};

export const handleGetNextLearningTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const nextData = await getNextLearningTask(studentId, req.params.id);
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

    const path = await refreshStudentLearningPath(studentId);
    res.status(200).json({ success: true, data: path });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to refresh learning path' });
  }
};

export const handleStartTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const task = await startLearningTask(studentId, req.params.id, req.params.taskId);
    res.status(200).json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to start learning task' });
  }
};

export const handleCompleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const task = await completeLearningTask(studentId, req.params.id, req.params.taskId);
    res.status(200).json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to complete learning task' });
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

    const summary = await getLearningPathSummaryEngine(studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch learning path summary' });
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
