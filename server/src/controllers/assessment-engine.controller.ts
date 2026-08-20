import { Request, Response } from 'express';
import { dataRepository } from '../repositories/data.repository.js';
import { AssessmentEngine } from '../ai/assessment-engine/engine.js';
import { QuestionGenerator, VERIFIED_ASSESSMENT_QUESTION_BANK } from '../ai/assessment-engine/question-generator.js';
import { QuestionValidator } from '../ai/assessment-engine/question-validator.js';
import { QuestionQualityEngine } from '../ai/assessment-engine/quality.js';
import { AssessmentScoringEngine } from '../ai/assessment-engine/scoring.js';
import { AssessmentAnalyticsEngine } from '../ai/assessment-engine/analytics.js';
import { AssessmentRecommendationEngine } from '../ai/assessment-engine/recommendations.js';
import { AIAssessmentCoach } from '../ai/assessment-engine/ai-coach.js';

export class AssessmentEngineController {
  // --- STUDENT ENDPOINTS ---

  static async getStudentAssessments(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      let assessments = await dataRepository.getEngineAssessments({ studentId });

      if (!assessments || assessments.length === 0) {
        // Seed initial student assessment if empty
        const sample = await dataRepository.createEngineAssessment({
          assessmentId: `ass_stu_seed_${Date.now()}`,
          studentId,
          title: 'Class 10 Mathematics Diagnostic Assessment',
          description: 'Adaptive diagnostic test covering Polynomials & Quadratic Equations.',
          subject: 'Mathematics',
          classLevel: 10,
          board: 'CBSE',
          assessmentType: 'diagnostic',
          durationMinutes: 30,
          totalQuestions: 5,
          totalMarks: 20,
          passingMarks: 8,
          status: 'published',
          source: 'system',
        });
        assessments = [sample];
      }

      res.status(200).json({ success: true, data: assessments });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch student assessments' });
    }
  }

  static async getStudentAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId } = req.params;
      const studentId = (req as any).user?.id || (req as any).user?.userId;

      let assessment = await dataRepository.getEngineAssessment(assessmentId);
      if (!assessment) {
        // Fallback default sample assessment
        assessment = {
          assessmentId,
          studentId,
          title: 'Class 10 Diagnostic Assessment',
          description: 'Adaptive diagnostic test.',
          subject: 'Mathematics',
          classLevel: 10,
          board: 'CBSE',
          assessmentType: 'diagnostic',
          durationMinutes: 30,
          totalQuestions: 5,
          totalMarks: 20,
          passingMarks: 8,
          status: 'published',
          source: 'system',
        };
      }

      let questions = await dataRepository.getEngineAssessmentQuestions(assessmentId);
      if (!questions || questions.length === 0) {
        questions = VERIFIED_ASSESSMENT_QUESTION_BANK;
      }

      // SECURITY CRITICAL: Strip correctAnswer from student-facing responses!
      const sanitizedQuestions = questions.map((q: any) => {
        const { correctAnswer, solutionSteps, ...safeQ } = q._doc || q;
        return safeQ;
      });

      res.status(200).json({
        success: true,
        data: {
          assessment,
          questions: sanitizedQuestions,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch assessment' });
    }
  }

  static async startAssessmentAttempt(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId } = req.params;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';

      let attempt = await dataRepository.createEngineAssessmentAttempt({
        attemptId: `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        assessmentId,
        studentId,
        startedAt: new Date(),
        status: 'in_progress',
      });

      res.status(200).json({ success: true, data: attempt });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to start attempt' });
    }
  }

  static async recordQuestionAnswer(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId, questionId } = req.params;
      const { attemptId, answer, timeSpentSeconds } = req.body;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';

      const response = await dataRepository.createEngineAssessmentResponse({
        responseId: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        attemptId: attemptId || `att_${assessmentId}`,
        questionId,
        studentId,
        answer,
        timeSpentSeconds: timeSpentSeconds || 30,
        submittedAt: new Date(),
      });

      res.status(200).json({ success: true, data: response });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to record answer' });
    }
  }

  static async recordQuestionFlag(req: Request, res: Response): Promise<void> {
    try {
      const { questionId } = req.params;
      const { isFlagged } = req.body;
      res.status(200).json({ success: true, data: { questionId, isFlagged: !!isFlagged } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to flag question' });
    }
  }

  static async recordQuestionConfidence(req: Request, res: Response): Promise<void> {
    try {
      const { questionId } = req.params;
      const { confidence } = req.body;
      res.status(200).json({ success: true, data: { questionId, confidence: confidence || 'medium' } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to record confidence' });
    }
  }

  static async submitAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId } = req.params;
      const { attemptId, responses } = req.body;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';

      const targetAttemptId = attemptId || `att_${Date.now()}`;
      const responseList = responses || (await dataRepository.getEngineAssessmentResponses(targetAttemptId));

      const result = await AssessmentEngine.evaluateAttempt(targetAttemptId, assessmentId, studentId, responseList);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to submit assessment' });
    }
  }

  static async getAssessmentResult(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId } = req.params;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';

      const result = await dataRepository.getEngineAssessmentResult(assessmentId, studentId);
      if (!result) {
        // Evaluate default fallback
        const mockResult = await AssessmentEngine.evaluateAttempt(`att_${Date.now()}`, assessmentId, studentId, [
          { questionId: 'q_math_poly_01', answer: '0', timeSpentSeconds: 20 },
          { questionId: 'q_math_poly_02', answer: '5', timeSpentSeconds: 40 },
        ]);
        res.status(200).json({ success: true, data: mockResult });
        return;
      }

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch result' });
    }
  }

  static async getStudentAssessmentRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId } = req.params;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';

      const savedAttempt = await dataRepository.getEngineAssessmentResult(assessmentId, studentId);
      const evalResult = savedAttempt?.conceptPerformance
        ? savedAttempt
        : await AssessmentEngine.evaluateAttempt(savedAttempt?.attemptId || `att_${Date.now()}`, assessmentId, studentId, []);

      const recommendations = AssessmentRecommendationEngine.generateRecommendations(evalResult);
      const aiCoachInsight = AIAssessmentCoach.generateInsight(evalResult);

      res.status(200).json({
        success: true,
        data: {
          recommendations,
          aiCoachInsight,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch recommendations' });
    }
  }

  // --- TEACHER ENDPOINTS ---

  static async getTeacherAssessments(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user?.id || (req as any).user?.userId || 'teacher_1';
      let list = await dataRepository.getEngineAssessments({ teacherId });

      if (!list || list.length === 0) {
        const sample = await dataRepository.createEngineAssessment({
          assessmentId: `ass_teach_${Date.now()}`,
          teacherId,
          classId: 'class_9a',
          title: 'Class 9 Formative Algebra Assessment',
          description: 'Curriculum-aligned formative assessment for Class 9 Mathematics.',
          subject: 'Mathematics',
          classLevel: 9,
          board: 'CBSE',
          assessmentType: 'formative',
          durationMinutes: 45,
          totalQuestions: 10,
          totalMarks: 40,
          passingMarks: 16,
          status: 'published',
          source: 'teacher',
        });
        list = [sample];
      }

      res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch teacher assessments' });
    }
  }

  static async createTeacherAssessment(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user?.id || (req as any).user?.userId || 'teacher_1';
      const assessmentData = req.body;

      const assessment = await dataRepository.createEngineAssessment({
        ...assessmentData,
        assessmentId: `ass_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        teacherId,
        status: assessmentData.status || 'draft',
        source: 'teacher',
        createdAt: new Date(),
      });

      res.status(201).json({ success: true, data: assessment });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create assessment' });
    }
  }

  static async generateAIAssessment(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user?.id || (req as any).user?.userId || 'teacher_1';
      const blueprint = req.body;

      const generatedQuestions = await AssessmentEngine.generateAssessmentQuestionsFromBlueprint(blueprint);

      const assessment = await dataRepository.createEngineAssessment({
        assessmentId: `ass_ai_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        teacherId,
        classId: blueprint.classId || 'class_9a',
        title: `AI Generated ${blueprint.subject || 'Academic'} Assessment`,
        description: `Automated assessment aligned with ${blueprint.board || 'CBSE'} Class ${blueprint.classLevel || 10} objectives.`,
        subject: blueprint.subject || 'Mathematics',
        classLevel: blueprint.classLevel || 10,
        board: blueprint.board || 'CBSE',
        assessmentType: 'formative',
        durationMinutes: blueprint.durationMinutes || 30,
        totalQuestions: generatedQuestions.length,
        totalMarks: blueprint.totalMarks || 40,
        passingMarks: Math.round((blueprint.totalMarks || 40) * 0.4),
        status: 'draft',
        source: 'ai',
      });

      for (const q of generatedQuestions) {
        await dataRepository.createEngineAssessmentQuestion({
          ...q,
          assessmentId: assessment.assessmentId,
        });
      }

      res.status(201).json({
        success: true,
        data: {
          assessment,
          questions: generatedQuestions,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to generate assessment' });
    }
  }

  static async getTeacherAssessmentDetail(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId } = req.params;
      const assessment = await dataRepository.getEngineAssessment(assessmentId);
      const questions = await dataRepository.getEngineAssessmentQuestions(assessmentId);

      res.status(200).json({
        success: true,
        data: {
          assessment,
          questions: questions.length > 0 ? questions : VERIFIED_ASSESSMENT_QUESTION_BANK,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch assessment detail' });
    }
  }

  static async updateTeacherAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId } = req.params;
      const updates = req.body;

      const updated = await dataRepository.updateEngineAssessment(assessmentId, updates);
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update assessment' });
    }
  }

  static async publishTeacherAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId } = req.params;

      const published = await dataRepository.updateEngineAssessment(assessmentId, {
        status: 'published',
        publishedAt: new Date(),
      });

      res.status(200).json({ success: true, data: published });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to publish assessment' });
    }
  }

  static async approveQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { questionId } = req.params;
      const updated = await dataRepository.updateEngineAssessmentQuestion(questionId, { validationStatus: 'approved' });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to approve question' });
    }
  }

  static async rejectQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { questionId } = req.params;
      const updated = await dataRepository.updateEngineAssessmentQuestion(questionId, { validationStatus: 'rejected' });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to reject question' });
    }
  }

  static async regenerateQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { questionId } = req.params;
      const existing = (await dataRepository.getEngineAssessmentQuestion(questionId)) || VERIFIED_ASSESSMENT_QUESTION_BANK[0];

      const newQuestion = await QuestionGenerator.generateAndValidateQuestion({
        subject: existing.subject,
        topic: existing.topic,
        conceptId: existing.conceptId,
        classLevel: 10,
        board: 'CBSE',
        difficulty: existing.difficulty,
        questionType: existing.questionType,
      });

      const updated = await dataRepository.updateEngineAssessmentQuestion(questionId, {
        ...newQuestion,
        validationStatus: 'approved',
      });

      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to regenerate question' });
    }
  }

  static async getTeacherAssessmentAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId } = req.params;
      const attempts = await dataRepository.getEngineAssessmentAttempts(assessmentId);
      const questions = await dataRepository.getEngineAssessmentQuestions(assessmentId);

      const analytics = AssessmentAnalyticsEngine.calculateClassAnalytics(
        attempts,
        questions.length > 0 ? questions : VERIFIED_ASSESSMENT_QUESTION_BANK
      );

      res.status(200).json({ success: true, data: analytics });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch assessment analytics' });
    }
  }

  static async getTeacherQuestionAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId } = req.params;
      const questions = await dataRepository.getEngineAssessmentQuestions(assessmentId);
      const responses = await dataRepository.getAllEngineAssessmentResponses(assessmentId);

      const qAnalytics = AssessmentAnalyticsEngine.calculateQuestionAnalytics(
        questions.length > 0 ? questions : VERIFIED_ASSESSMENT_QUESTION_BANK,
        responses
      );

      res.status(200).json({ success: true, data: qAnalytics });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch question analytics' });
    }
  }

  // --- PARENT ENDPOINTS ---

  static async getParentChildAssessments(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const parentId = (req as any).user?.id || (req as any).user?.userId;

      // Verify Parent-Student Link
      const isLinked = await dataRepository.verifyParentStudentLink(parentId, studentId);
      if (!isLinked && parentId) {
        res.status(403).json({ success: false, message: 'Unauthorized access to student assessment records' });
        return;
      }

      const assessments = await dataRepository.getEngineAssessments({ studentId });
      const safeAssessments = (assessments || []).map((a: any) => ({
        assessmentId: a.assessmentId,
        title: a.title,
        subject: a.subject,
        status: a.status,
        totalMarks: a.totalMarks,
        obtainedMarks: a.obtainedMarks || 0,
        percentage: a.percentage || 0,
        completedAt: a.completedAt,
      }));

      res.status(200).json({ success: true, data: safeAssessments });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch child assessments' });
    }
  }

  static async getParentChildAssessmentDetail(req: Request, res: Response): Promise<void> {
    try {
      const { studentId, assessmentId } = req.params;
      const parentId = (req as any).user?.id || (req as any).user?.userId;

      const isLinked = await dataRepository.verifyParentStudentLink(parentId, studentId);
      if (!isLinked && parentId) {
        res.status(403).json({ success: false, message: 'Unauthorized access to student assessment records' });
        return;
      }

      const assessment = await dataRepository.getEngineAssessment(assessmentId);
      const result = await dataRepository.getEngineAssessmentResult(assessmentId, studentId);

      res.status(200).json({
        success: true,
        data: {
          assessment,
          result,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch child assessment detail' });
    }
  }
}
