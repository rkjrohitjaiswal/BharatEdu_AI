import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { syncUserNotifications } from '../notifications/engine.js';
import { dataRepository } from '../repositories/data.repository.js';

export async function getNotifications(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    // Trigger sync engine before returning notifications
    await syncUserNotifications(userId, role);

    const isReadParam = req.query.isRead;
    const isRead = typeof isReadParam === 'string' ? isReadParam === 'true' : undefined;
    const priority = req.query.priority ? String(req.query.priority) : undefined;
    const sourceType = req.query.sourceType ? String(req.query.sourceType) : undefined;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;

    const notifications = await dataRepository.getNotifications({
      recipientUserId: userId,
      isRead,
      priority,
      sourceType,
      limit,
    });

    const unreadCount = await dataRepository.getUnreadNotificationCount(userId);

    return res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to retrieve notifications',
    });
  }
}

export async function getUnreadCount(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const unreadCount = await dataRepository.getUnreadNotificationCount(userId);
    return res.json({
      success: true,
      data: { unreadCount },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to retrieve unread notification count',
    });
  }
}

export async function markAsRead(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const updated = await dataRepository.markNotificationRead(userId, id);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    const unreadCount = await dataRepository.getUnreadNotificationCount(userId);

    return res.json({
      success: true,
      message: 'Notification marked as read',
      data: {
        notification: updated,
        unreadCount,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to mark notification as read',
    });
  }
}

export async function markAllAsRead(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const count = await dataRepository.markAllNotificationsRead(userId);

    return res.json({
      success: true,
      message: `Marked ${count} notifications as read`,
      data: {
        markedCount: count,
        unreadCount: 0,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to mark all notifications as read',
    });
  }
}

export async function syncNotifications(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    const result = await syncUserNotifications(userId, role);
    const unreadCount = await dataRepository.getUnreadNotificationCount(userId);

    return res.json({
      success: true,
      message: 'Notifications synchronized successfully',
      data: {
        syncedCount: result.syncedCount,
        notifications: result.notifications,
        unreadCount,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to synchronize notifications',
    });
  }
}

export async function deleteNotification(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const deleted = await dataRepository.deleteNotification(userId, id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    const unreadCount = await dataRepository.getUnreadNotificationCount(userId);

    return res.json({
      success: true,
      message: 'Notification deleted',
      data: { unreadCount },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to delete notification',
    });
  }
}
