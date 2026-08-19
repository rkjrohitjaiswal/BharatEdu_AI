import { Router } from 'express';
import {
  createConversation,
  getConversations,
  getConversationById,
  deleteConversation,
  addMessage,
} from '../controllers/tutor.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { tutorRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// All tutor endpoints require student role
router.use(authenticateJWT, requireRole('student'));

router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.delete('/conversations/:id', deleteConversation);
router.post('/conversations/:id/messages', tutorRateLimiter, addMessage);

export default router;
