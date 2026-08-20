# Feature 41: AI Personalized Exam Preparation & Mock Exam Simulation Engine

## Overview
Feature 41 introduces an AI-powered Exam Preparation and Mock Simulation Engine for BharatEdu AI. It creates a personalized exam readiness journey for students based on verified exam profiles, server-authoritative readiness scores, Knowledge Graph priority ordering, grounded study roadmaps, adaptive mock exam simulations (integrating Feature 40), gap analysis, execution tactics, and risk monitoring.

## Key Submodules & Architecture (`server/src/ai/exam-preparation/`)
1. **Server-Authoritative Readiness Engine (`readiness.ts`)**:
   - Computes a 0–100 score combining concept mastery (35%), topic coverage (20%), practice accuracy (15%), mock performance (20%), and revision completion (10%).
   - Rejects client-supplied readiness scores.

2. **Priority Ranking Engine (`priorities.ts`)**:
   - Ranks study topics based on Knowledge Graph prerequisite gaps, high-risk concepts, weak mock concepts, overdue revisions, and verified exam weightage.

3. **Roadmap Engine (`roadmap.ts`)**:
   - Generates daily and weekly study roadmaps (Today, Tomorrow, Weekly, Exam Eve) respecting student daily study budgets.

4. **Adaptive Mock Exam Engine (`mock-engine.ts`)**:
   - Reuses Feature 40 Assessment Engine under the hood for blueprint question generation and evaluation without duplicating scoring logic.

5. **Strategy & Gap Analysis (`strategy.ts`, `gap-analysis.ts`, `improvement.ts`)**:
   - Outlines phase-by-phase time allocation and skip rules.
   - Identifies syllabus, prerequisite, and revision gaps.
   - Calculates score improvement bands without making unsupported false guarantees.

6. **Multi-Role Portals**:
   - **Student View (`ExamPreparationPage.tsx`)**: Full readiness hub, countdown timer, priority list, study roadmap, risk alerts, gap analysis, mock simulations, and AI Coach guidance.
   - **Teacher Dashboard (`TeacherExamPreparationPage.tsx`)**: Class readiness overview, high-risk student alerts, weak concept identification, and mock assignment.
   - **Parent View (`ParentExamPreparationPage.tsx`)**: Verified child readiness and study progress without answer key or private conversation exposure.

## API Endpoints
- `GET /api/student/exam-preparation`
- `POST /api/student/exam-preparation/plan`
- `GET /api/student/exam-preparation/readiness`
- `GET /api/student/exam-preparation/priorities`
- `GET /api/student/exam-preparation/today`
- `GET /api/student/exam-preparation/week`
- `GET /api/student/exam-preparation/gaps`
- `GET /api/student/exam-preparation/mock-recommendation`
- `POST /api/student/exam-preparation/mock/generate`
- `GET /api/student/exam-preparation/strategy`
- `GET /api/teacher/exam-preparation`
- `GET /api/teacher/exam-preparation/class/:classId`
- `GET /api/parent/exam-preparation/student/:studentId`

## Verification
- Passed 100+ criteria in `scratch/test_exam_preparation.js`.
- Verified production build (`npm run build`).
- Verified full system regression with `scratch/test_full_regression.js`.
