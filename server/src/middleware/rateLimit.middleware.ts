import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';

// In-Memory Rate Limiting Tracker
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // Max 30 messages per minute per student

export const tutorRateLimiter = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user?.id || req.ip || 'anonymous';
  const now = Date.now();

  const userRecord = requestCounts.get(userId);

  if (!userRecord || now > userRecord.resetTime) {
    requestCounts.set(userId, { count: 1, resetTime: now + WINDOW_MS });
    next();
    return;
  }

  if (userRecord.count >= MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded: Too many messages sent. Please wait a moment before asking another question.',
    });
    return;
  }

  userRecord.count += 1;
  next();
};
