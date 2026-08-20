import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { mockExamService } from '../ai/exam-simulator/service.js';
import { dataRepository } from '../repositories/data.repository.js';

export const getExamRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const data = await mockExamService.getExamRecommendations(studentId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch exam recommendations' });
  }
};

export const createMockExam = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const config = req.body || {};
    const data = await mockExamService.createMockExam(studentId, config);
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create mock exam' });
  }
};

export const getMockExamById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { examId } = req.params;
    const exam = await dataRepository.getMockExamById(examId);
    if (!exam) return res.status(404).json({ success: false, message: 'Mock exam not found' });
    res.json({ success: true, data: exam });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMockExamInstructions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { examId } = req.params;
    const data = await mockExamService.getMockExamInstructions(examId, studentId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const startMockExam = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { examId } = req.params;
    const data = await mockExamService.startMockExam(examId, studentId);
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMockExamQuestion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { examId, questionNumber } = req.params;
    const qNum = parseInt(questionNumber, 10) || 1;
    const data = await mockExamService.getExamQuestion(examId, qNum, studentId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const submitAnswer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { examId } = req.params;
    const { questionNumber, selectedAnswer } = req.body;
    const data = await mockExamService.submitAnswer(examId, studentId, { questionNumber, selectedAnswer });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const autosaveExam = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { examId } = req.params;
    const data = await mockExamService.autosave(examId, studentId, req.body);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitExam = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { examId } = req.params;
    const data = await mockExamService.submitExam(examId, studentId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMockExamResult = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { examId } = req.params;
    const data = await mockExamService.getExamResult(examId, studentId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getStudentExamHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const data = await mockExamService.getStudentExamHistory(studentId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherStudentSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentId } = req.params;
    const data = await mockExamService.getTeacherSummary(studentId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getParentStudentSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parentId = req.user!.id;
    const { studentId } = req.params;

    const isLinked = await dataRepository.checkParentStudentLinkActive(parentId, studentId);
    if (!isLinked) {
      return res.status(403).json({ success: false, message: 'Access denied. Active parent link required.' });
    }

    const data = await mockExamService.getParentSummary(studentId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
