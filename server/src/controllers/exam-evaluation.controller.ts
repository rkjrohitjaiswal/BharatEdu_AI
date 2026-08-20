import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  evaluateExamPaper,
  getEvaluationConcepts,
  getEvaluationFeedback,
  getEvaluationMisconceptions,
  getEvaluationQuestions,
  getEvaluationRecommendations,
  getEvaluationResults,
  getEvaluationTopics,
  getExamEvaluationById,
  getParentStudentEvaluationSummary,
  getStudentExamEvaluations,
  getTeacherStudentEvaluationSummary,
  getTeacherStudentMisconceptions,
  getTeacherStudentRecommendations,
  recalculateEvaluation,
} from '../ai/exam-evaluation/service.js';

export const handleGetEvaluations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const list = await getStudentExamEvaluations(studentId);
    res.status(200).json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch exam evaluations' });
  }
};

export const handleGetEvaluationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const item = await getExamEvaluationById(studentId, req.params.evaluationId);
    res.status(200).json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch evaluation details' });
  }
};

export const handleEvaluatePaper = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await evaluateExamPaper(studentId, req.params.paperId);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to evaluate exam paper' });
  }
};

export const handleGetResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = await getEvaluationResults(studentId, req.params.evaluationId);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch evaluation results' });
  }
};

export const handleGetQuestions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = await getEvaluationQuestions(studentId, req.params.evaluationId);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch question evaluations' });
  }
};

export const handleGetTopics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = await getEvaluationTopics(studentId, req.params.evaluationId);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch topic evaluations' });
  }
};

export const handleGetConcepts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = await getEvaluationConcepts(studentId, req.params.evaluationId);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch concept evaluations' });
  }
};

export const handleGetMisconceptions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = await getEvaluationMisconceptions(studentId, req.params.evaluationId);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch evaluation misconceptions' });
  }
};

export const handleGetRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = await getEvaluationRecommendations(studentId, req.params.evaluationId);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch evaluation recommendations' });
  }
};

export const handleGetFeedback = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = await getEvaluationFeedback(studentId, req.params.evaluationId);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch evaluation feedback' });
  }
};

export const handleRecalculateEvaluation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await recalculateEvaluation(studentId, req.params.evaluationId);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to recalculate evaluation' });
  }
};

export const handleGetTeacherStudentSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { studentId } = req.params;
    const summary = await getTeacherStudentEvaluationSummary(teacherId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch teacher student evaluation summary' });
  }
};

export const handleGetTeacherStudentMisconceptions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { studentId } = req.params;
    const misconceptions = await getTeacherStudentMisconceptions(teacherId, studentId);
    res.status(200).json({ success: true, data: misconceptions });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch teacher student misconceptions' });
  }
};

export const handleGetTeacherStudentRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { studentId } = req.params;
    const recs = await getTeacherStudentRecommendations(teacherId, studentId);
    res.status(200).json({ success: true, data: recs });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch teacher student recommendations' });
  }
};

export const handleGetParentStudentSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parentId = req.user?.id;
    if (!parentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { studentId } = req.params;
    const summary = await getParentStudentEvaluationSummary(parentId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Access denied' });
  }
};
