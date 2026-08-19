import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  getPublicScholarships,
  getScholarshipById,
  getScholarshipAlerts,
  getUpcomingDeadlines,
  saveScholarship,
  unsaveScholarship,
  getSavedScholarships,
  updateApplicationStatus,
} from '../controllers/scholarship.controller.js';

const router = Router();

// Public discovery endpoints
router.get('/', getPublicScholarships);

// Authenticated Student Endpoints
router.get('/alerts', authenticateJWT, requireRole('student'), getScholarshipAlerts);
router.get('/deadlines', authenticateJWT, requireRole('student'), getUpcomingDeadlines);
router.get('/saved', authenticateJWT, requireRole('student'), getSavedScholarships);
router.post('/:id/save', authenticateJWT, requireRole('student'), saveScholarship);
router.delete('/:id/save', authenticateJWT, requireRole('student'), unsaveScholarship);
router.put('/:id/status', authenticateJWT, requireRole('student'), updateApplicationStatus);

// Public ID lookup (must be after specific subroutes like /alerts, /deadlines, /saved)
router.get('/:id', getScholarshipById);

export default router;
