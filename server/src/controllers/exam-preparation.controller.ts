import { Request, Response } from 'express';
import { dataRepository } from '../repositories/data.repository.js';
import { ExamReadinessEngine } from '../ai/exam-preparation/readiness.js';
import { ExamPriorityEngine } from '../ai/exam-preparation/priorities.js';
import { ExamRoadmapEngine } from '../ai/exam-preparation/roadmap.js';
import { AdaptiveMockExamEngine } from '../ai/exam-preparation/mock-engine.js';
import { ExamStrategyEngine } from '../ai/exam-preparation/strategy.js';
import { ExamGapAnalysisEngine } from '../ai/exam-preparation/gap-analysis.js';
import { ExamImprovementEngine } from '../ai/exam-preparation/improvement.js';
import { ExamRiskEngine } from '../ai/exam-preparation/risk.js';
import { AIExamCoach } from '../ai/exam-preparation/ai-coach.js';
import { ExamAnalyticsEngine } from '../ai/exam-preparation/analytics.js';

export class ExamPreparationController {
  // --- STUDENT ENDPOINTS ---

  static async getStudentExamPreparation(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';

      let plan = await dataRepository.getStudentExamPlan(studentId);
      if (!plan) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);

        plan = await dataRepository.createStudentExamPlan({
          planId: `plan_${Date.now()}`,
          studentId,
          examId: 'exam_cbse_10_math',
          targetScore: 90,
          currentReadinessScore: 65,
          currentRiskLevel: 'low',
          targetExamDate: targetDate,
          availableDailyMinutes: 120,
          status: 'active',
        });
      }

      let profile = await dataRepository.getExamProfile(plan.examId);
      if (!profile) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);
        profile = {
          examId: 'exam_cbse_10_math',
          examName: 'Class 10 CBSE Mathematics Board Exam',
          board: 'CBSE',
          classLevel: 10,
          subject: 'Mathematics',
          examDate: targetDate,
          durationMinutes: 180,
          totalMarks: 80,
          passingMarks: 26,
          questionCount: 30,
          status: 'active',
          officialSourceUrl: 'https://cbse.gov.in',
        };
      }

      const syllabusItems = await dataRepository.getExamSyllabus(plan.examId);
      const masteryMap: Record<string, number> = { math_polynomials: 75, math_quadratic: 55, sci_light_reflection: 60 };

      const readiness = ExamReadinessEngine.calculateReadiness({
        masteryMap,
        totalSyllabusConcepts: syllabusItems.length || 10,
        practiceAccuracyPct: 70,
        mockScores: [65, 72],
        revisionCompletionPct: 80,
        targetExamDate: plan.targetExamDate,
      });

      const priorities = ExamPriorityEngine.rankPriorities({
        syllabusItems: syllabusItems.length > 0 ? syllabusItems : [
          { conceptId: 'math_quadratic', subject: 'Mathematics', topic: 'Quadratic Equations', weightage: 15 },
          { conceptId: 'math_polynomials', subject: 'Mathematics', topic: 'Polynomials', weightage: 12 },
          { conceptId: 'sci_light_reflection', subject: 'Science', topic: 'Light - Reflection', weightage: 10 },
        ],
        masteryMap,
        prerequisiteGaps: ['math_quadratic'],
        riskConcepts: ['math_quadratic'],
        overdueRevisions: [],
        weakMockConcepts: ['math_quadratic'],
      });

      const todayPlan = ExamRoadmapEngine.generateTodayPlan(priorities, plan.availableDailyMinutes);
      const weeklyPlan = ExamRoadmapEngine.generateWeeklyPlan(priorities, plan.availableDailyMinutes);
      const gaps = ExamGapAnalysisEngine.analyzeGaps({
        masteryMap,
        prerequisiteGaps: ['math_quadratic'],
        overdueRevisions: [],
        recentMockAccuracyPct: 68,
      });

      const risks = ExamRiskEngine.assessRisks({
        daysRemaining: readiness.daysRemaining,
        readinessScore: readiness.readinessScore,
        prerequisiteGapsCount: 1,
        overdueRevisionsCount: 0,
        mockAttemptsCount: 2,
      });

      const prediction = ExamImprovementEngine.generateImprovementPlan({
        currentReadinessScore: readiness.readinessScore,
        gapsCount: gaps.length,
        topWeakTopics: ['Quadratic Equations'],
      });

      const coach = AIExamCoach.generateGuidance({
        examName: profile.examName,
        readiness,
        topPriority: priorities[0],
        daysRemaining: readiness.daysRemaining,
      });

      res.status(200).json({
        success: true,
        data: {
          plan,
          profile,
          readiness,
          priorities,
          todayPlan,
          weeklyPlan,
          gaps,
          risks,
          prediction,
          coach,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch exam preparation' });
    }
  }

  static async createOrUpdatePlan(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const planData = req.body;

      const plan = await dataRepository.createStudentExamPlan({
        ...planData,
        planId: `plan_${Date.now()}`,
        studentId,
        status: 'active',
      });

      res.status(200).json({ success: true, data: plan });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update plan' });
    }
  }

  static async getReadiness(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const plan = await dataRepository.getStudentExamPlan(studentId);
      const targetDate = plan?.targetExamDate || new Date(Date.now() + 30 * 86400000);

      const readiness = ExamReadinessEngine.calculateReadiness({
        masteryMap: { math_polynomials: 75, math_quadratic: 55 },
        totalSyllabusConcepts: 10,
        practiceAccuracyPct: 70,
        mockScores: [68, 74],
        revisionCompletionPct: 80,
        targetExamDate: targetDate,
      });

      res.status(200).json({ success: true, data: readiness });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch readiness' });
    }
  }

  static async getPriorities(req: Request, res: Response): Promise<void> {
    try {
      const priorities = ExamPriorityEngine.rankPriorities({
        syllabusItems: [
          { conceptId: 'math_quadratic', subject: 'Mathematics', topic: 'Quadratic Equations', weightage: 15 },
          { conceptId: 'math_polynomials', subject: 'Mathematics', topic: 'Polynomials', weightage: 12 },
        ],
        masteryMap: { math_polynomials: 75, math_quadratic: 55 },
        prerequisiteGaps: ['math_quadratic'],
        riskConcepts: ['math_quadratic'],
        overdueRevisions: [],
        weakMockConcepts: ['math_quadratic'],
      });

      res.status(200).json({ success: true, data: priorities });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch priorities' });
    }
  }

  static async getTodayPlan(req: Request, res: Response): Promise<void> {
    try {
      const priorities = ExamPriorityEngine.rankPriorities({
        syllabusItems: [{ conceptId: 'math_quadratic', subject: 'Mathematics', topic: 'Quadratic Equations', weightage: 15 }],
        masteryMap: { math_quadratic: 55 },
        prerequisiteGaps: ['math_quadratic'],
        riskConcepts: [],
        overdueRevisions: [],
        weakMockConcepts: [],
      });
      const today = ExamRoadmapEngine.generateTodayPlan(priorities, 120);
      res.status(200).json({ success: true, data: today });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch today plan' });
    }
  }

  static async getWeeklyPlan(req: Request, res: Response): Promise<void> {
    try {
      const priorities = ExamPriorityEngine.rankPriorities({
        syllabusItems: [{ conceptId: 'math_quadratic', subject: 'Mathematics', topic: 'Quadratic Equations', weightage: 15 }],
        masteryMap: { math_quadratic: 55 },
        prerequisiteGaps: ['math_quadratic'],
        riskConcepts: [],
        overdueRevisions: [],
        weakMockConcepts: [],
      });
      const week = ExamRoadmapEngine.generateWeeklyPlan(priorities, 120);
      res.status(200).json({ success: true, data: week });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch weekly plan' });
    }
  }

  static async getGaps(req: Request, res: Response): Promise<void> {
    try {
      const gaps = ExamGapAnalysisEngine.analyzeGaps({
        masteryMap: { math_quadratic: 55 },
        prerequisiteGaps: ['math_quadratic'],
        overdueRevisions: [],
        recentMockAccuracyPct: 65,
      });
      res.status(200).json({ success: true, data: gaps });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch gaps' });
    }
  }

  static async getMockRecommendation(req: Request, res: Response): Promise<void> {
    try {
      const plan = AdaptiveMockExamEngine.createMockPlan({
        mockType: 'sectional',
        readinessScore: 68,
        daysRemaining: 25,
        weakTopics: ['Quadratic Equations'],
      });
      res.status(200).json({ success: true, data: plan });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch mock recommendation' });
    }
  }

  static async generateMockExam(req: Request, res: Response): Promise<void> {
    try {
      const { mockType, subject } = req.body;
      const result = await AdaptiveMockExamEngine.generateMockAssessment({
        subject: subject || 'Mathematics',
        classLevel: 10,
        board: 'CBSE',
        totalQuestions: 5,
        totalMarks: 20,
        durationMinutes: 30,
      });
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to generate mock exam' });
    }
  }

  static async getExamStrategy(req: Request, res: Response): Promise<void> {
    try {
      const strategy = ExamStrategyEngine.getStrategy('Mathematics', 180);
      res.status(200).json({ success: true, data: strategy });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch strategy' });
    }
  }

  static async getExamResources(req: Request, res: Response): Promise<void> {
    try {
      const resources = [
        {
          resourceId: 'res_ncert_math_ch4',
          title: 'NCERT Class 10 Chapter 4: Quadratic Equations',
          type: 'textbook',
          officialSourceUrl: 'https://ncert.nic.in',
          publisher: 'NCERT Official',
        },
      ];
      res.status(200).json({ success: true, data: resources });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch resources' });
    }
  }

  static async getExamSummary(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const summary = await dataRepository.getExamPreparationSummary(studentId);
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch summary' });
    }
  }

  // --- TEACHER ENDPOINTS ---

  static async getTeacherExamOverview(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: {
          classReadinessAvg: 72,
          totalStudents: 35,
          highRiskStudentsCount: 4,
          upcomingExams: [
            { examName: 'Class 10 CBSE Math Board', examDate: new Date(Date.now() + 30 * 86400000) },
          ],
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch teacher overview' });
    }
  }

  static async getClassExamPreparation(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      res.status(200).json({
        success: true,
        data: {
          classId,
          averageReadiness: 72,
          weakTopics: ['Quadratic Equations', 'Light - Refraction'],
          studentProgress: [
            { studentId: 'student_1', name: 'Student 1', readinessScore: 68, riskLevel: 'low' },
          ],
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch class preparation' });
    }
  }

  static async getStudentExamPreparationForTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const summary = await dataRepository.getExamPreparationSummary(studentId);
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch student preparation' });
    }
  }

  static async assignMockExamToStudent(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const { mockType, subject } = req.body;
      const mock = await AdaptiveMockExamEngine.generateMockAssessment({
        subject: subject || 'Mathematics',
        classLevel: 10,
        board: 'CBSE',
      });
      res.status(201).json({ success: true, data: { studentId, mock } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to assign mock exam' });
    }
  }

  static async getClassExamAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const analytics = ExamAnalyticsEngine.calculateAnalytics({
        masteryMap: { math_polynomials: 75, math_quadratic: 55 },
        mockHistory: [{ score: 65, date: new Date() }, { score: 72, date: new Date() }],
        daysRemaining: 30,
      });
      res.status(200).json({ success: true, data: { classId, analytics } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch analytics' });
    }
  }

  // --- PARENT ENDPOINTS ---

  static async getParentChildExamPreparation(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const parentId = (req as any).user?.id || (req as any).user?.userId;

      const isLinked = await dataRepository.verifyParentStudentLink(parentId, studentId);
      if (!isLinked && parentId) {
        res.status(403).json({ success: false, message: 'Unauthorized access to student exam records' });
        return;
      }

      const summary = await dataRepository.getExamPreparationSummary(studentId);
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch child exam preparation' });
    }
  }

  static async getParentChildExamReadiness(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const parentId = (req as any).user?.id || (req as any).user?.userId;

      const isLinked = await dataRepository.verifyParentStudentLink(parentId, studentId);
      if (!isLinked && parentId) {
        res.status(403).json({ success: false, message: 'Unauthorized access to student exam records' });
        return;
      }

      const plan = await dataRepository.getStudentExamPlan(studentId);
      const readiness = ExamReadinessEngine.calculateReadiness({
        masteryMap: { math_polynomials: 75, math_quadratic: 55 },
        totalSyllabusConcepts: 10,
        practiceAccuracyPct: 70,
        mockScores: [68, 74],
        revisionCompletionPct: 80,
        targetExamDate: plan?.targetExamDate || new Date(Date.now() + 30 * 86400000),
      });

      res.status(200).json({ success: true, data: readiness });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch child readiness' });
    }
  }
}
