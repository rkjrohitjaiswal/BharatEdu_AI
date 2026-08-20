import { Router } from 'express';
import {
  bookmarkResource,
  dismissRecommendation,
  getAllResources,
  getBookmarks,
  getHistory,
  getParentStudentSummary,
  getRecommendationById,
  getRecommendations,
  getResourceById,
  getTeacherStudentSummary,
  recordInteraction,
  refreshRecommendations,
  removeBookmark,
} from '../controllers/resource-recommendation.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const studentRouter = Router();
const teacherRouter = Router();
const parentRouter = Router();

// Student Routes
studentRouter.use(authenticateJWT, requireRole('student'));

studentRouter.get('/recommendations', getRecommendations);
studentRouter.get('/recommendations/:id', getRecommendationById);
studentRouter.post('/recommendations/refresh', refreshRecommendations);
studentRouter.post('/recommendations/:id/dismiss', dismissRecommendation);

studentRouter.get('/bookmarks', getBookmarks);
studentRouter.get('/history', getHistory);

studentRouter.get('/', getAllResources);
studentRouter.get('/:resourceId', getResourceById);
studentRouter.post('/:resourceId/interaction', recordInteraction);
studentRouter.post('/:resourceId/bookmark', bookmarkResource);
studentRouter.delete('/:resourceId/bookmark', removeBookmark);

// Teacher Routes
teacherRouter.use(authenticateJWT, requireRole('teacher'));
teacherRouter.get('/student/:studentId/summary', getTeacherStudentSummary);

// Parent Routes
parentRouter.use(authenticateJWT, requireRole('parent'));
parentRouter.get('/student/:studentId/summary', getParentStudentSummary);

export { studentRouter as studentResourceRouter, teacherRouter as teacherResourceRouter, parentRouter as parentResourceRouter };
