# Feature 40: AI Personalized Assessment, Question Generation & Adaptive Test Engine

## Overview
Feature 40 implements an enterprise-grade AI Assessment and Question Generation Engine for BharatEdu AI. The system provides secure, server-authoritative diagnostic testing, automated blueprint-based question generation, deterministic quality validation, partial credit evaluation, adaptive difficulty scaling, and comprehensive analytics for students, teachers, and parents.

## Core Features & Modules
1. **Server-Authoritative Evaluation (`scoring.ts`, `evaluator.ts`)**:
   - Computes marks, percentages, accuracy, partial credit, and penalty deductions on the server.
   - Prevents answer leakage by stripping `correctAnswer` and `solutionSteps` from student payloads during active test execution.

2. **AI Question Blueprint & Draft Generator (`question-generator.ts`, `question-validator.ts`)**:
   - Generates question drafts based on NCERT standards, class level, subject, and blueprint specifications.
   - Enforces deterministic quality rules: option count, positive marks, non-empty explanation, grounded source reference, duplicate prevention, and quality scoring (0–100).

3. **Adaptive Test Scaling (`adaptive.ts`)**:
   - Dynamically selects next questions based on student performance trajectory.

4. **Multi-Role Dashboards & Portals**:
   - **Student Portal (`AssessmentPage.tsx`)**: Interactive test-runner with progress tracking, question flagging, confidence rating, countdown timer, and detailed score breakdown.
   - **Teacher Dashboard (`AssessmentBuilderPage.tsx`, `TeacherAssessmentsPage.tsx`)**: Automated blueprint generator, draft review, question approval/rejection/regeneration, and class analytics.
   - **Parent Portal (`ParentAssessmentPage.tsx`)**: Evaluated score reports, subject progress, and recommended action plans without exposing answer keys.

## API Endpoints
- `GET /api/student/assessments` - Fetch active diagnostic tests
- `GET /api/student/assessments/:id` - Fetch test details (answer-sanitized)
- `POST /api/student/assessments/:id/start` - Start test attempt
- `POST /api/student/assessments/:id/questions/:qId/answer` - Record answer
- `POST /api/student/assessments/:id/submit` - Submit & evaluate test
- `GET /api/student/assessments/:id/result` - Fetch evaluated results
- `POST /api/teacher/assessments/generate` - Generate blueprint draft
- `POST /api/teacher/assessments/:id/publish` - Publish assessment
- `GET /api/teacher/assessments/:id/analytics` - Fetch class analytics
- `GET /api/parent/assessments/student/:sId` - Fetch child assessment progress

## Verification
- Passed 100+ audit criteria in `scratch/test_assessment_engine.js`.
- Verified full system regression with `scratch/test_full_regression.js`.
- Clean production build (`npm run build`).
