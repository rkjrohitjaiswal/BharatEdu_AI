import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  syncNotifications,
} from '../controllers/notification.controller.js';

const router = Router();

router.use(authenticateJWT);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.post('/sync', syncNotifications);
router.patch('/read-all', markAllAsRead);
router.post('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
