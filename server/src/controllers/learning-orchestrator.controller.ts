import { Request, Response } from 'express';
import { dataRepository } from '../repositories/data.repository.js';
import { LearningOrchestratorEngine } from '../ai/learning-orchestrator/orchestrator.js';
import { OrchestratorAnalyticsEngine } from '../ai/learning-orchestrator/analytics.js';

export class LearningOrchestratorController {
  // --- STUDENT ENDPOINTS ---

  static async getStudentOrchestrator(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const existingPlan = await dataRepository.getOrchestrationPlan(studentId);
      if (existingPlan) {
        res.status(200).json({ success: true, data: existingPlan });
        return;
      }
      const newPlan = await LearningOrchestratorEngine.generatePlan(studentId);
      await dataRepository.createOrchestrationPlan(newPlan);
      res.status(200).json({ success: true, data: newPlan });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch student orchestrator' });
    }
  }

  static async getStudentTodayPlan(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const plan = (await dataRepository.getOrchestrationPlan(studentId)) || (await LearningOrchestratorEngine.generatePlan(studentId));
      res.status(200).json({ success: true, data: plan.dailyPlan });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch today plan' });
    }
  }

  static async getStudentWeekPlan(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const plan = (await dataRepository.getOrchestrationPlan(studentId)) || (await LearningOrchestratorEngine.generatePlan(studentId));
      res.status(200).json({ success: true, data: plan.weeklyPlan });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch week plan' });
    }
  }

  static async getNextBestAction(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const plan = (await dataRepository.getOrchestrationPlan(studentId)) || (await LearningOrchestratorEngine.generatePlan(studentId));
      res.status(200).json({ success: true, data: plan.nextBestAction });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch next best action' });
    }
  }

  static async getOrchestratorInsights(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const plan = (await dataRepository.getOrchestrationPlan(studentId)) || (await LearningOrchestratorEngine.generatePlan(studentId));
      res.status(200).json({ success: true, data: plan.insight });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch insights' });
    }
  }

  static async refreshStudentPlan(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const newPlan = await LearningOrchestratorEngine.generatePlan(studentId);
      await dataRepository.createOrchestrationPlan(newPlan);
      res.status(200).json({ success: true, data: newPlan });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to refresh plan' });
    }
  }

  static async startAction(req: Request, res: Response): Promise<void> {
    try {
      const { actionId } = req.params;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const updated = await dataRepository.updateOrchestrationAction(studentId, actionId, { status: 'started' });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to start action' });
    }
  }

  static async completeAction(req: Request, res: Response): Promise<void> {
    try {
      const { actionId } = req.params;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const updated = await dataRepository.completeOrchestrationAction(studentId, actionId);
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to complete action' });
    }
  }

  static async skipAction(req: Request, res: Response): Promise<void> {
    try {
      const { actionId } = req.params;
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const updated = await dataRepository.skipOrchestrationAction(studentId, actionId);
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to skip action' });
    }
  }

  // --- TEACHER ENDPOINTS ---

  static async getTeacherOrchestrator(req: Request, res: Response): Promise<void> {
    try {
      const overview = {
        totalStudents: 32,
        criticalStudents: 2,
        highPriorityStudents: 5,
        commonBlocker: 'Quadratic Equation Factorization',
        commonWeakConcept: 'Light Reflection Ray Diagrams',
      };
      res.status(200).json({ success: true, data: overview });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch teacher orchestrator' });
    }
  }

  static async getClassOrchestrator(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const classData = {
        classId,
        className: 'Class 10-A',
        overallStatus: 'needs_attention',
        studentsNeedingInterventionCount: 3,
      };
      res.status(200).json({ success: true, data: classData });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch class orchestrator' });
    }
  }

  static async getStudentOrchestratorForTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const plan = await LearningOrchestratorEngine.generatePlan(studentId);
      res.status(200).json({ success: true, data: plan });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch student orchestrator for teacher' });
    }
  }

  // --- PARENT ENDPOINTS ---

  static async getParentChildOrchestrator(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const parentId = (req as any).user?.id || (req as any).user?.userId;

      const isLinked = await dataRepository.verifyParentStudentLink(parentId, studentId);
      if (!isLinked && parentId) {
        res.status(403).json({ success: false, message: 'Unauthorized access to student orchestrator' });
        return;
      }

      const plan = await LearningOrchestratorEngine.generatePlan(studentId);
      res.status(200).json({ success: true, data: plan });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch child orchestrator' });
    }
  }

  static async getParentChildTodayPlan(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const parentId = (req as any).user?.id || (req as any).user?.userId;

      const isLinked = await dataRepository.verifyParentStudentLink(parentId, studentId);
      if (!isLinked && parentId) {
        res.status(403).json({ success: false, message: 'Unauthorized access to child today plan' });
        return;
      }

      const plan = await LearningOrchestratorEngine.generatePlan(studentId);
      res.status(200).json({ success: true, data: plan.dailyPlan });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch child today plan' });
    }
  }
}
