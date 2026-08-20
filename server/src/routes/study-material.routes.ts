import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  handleArchive,
  handleGenerate,
  handleGenerateFlashcards,
  handleGetById,
  handleGetFlashcards,
  handleGetHistory,
  handleGetParentStudentSummary,
  handleGetRecommended,
  handleGetSummary,
  handleGetTeacherStudentSummary,
  handleGetToday,
  handleRegenerate,
  handleReviewFlashcard,
} from '../controllers/study-material.controller.js';

const router = Router();

// Student Routes
router.post('/generate', authenticateJWT, requireRole('student'), handleGenerate);
router.get('/recommended', authenticateJWT, requireRole('student'), handleGetRecommended);
router.get('/today', authenticateJWT, requireRole('student'), handleGetToday);
router.get('/history', authenticateJWT, requireRole('student'), handleGetHistory);
router.get('/summary', authenticateJWT, requireRole('student'), handleGetSummary);

router.get('/:id', authenticateJWT, requireRole('student'), handleGetById);
router.post('/:id/regenerate', authenticateJWT, requireRole('student'), handleRegenerate);
router.post('/:id/archive', authenticateJWT, requireRole('student'), handleArchive);
router.get('/:id/flashcards', authenticateJWT, requireRole('student'), handleGetFlashcards);
router.post('/:id/flashcards/generate', authenticateJWT, requireRole('student'), handleGenerateFlashcards);

// Flashcard Review Route
router.post('/flashcards/:id/review', authenticateJWT, requireRole('student'), handleReviewFlashcard);

// Teacher & Parent Summary Routes
router.get('/teacher/student/:studentId/summary', authenticateJWT, requireRole('teacher'), handleGetTeacherStudentSummary);
router.get('/parent/student/:studentId/summary', authenticateJWT, requireRole('parent'), handleGetParentStudentSummary);

export default router;
