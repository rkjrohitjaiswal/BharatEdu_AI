import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { CollaborationController } from '../controllers/collaboration.controller.js';

export const teacherCollaborationRouter = Router();
export const parentCollaborationRouter = Router();
export const studentCollaborationRouter = Router();

// --- TEACHER COLLABORATION ROUTES ---
teacherCollaborationRouter.use(authenticateJWT, requireRole('teacher'));

teacherCollaborationRouter.get('/threads', CollaborationController.getTeacherThreads);
teacherCollaborationRouter.get('/followups', CollaborationController.getFollowups);
teacherCollaborationRouter.post('/draft', CollaborationController.generateDraft);
teacherCollaborationRouter.post('/actions', CollaborationController.createAction);
teacherCollaborationRouter.post('/interventions/:interventionId/thread', CollaborationController.createInterventionThread);

teacherCollaborationRouter.get('/:threadId', CollaborationController.getThreadDetails);
teacherCollaborationRouter.post('/:threadId/messages', CollaborationController.sendMessage);
teacherCollaborationRouter.post('/:threadId/archive', CollaborationController.archiveThread);

// --- PARENT COLLABORATION ROUTES ---
parentCollaborationRouter.use(authenticateJWT, requireRole('parent'));

parentCollaborationRouter.get('/threads', CollaborationController.getParentThreads);
parentCollaborationRouter.get('/:threadId', CollaborationController.getThreadDetails);
parentCollaborationRouter.post('/:threadId/messages', CollaborationController.sendMessage);
parentCollaborationRouter.post('/messages/:messageId/acknowledge', CollaborationController.acknowledgeMessage);
parentCollaborationRouter.post('/actions/:actionId/complete', CollaborationController.completeAction);
parentCollaborationRouter.post('/request-help', CollaborationController.requestHelp);

// --- STUDENT COLLABORATION ROUTES ---
studentCollaborationRouter.use(authenticateJWT, requireRole('student'));

studentCollaborationRouter.get('/threads', CollaborationController.getStudentThreads);
studentCollaborationRouter.get('/:threadId', CollaborationController.getThreadDetails);
studentCollaborationRouter.post('/:threadId/messages', CollaborationController.sendMessage);
studentCollaborationRouter.post('/messages/:messageId/acknowledge', CollaborationController.acknowledgeMessage);
studentCollaborationRouter.post('/actions/:actionId/start', CollaborationController.startAction);
studentCollaborationRouter.post('/actions/:actionId/complete', CollaborationController.completeAction);
studentCollaborationRouter.post('/request-help', CollaborationController.requestHelp);
