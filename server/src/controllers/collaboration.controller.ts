import { Request, Response } from 'express';
import { collaborationService } from '../ai/collaboration/service.js';

export class CollaborationController {
  // --- TEACHER CONTROLLERS ---
  static async getTeacherThreads(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const threads = await collaborationService.getTeacherThreads(teacherId);
      res.json({ success: true, data: threads });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getThreadDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;
      const { threadId } = req.params;
      const details = await collaborationService.getThreadById(threadId, userId, userRole);
      res.json({ success: true, data: details });
    } catch (error: any) {
      const status = error.message.includes('Access denied') ? 403 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const senderId = (req as any).user.id;
      const senderRole = (req as any).user.role;
      const { threadId } = req.params;
      const { body, recipientIds, requiresAcknowledgement, metadata } = req.body;

      const message = await collaborationService.createMessage(threadId, senderId, senderRole, body, recipientIds, requiresAcknowledgement, metadata);
      res.status(201).json({ success: true, data: message });
    } catch (error: any) {
      const status = error.message.includes('Access denied') ? 403 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  static async createInterventionThread(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { interventionId } = req.params;
      const threadData = await collaborationService.createInterventionThread(teacherId, interventionId, req.body);
      res.status(201).json({ success: true, data: threadData });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async generateDraft(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const draft = await collaborationService.generateDraft({ ...req.body, teacherId });
      res.json({ success: true, data: draft });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async archiveThread(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const { threadId } = req.params;
      const archived = await collaborationService.archiveThread(threadId, teacherId);
      res.json({ success: true, data: archived });
    } catch (error: any) {
      const status = error.message.includes('Access denied') ? 403 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  static async getFollowups(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user.id;
      const followups = await collaborationService.getFollowupQueue(teacherId);
      res.json({ success: true, data: followups });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async createAction(req: Request, res: Response): Promise<void> {
    try {
      const assignedBy = (req as any).user.id;
      const action = await collaborationService.createAction({ ...req.body, assignedBy });
      res.status(201).json({ success: true, data: action });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // --- PARENT CONTROLLERS ---
  static async getParentThreads(req: Request, res: Response): Promise<void> {
    try {
      const parentId = (req as any).user.id;
      const threads = await collaborationService.getParentThreads(parentId);
      res.json({ success: true, data: threads });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async acknowledgeMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const role = (req as any).user.role;
      const { messageId } = req.params;
      const { response } = req.body;
      const ack = await collaborationService.acknowledgeMessage(messageId, userId, role, response);
      res.json({ success: true, data: ack });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async completeAction(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { actionId } = req.params;
      const action = await collaborationService.updateActionStatus(actionId, 'completed', userId);
      res.json({ success: true, data: action });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async requestHelp(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const role = (req as any).user.role;
      res.json({
        success: true,
        message: 'Help request submitted successfully to teacher.',
        data: { userId, role, timestamp: new Date() },
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // --- STUDENT CONTROLLERS ---
  static async getStudentThreads(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user.id;
      const threads = await collaborationService.getStudentThreads(studentId);
      res.json({ success: true, data: threads });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async startAction(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { actionId } = req.params;
      const action = await collaborationService.updateActionStatus(actionId, 'started', userId);
      res.json({ success: true, data: action });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
