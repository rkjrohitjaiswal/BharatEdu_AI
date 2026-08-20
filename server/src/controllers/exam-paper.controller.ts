import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  createExamPaper,
  deleteExamPaper,
  finishExamPaper,
  generateExamReadinessPaper,
  generateMockExam,
  generatePracticePaper,
  generateWeakAreaPaper,
  getCurrentExamQuestion,
  getExamPaperById,
  getExamPaperRecommendations,
  getExamPaperResults,
  getExamPaperReview,
  getParentStudentExamSummary,
  getStudentExamPapers,
  getTeacherStudentExamSummary,
  markExamQuestionForReview,
  skipExamQuestion,
  startExamPaper,
  submitExamAnswer,
} from '../ai/exam-paper/service.js';

export const handleCreatePaper = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const paper = await createExamPaper(studentId, req.body);
    res.status(201).json({ success: true, data: paper });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create exam paper' });
  }
};

export const handleGetPapers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const list = await getStudentExamPapers(studentId);
    res.status(200).json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch exam papers' });
  }
};

export const handleGetPaperById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const paper = await getExamPaperById(studentId, req.params.id);
    if (!paper) {
      res.status(404).json({ error: 'Exam paper not found' });
      return;
    }

    res.status(200).json({ success: true, data: paper });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch exam paper details' });
  }
};

export const handleDeletePaper = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const deleted = await deleteExamPaper(studentId, req.params.id);
    res.status(200).json({ success: true, data: { deleted } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete exam paper' });
  }
};

export const handleStartPaper = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const question = await startExamPaper(studentId, req.params.id);
    res.status(200).json({ success: true, data: { currentQuestion: question } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to start exam paper' });
  }
};

export const handleGetCurrentQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const question = await getCurrentExamQuestion(studentId, req.params.id);
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
    const result = await submitExamAnswer(
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

    const nextQ = await skipExamQuestion(studentId, req.params.id, req.params.questionId);
    res.status(200).json({ success: true, data: { nextQuestion: nextQ } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to skip question' });
  }
};

export const handleMarkReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const nextQ = await markExamQuestionForReview(studentId, req.params.id, req.params.questionId);
    res.status(200).json({ success: true, data: { nextQuestion: nextQ } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to mark question for review' });
  }
};

export const handleFinishPaper = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const results = await finishExamPaper(studentId, req.params.id);
    res.status(200).json({ success: true, data: results });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to finish exam paper' });
  }
};

export const handleGetResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const results = await getExamPaperResults(studentId, req.params.id);
    res.status(200).json({ success: true, data: results });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch exam results' });
  }
};

export const handleGetReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const review = await getExamPaperReview(studentId, req.params.id);
    res.status(200).json({ success: true, data: review });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch exam review' });
  }
};

export const handleGetRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const recs = await getExamPaperRecommendations(studentId, req.params.id);
    res.status(200).json({ success: true, data: recs });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch exam recommendations' });
  }
};

export const handleGenerateMock = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const paper = await generateMockExam(studentId, req.body.subject);
    res.status(201).json({ success: true, data: paper });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate mock exam' });
  }
};

export const handleGeneratePracticePaper = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const paper = await generatePracticePaper(studentId);
    res.status(201).json({ success: true, data: paper });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate practice paper' });
  }
};

export const handleGenerateWeakAreaPaper = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const paper = await generateWeakAreaPaper(studentId);
    res.status(201).json({ success: true, data: paper });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate weak area paper' });
  }
};

export const handleGenerateExamReadinessPaper = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const paper = await generateExamReadinessPaper(studentId);
    res.status(201).json({ success: true, data: paper });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate exam readiness paper' });
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
    const summary = await getTeacherStudentExamSummary(teacherId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch teacher student exam summary' });
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
    const summary = await getParentStudentExamSummary(parentId, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Access denied' });
  }
};
