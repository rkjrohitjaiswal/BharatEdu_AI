import { Request, Response } from 'express';
import { dataRepository } from '../repositories/data.repository.js';
import { EffectivenessAnalyticsEngine } from '../ai/effectiveness/analytics.js';
import { CohortEffectivenessEngine } from '../ai/effectiveness/cohort.js';

export class LearningEffectivenessController {
  // --- STUDENT ENDPOINTS ---

  static async getStudentEffectiveness(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const summary = await EffectivenessAnalyticsEngine.generateStudentSummary(studentId);
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch student effectiveness' });
    }
  }

  static async getActionEffectiveness(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const summary = await EffectivenessAnalyticsEngine.generateStudentSummary(studentId);
      res.status(200).json({ success: true, data: summary.actionMetrics });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch action effectiveness' });
    }
  }

  static async getConceptEffectiveness(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const summary = await EffectivenessAnalyticsEngine.generateStudentSummary(studentId);
      res.status(200).json({ success: true, data: summary.conceptAssociations });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch concept effectiveness' });
    }
  }

  static async getStudentOutcomes(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const outcomes = await dataRepository.getStudentLearningOutcomes(studentId);
      res.status(200).json({ success: true, data: outcomes });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch student outcomes' });
    }
  }

  static async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const summary = await EffectivenessAnalyticsEngine.generateStudentSummary(studentId);
      res.status(200).json({
        success: true,
        data: {
          strongestInterventions: summary.strongestInterventions,
          weakestInterventions: summary.weakestInterventions,
          insufficientEvidence: summary.insufficientEvidence,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch recommendations' });
    }
  }

  static async getEffectivenessSummary(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const summary = await EffectivenessAnalyticsEngine.generateStudentSummary(studentId);
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch summary' });
    }
  }

  static async refreshStudentEffectiveness(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user?.id || (req as any).user?.userId || 'student_1';
      const summary = await EffectivenessAnalyticsEngine.generateStudentSummary(studentId);
      await dataRepository.createEffectivenessSnapshot({
        snapshotId: `snap_${Date.now()}`,
        studentId,
        date: new Date(),
        overallEffectivenessScore: summary.overallEffectivenessScore,
        strongestInterventions: summary.strongestInterventions,
        weakestInterventions: summary.weakestInterventions,
        insufficientEvidence: summary.insufficientEvidence,
        completionRate: summary.completionRatePct,
        improvementRate: summary.improvementRatePct,
        retentionRate: summary.retentionRatePct,
        studyEfficiency: summary.studyEfficiencyPct,
        assessmentTransfer: summary.assessmentTransferScore,
        confidence: summary.confidence,
      });
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to refresh effectiveness' });
    }
  }

  // --- TEACHER ENDPOINTS ---

  static async getTeacherEffectiveness(req: Request, res: Response): Promise<void> {
    try {
      const summary = CohortEffectivenessEngine.getTeacherCohortSummary('class_10a');
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch teacher effectiveness' });
    }
  }

  static async getClassEffectiveness(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const summary = CohortEffectivenessEngine.getTeacherCohortSummary(classId);
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch class effectiveness' });
    }
  }

  static async getStudentEffectivenessForTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const summary = await EffectivenessAnalyticsEngine.generateStudentSummary(studentId);
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch student effectiveness for teacher' });
    }
  }

  // --- PARENT ENDPOINTS ---

  static async getParentChildEffectiveness(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const parentId = (req as any).user?.id || (req as any).user?.userId;

      const isLinked = await dataRepository.verifyParentStudentLink(parentId, studentId);
      if (!isLinked && parentId) {
        res.status(403).json({ success: false, message: 'Unauthorized access to child effectiveness data' });
        return;
      }

      const summary = await EffectivenessAnalyticsEngine.generateStudentSummary(studentId);
      res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch child effectiveness' });
    }
  }
}
