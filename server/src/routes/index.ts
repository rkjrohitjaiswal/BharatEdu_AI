import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import studentRoutes from './student.routes.js';
import teacherRoutes from './teacher.routes.js';
import subjectRoutes from './subject.routes.js';
import topicRoutes from './topic.routes.js';
import scholarshipRoutes from './scholarship.routes.js';
import tutorRoutes from './tutor.routes.js';
import ragRoutes from './rag.routes.js';
import studyPlanRoutes from './study-plan.routes.js';
import mistakeReviewRoutes from './mistake-review.routes.js';
import practiceHistoryRoutes from './practice-history.routes.js';
import { teacherInterventionRouter, studentInterventionRouter } from './intervention.routes.js';
import learningCoachRoutes from './learning-coach.routes.js';
import { parentRouter, studentParentLinkRouter } from './parent.routes.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/parent', parentRouter);
router.use('/student/parent-link', studentParentLinkRouter);
router.use('/student/learning-coach', learningCoachRoutes);
router.use('/student/study-plan', studyPlanRoutes);
router.use('/student/practice/history', practiceHistoryRoutes);
router.use('/student/practice', mistakeReviewRoutes);
router.use('/student/interventions', studentInterventionRouter);
router.use('/student', studentRoutes);
router.use('/teacher/interventions', teacherInterventionRouter);
router.use('/teacher', teacherRoutes);
router.use('/subjects', subjectRoutes);
router.use('/topics', topicRoutes);
router.use('/scholarships', scholarshipRoutes);
router.use('/tutor', tutorRoutes);
router.use('/rag', ragRoutes);

export default router;
