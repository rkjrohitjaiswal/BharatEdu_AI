import { Request, Response } from 'express';
import {
  createStudentAssessment,
  getAssessmentSummary,
  getNextQuestion,
  getParentStudentAssessmentSummary,
  getStudentAssessments,
  getTeacherStudentAssessmentSummary,
  submitAnswer,
} from '../ai/question-generator/service.js';

export const createAssessmentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { targetConceptId, assessmentType = 'adaptive_practice', questionCount = 5 } = req.body;
    const assessment = await createStudentAssessment(user.id, targetConceptId, assessmentType, questionCount);

    res.status(201).json({ success: true, data: assessment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to create assessment' });
  }
};

export const getNextQuestionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const result = await getNextQuestion(id, user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch next question' });
  }
};

export const submitAnswerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id, questionId } = req.params;
    const { selectedAnswer, responseTimeSeconds = 10, hintsUsed = 0 } = req.body;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (!selectedAnswer) {
      res.status(400).json({ success: false, message: 'Selected answer is required' });
      return;
    }

    const result = await submitAnswer(
      id,
      questionId,
      selectedAnswer,
      user.id,
      responseTimeSeconds,
      hintsUsed
    );

    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to submit answer' });
  }
};

export const completeAssessmentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const summary = await getAssessmentSummary(id, user.id);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to complete assessment' });
  }
};

export const getStudentAssessmentsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const assessments = await getStudentAssessments(user.id);
    res.status(200).json({ success: true, data: assessments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch student assessments' });
  }
};

export const getAssessmentSummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const summary = await getAssessmentSummary(id, user.id);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch assessment summary' });
  }
};

export const getRecommendedQuestionsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const assessment = await createStudentAssessment(user.id);
    const nextQ = await getNextQuestion(assessment.assessmentId, user.id);

    res.status(200).json({ success: true, data: { assessment, question: nextQ.question } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch recommended questions' });
  }
};

export const getTeacherStudentAssessmentSummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'Only teachers can access student assessment analytics' });
      return;
    }

    const summary = await getTeacherStudentAssessmentSummary(user.id, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'Failed to fetch teacher assessment summary' });
  }
};

export const getParentStudentAssessmentSummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { studentId } = req.params;

    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (user.role !== 'parent') {
      res.status(403).json({ success: false, message: 'Only parents can access student assessment analytics' });
      return;
    }

    const summary = await getParentStudentAssessmentSummary(user.id, studentId);
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error?.message || 'Access denied for parent assessment summary' });
  }
};
