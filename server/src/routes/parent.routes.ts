import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  getLinkedStudents,
  getStudentOverview,
  acceptInvitation,
  generateInvitation,
  getStudentInvitations,
  revokeInvitation,
} from '../controllers/parent.controller.js';

export const parentRouter = Router();

parentRouter.use(authenticateJWT);
parentRouter.use(requireRole('parent'));

parentRouter.get('/students', getLinkedStudents);
parentRouter.get('/students/:studentId/overview', getStudentOverview);
parentRouter.post('/link-student', acceptInvitation);

export const studentParentLinkRouter = Router();

studentParentLinkRouter.use(authenticateJWT);
studentParentLinkRouter.use(requireRole('student'));

studentParentLinkRouter.post('/invite', generateInvitation);
studentParentLinkRouter.get('/invitations', getStudentInvitations);
studentParentLinkRouter.delete('/invitations/:code', revokeInvitation);
