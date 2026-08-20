import { Request, Response } from 'express';
import { classroomIntelligenceService } from '../ai/classroom-intelligence/service.js';

export class ClassroomIntelligenceController {
  static async getClasses(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const classes = await classroomIntelligenceService.getTeacherClasses(teacherId);
      res.json({ success: true, data: classes });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const overview = await classroomIntelligenceService.getClassOverview(classId, teacherId);
      res.json({ success: true, data: overview });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const students = await classroomIntelligenceService.getClassStudents(classId, teacherId);
      res.json({ success: true, data: students });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getSubjects(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const subjects = await classroomIntelligenceService.getClassSubjects(classId, teacherId);
      res.json({ success: true, data: subjects });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getTopics(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const topics = await classroomIntelligenceService.getClassTopics(classId, teacherId);
      res.json({ success: true, data: topics });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getGaps(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const gaps = await classroomIntelligenceService.getClassGaps(classId, teacherId);
      res.json({ success: true, data: gaps });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getMisconceptions(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const misconceptions = await classroomIntelligenceService.getClassMisconceptions(classId, teacherId);
      res.json({ success: true, data: misconceptions });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAssessments(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const assessments = await classroomIntelligenceService.getClassAssessments(classId, teacherId);
      res.json({ success: true, data: assessments });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getRisk(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const risk = await classroomIntelligenceService.getClassRisk(classId, teacherId);
      res.json({ success: true, data: risk });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getVelocity(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const velocity = await classroomIntelligenceService.getClassVelocity(classId, teacherId);
      res.json({ success: true, data: velocity });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getActionPlan(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const plan = await classroomIntelligenceService.getClassActionPlan(classId, teacherId);
      res.json({ success: true, data: plan });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getInsights(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const insights = await classroomIntelligenceService.getClassInsights(classId, teacherId);
      res.json({ success: true, data: insights });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async createIntervention(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const intervention = await classroomIntelligenceService.createIntervention(teacherId, classId, req.body);
      res.status(201).json({ success: true, data: intervention });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getInterventions(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const interventions = await classroomIntelligenceService.getClassInterventions(classId, teacherId);
      res.json({ success: true, data: interventions });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async startIntervention(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { interventionId } = req.params;
      const intervention = await classroomIntelligenceService.startIntervention(interventionId, teacherId);
      res.json({ success: true, data: intervention });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async completeIntervention(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { interventionId } = req.params;
      const { teacherNotes } = req.body;
      const intervention = await classroomIntelligenceService.completeIntervention(interventionId, teacherId, teacherNotes);
      res.json({ success: true, data: intervention });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async dismissIntervention(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { interventionId } = req.params;
      const intervention = await classroomIntelligenceService.dismissIntervention(interventionId, teacherId);
      res.json({ success: true, data: intervention });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getEffectiveness(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { interventionId } = req.params;
      const effectiveness = await classroomIntelligenceService.getInterventionEffectiveness(interventionId, teacherId);
      res.json({ success: true, data: effectiveness });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async askCopilot(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { classId } = req.params;
      const { query } = req.body;
      const answer = await classroomIntelligenceService.askCopilot(classId, teacherId, query);
      res.json({ success: true, data: answer });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getComparison(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const comparison = await classroomIntelligenceService.getClassComparison(teacherId);
      res.json({ success: true, data: comparison });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
