import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { assessmentService } from '../ai/assessment/service.js';
import { dataRepository } from '../repositories/data.repository.js';

// --- TEACHER CONTROLLERS ---
export const createAssessment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const assessment = await assessmentService.createAssessment(teacherId, req.body);
    res.status(201).json({ success: true, data: assessment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create assessment' });
  }
};

export const getTeacherAssessments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const assessments = await assessmentService.getTeacherAssessments(teacherId);
    res.json({ success: true, data: assessments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssessmentById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await dataRepository.getAssessmentById(assessmentId);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });
    res.json({ success: true, data: assessment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAssessment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const { assessmentId } = req.params;
    const assessment = await assessmentService.updateAssessment(assessmentId, teacherId, req.body);
    res.json({ success: true, data: assessment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const publishAssessment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const { assessmentId } = req.params;
    const assessment = await assessmentService.publishAssessment(assessmentId, teacherId);
    res.json({ success: true, data: assessment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const closeAssessment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const { assessmentId } = req.params;
    const assessment = await assessmentService.closeAssessment(assessmentId, teacherId);
    res.json({ success: true, data: assessment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const reopenAssessment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const { assessmentId } = req.params;
    const assessment = await assessmentService.reopenAssessment(assessmentId, teacherId);
    res.json({ success: true, data: assessment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addQuestionToAssessment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const { assessmentId } = req.params;
    const question = await assessmentService.addQuestionToAssessment(teacherId, assessmentId, req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createRubric = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const rubric = await assessmentService.createRubric(teacherId, req.body);
    res.status(201).json({ success: true, data: rubric });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAssessmentSubmissions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const { assessmentId } = req.params;
    const submissions = await assessmentService.getAssessmentSubmissions(assessmentId, teacherId);
    res.json({ success: true, data: submissions });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

export const getSubmissionById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { submissionId } = req.params;
    const submission = await dataRepository.getAssessmentSubmissionById(submissionId);
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
    res.json({ success: true, data: submission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubmissionAIEvaluation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { submissionId } = req.params;
    const evaluations = await dataRepository.getAIEvaluationsBySubmission(submissionId);
    res.json({ success: true, data: evaluations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveAIEvaluation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const { submissionId } = req.params;
    const grade = await assessmentService.approveAIEvaluation(submissionId, teacherId);
    res.json({ success: true, data: grade });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const modifyAndFinalizeGrade = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const { submissionId } = req.params;
    const grade = await assessmentService.modifyAndFinalizeGrade(submissionId, teacherId, {
      submissionId,
      teacherId,
      ...req.body,
    });
    res.json({ success: true, data: grade });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAssessmentAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const { assessmentId } = req.params;
    const analytics = await assessmentService.getAssessmentAnalytics(assessmentId, teacherId);
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- STUDENT CONTROLLERS ---
export const getStudentAssessments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const assessments = await assessmentService.getStudentAssessments(studentId);
    res.json({ success: true, data: assessments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssessmentForStudent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { assessmentId } = req.params;
    const assessment = await assessmentService.getAssessmentForStudent(assessmentId, studentId);
    res.json({ success: true, data: assessment });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

export const getAssessmentQuestionsForStudent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { assessmentId } = req.params;
    const questions = await assessmentService.getAssessmentQuestionsForStudent(assessmentId, studentId);
    res.json({ success: true, data: questions });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

export const saveDraftSubmission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { assessmentId } = req.params;
    const { answers } = req.body;
    const submission = await assessmentService.saveDraftSubmission(assessmentId, studentId, answers || []);
    res.json({ success: true, data: submission });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const submitAssessment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { assessmentId } = req.params;
    const { answers } = req.body;
    const result = await assessmentService.submitAssessment(assessmentId, studentId, answers || []);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStudentSubmissionResult = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { submissionId } = req.params;
    const result = await assessmentService.getStudentSubmissionResult(submissionId, studentId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// --- PARENT CONTROLLERS ---
export const getParentStudentSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parentId = req.user!.id;
    const { studentId } = req.params;

    const isLinked = await dataRepository.checkParentStudentLinkActive(parentId, studentId);
    if (!isLinked) {
      return res.status(403).json({ success: false, message: 'Access denied. Active parent link required.' });
    }

    const summary = await assessmentService.getParentStudentSummary(studentId);
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
