import { Request, Response } from 'express';
import {
  getAllConcepts,
  getConceptDetails,
  getConceptPathService,
  getDependents,
  getParentStudentOverview,
  getPrerequisites,
  getStudentReadiness,
  getStudentRecommendations,
  getStudentRootGaps,
  getTeacherStudentOverview,
} from '../ai/knowledge-graph/service.js';

export const getAllConceptsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const concepts = await getAllConcepts();
    res.status(200).json({ success: true, data: concepts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch concepts' });
  }
};

export const getConceptByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const concept = await getConceptDetails(id);
    if (!concept) {
      res.status(404).json({ success: false, message: 'Concept not found' });
      return;
    }
    res.status(200).json({ success: true, data: concept });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch concept details' });
  }
};

export const getConceptPrerequisitesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const prereqs = await getPrerequisites(id);
    res.status(200).json({ success: true, data: prereqs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch prerequisites' });
  }
};

export const getConceptDependentsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dependents = await getDependents(id);
    res.status(200).json({ success: true, data: dependents });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch dependents' });
  }
};

export const getConceptPathController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { toId = 'math_integ' } = req.query;
    const path = await getConceptPathService(id, String(toId));
    res.status(200).json({ success: true, data: path });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch concept path' });
  }
};

export const getStudentReadinessController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student' || user.id !== studentId) {
      res.status(403).json({ success: false, message: 'Access denied to student readiness data' });
      return;
    }

    const readiness = await getStudentReadiness(studentId);
    res.status(200).json({ success: true, data: readiness });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch concept readiness' });
  }
};

export const getStudentRootGapsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student' || user.id !== studentId) {
      res.status(403).json({ success: false, message: 'Access denied to student root gaps data' });
      return;
    }

    const rootGaps = await getStudentRootGaps(studentId);
    res.status(200).json({ success: true, data: rootGaps });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch root learning gaps' });
  }
};

export const getStudentRecommendationsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'student' || user.id !== studentId) {
      res.status(403).json({ success: false, message: 'Access denied to student recommendations' });
      return;
    }

    const recs = await getStudentRecommendations(studentId);
    res.status(200).json({ success: true, data: recs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch concept recommendations' });
  }
};

export const getTeacherStudentOverviewController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'Only teachers can access student concept overview' });
      return;
    }

    const overview = await getTeacherStudentOverview(user.id, studentId);
    res.status(200).json({ success: true, data: overview });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch teacher student overview' });
  }
};

export const getParentStudentOverviewController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'parent') {
      res.status(403).json({ success: false, message: 'Only parents can access student concept overview' });
      return;
    }

    const overview = await getParentStudentOverview(user.id, studentId);
    res.status(200).json({ success: true, data: overview });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error?.message || 'Access denied for parent overview' });
  }
};
