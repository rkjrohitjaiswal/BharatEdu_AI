import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  createAdaptiveAssessment,
  createAssessmentFromDoubt,
  createDiagnosticAssessment,
  createExamSimulation,
  createMasteryCheck,
  createRevisionTest,
  deleteAdaptiveAssessment,
  finishAdaptiveAssessment,
  getAdaptiveAssessmentById,
  getAdaptiveAssessments,
  getAssessmentRecommendations,
  getAssessmentResults,
  getAssessmentReview,
  getCurrentAssessmentQuestion,
  getParentStudentAssessmentSummary,
  getTeacherStudentAssessmentSummary,
  skipAssessmentQuestion,
  startAdaptiveAssessment,
  submitAssessmentAnswer,
} from '../ai/adaptive-assessment/service.js';

export const handleCreateAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const asst = await createAdaptiveAssessment(studentId, req.body);
    res.status(201).json({ success: true, data: asst });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create assessment' });
  }
};

export const handleGetAssessments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const list = await getAdaptiveAssessments(studentId);
    res.status(200).json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch assessments' });
  }
};

export const handleGetAssessmentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const asst = await getAdaptiveAssessmentById(studentId, req.params.id);
    if (!asst) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }

    res.status(200).json({ success: true, data: asst });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch assessment details' });
  }
};

export const handleDeleteAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const deleted = await deleteAdaptiveAssessment(studentId, req.params.id);
    res.status(200).json({ success: true, data: { deleted } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete assessment' });
  }
};

export const handleStartAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const question = await startAdaptiveAssessment(studentId, req.params.id);
    res.status(200).json({ success: true, data: { currentQuestion: question } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to start assessment' });
  }
};

export const handleGetCurrentQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const question = await getCurrentAssessmentQuestion(studentId, req.params.id);
    res.status(200).json({ success: true, data: question });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch current question' });
  }
};

export const handleSubmitAnswer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { submittedAnswer, responseTimeSeconds } = req.body;
    const result = await submitAssessmentAnswer(
      studentId,
      req.params.id,
      req.params.questionId,
      submittedAnswer || '',
      responseTimeSeconds || 30
    );
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit answer' });
  }
};

export const handleSkipQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const nextQ = await skipAssessmentQuestion(studentId, req.params.id, req.params.questionId);
    res.status(200).json({ success: true, data: { nextQuestion: nextQ } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to skip question' });
  }
};

export const handleFinishAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const results = await finishAdaptiveAssessment(studentId, req.params.id);
    res.status(200).json({ success: true, data: results });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to finish assessment' });
  }
};

export const handleGetResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const results = await getAssessmentResults(studentId, req.params.id);
    res.status(200).json({ success: true, data: results });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch assessment results' });
  }
};

export const handleGetReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const review = await getAssessmentReview(studentId, req.params.id);
    res.status(200).json({ success: true, data: review });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch assessment review' });
  }
};

export const handleGetRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const recs = await getAssessmentRecommendations(studentId, req.params.id);
    res.status(200).json({ success: true, data: recs });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch assessment recommendations' });
  }
};

export const handleCreateFromDoubt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const asst = await createAssessmentFromDoubt(studentId, req.body.doubtId);
    res.status(201).json({ success: true, data: asst });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create assessment from doubt' });
  }
};

export const handleCreateDiagnostic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const asst = await createDiagnosticAssessment(studentId);
    res.status(201).json({ success: true, data: asst });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create diagnostic assessment' });
  }
};

export const handleCreateExamSimulation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const asst = await createExamSimulation(studentId);
    res.status(201).json({ success: true, data: asst });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create exam simulation' });
  }
};

export const handleCreateMasteryCheck = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const asst = await createMasteryCheck(studentId, req.body.conceptId);
    res.status(201).json({ success: true, data: asst });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create mastery check' });
  }
};

export const handleCreateRevisionTest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const asst = await createRevisionTest(studentId);
    res.status(201).json({ success: true, data: asst });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create revision test' });
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
    const summary = await getTeacherStudentAssessmentSummary(teacherId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch teacher student assessment summary' });
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
    const summary = await getParentStudentAssessmentSummary(parentId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Access denied' });
  }
};
