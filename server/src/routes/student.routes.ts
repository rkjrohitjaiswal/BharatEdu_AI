import { Router } from 'express';
import { getStudentProfile } from '../controllers/profile.controller.js';
import {
  getStudentDashboard,
  updateStudyTaskStatus,
  getStudentLearningProfile,
  getStudentMastery,
  getStudentLearningGaps,
  getStudentEngagement,
} from '../controllers/student-data.controller.js';
import {
  analyzeEvidence,
  getStudentGaps,
  getStudentGapById,
  resolveStudentGap,
} from '../controllers/learning-intelligence.controller.js';
import {
  createPracticeSession,
  getPracticeSessions,
  getPracticeSessionById,
  submitPracticeAnswer,
  completePracticeSession,
  getPracticeRecommendations,
} from '../controllers/practice.controller.js';
import {
  getStudentScholarshipProfile,
  saveStudentScholarshipProfile,
  getStudentMatches,
  matchSingleScholarship,
} from '../controllers/scholarship.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// All routes require student authentication
router.use(authenticateJWT, requireRole('student'));

router.get('/dashboard', getStudentDashboard);
router.put('/study-plan/tasks/:taskId', updateStudyTaskStatus);
router.get('/profile', getStudentProfile);
router.get('/learning-profile', getStudentLearningProfile);
router.get('/mastery', getStudentMastery);

// Phase 6A Learning Intelligence & Gap Endpoints
router.post('/learning/analyze', analyzeEvidence);
router.get('/learning/gaps', getStudentGaps);
router.get('/learning/gaps/:id', getStudentGapById);
router.put('/learning/gaps/:id/resolve', resolveStudentGap);

// Phase 6B Adaptive Practice Endpoints
router.post('/practice/sessions', createPracticeSession);
router.get('/practice/sessions', getPracticeSessions);
router.get('/practice/sessions/:id', getPracticeSessionById);
router.post('/practice/sessions/:id/answer', submitPracticeAnswer);
router.post('/practice/sessions/:id/complete', completePracticeSession);
router.get('/practice/recommendations', getPracticeRecommendations);

// Phase 8 Scholarship Intelligence & Matching Endpoints
router.get('/scholarships/profile', getStudentScholarshipProfile);
router.post('/scholarships/profile', saveStudentScholarshipProfile);
router.get('/scholarships/matches', getStudentMatches);
router.post('/scholarships/match', matchSingleScholarship);

router.get('/engagement', getStudentEngagement);

export default router;
