# Feature 29: AI Personalized Assessment & Adaptive Testing Engine

## Overview
Feature 29 introduces the **AI Personalized Assessment & Adaptive Testing Engine** for **BharatEdu AI**. The system dynamically generates, adapts, and evaluates personalized tests based on the student's mastery score, Knowledge Graph prerequisite dependencies, Learning Path stage, mistake history, revision schedule, exam preparation, goals, career path, and risk profile.

The backend logic is strictly server-authoritative:
- **Server-Authoritative Evaluation & Security**: Answer keys (`correctAnswer`) are strictly kept server-side and never returned to the student before submission. Scores, accuracy, difficulty step adjustments, and mastery impacts are calculated exclusively on the server.
- **Adaptive Difficulty Adjustment**: Dynamically scales question difficulty step-by-step (max 1 step change per question: `beginner` <-> `easy` <-> `medium` <-> `hard` <-> `advanced`) based on student performance.
- **Prerequisite-First Question Selection**: Uses Knowledge Graph (Feature 21) prerequisite dependencies to test prerequisite concepts first when student mastery is low.
- **Multi-Format Question Support**: Supports MCQ, Multiple Select, True/False, Numerical, Short Answer, and Coding questions.
- **Integration across Features 1–28**: Connects with Topic Mastery, Practice History, Mistake Review, Learning Path, Study Materials, Smart Revision, Exam Prep, Doubt Solver, Goals, Career Roadmap, Risk, Analytics, and Notifications.

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/`
- **`AdaptiveAssessment`** (`adaptive-assessment.model.ts`): `assessmentId`, `studentId`, `title`, `subject`, `classLevel`, `board`, `assessmentType` (`diagnostic`, `topic_check`, `mastery_check`, `exam_simulation`, `revision_test`, `learning_path_check`, `doubt_followup`, `custom`), `difficulty`, `questionCount`, `timeLimitMinutes`, `status`, `currentQuestionIndex`, `score`, `accuracy`, `masteryImpact`, `createdAt`, `startedAt`, `completedAt`, `updatedAt`.
- **`AdaptiveAssessmentQuestion`** (`adaptive-assessment-question.model.ts`): `assessmentId`, `questionId`, `studentId`, `sequence`, `subject`, `topicId`, `conceptId`, `difficulty`, `questionType`, `question`, `options`, `correctAnswer`, `marks`, `timeLimitSeconds`, `sourceType`, `sourceId`, `generatedBy`, `status`, `submittedAt`.
- **`AdaptiveAssessmentAttempt`** (`adaptive-assessment-attempt.model.ts`): `assessmentId`, `questionId`, `studentId`, `selectedAnswer`, `answerText`, `submittedAnswer`, `isCorrect`, `marksAwarded`, `responseTimeSeconds`, `confidence`, `evaluatedBy`, `feedback`, `createdAt`.
- **`AdaptiveAssessmentContext`** (`adaptive-assessment-context.model.ts`): `assessmentId`, `studentId`, `topicId`, `conceptId`, `masteryScore`, `confidenceScore`, `riskLevel`, `examUrgency`, `learningPathPriority`, `revisionPriority`, `mistakeFrequency`, `recommendedDifficulty`, `capturedAt`.

### 2. Backend Engine Module
Location: `server/src/ai/adaptive-assessment/`
- **`types.ts`**: DTOs for assessments, questions, attempts, contexts, results, reviews, and summaries.
- **`context.ts`**: Aggregates Features 1–28 student context.
- **`rules.ts`**: Question selection priority rules & question quality validation.
- **`question-engine.ts`**: Question generation & catalog retrieval engine.
- **`difficulty-engine.ts`**: Adaptive difficulty scaling (max 1 step change per question).
- **`evaluation.ts`**: Deterministic answer evaluator for all question types.
- **`engine.ts`**: Core runner engine managing test creation, starting, current question retrieval (sanitized!), answer submission, skipping, adaptive stopping, results calculation, and review.
- **`ai-coach.ts`**: AI post-assessment insight generator with offline fallback.
- **`service.ts`**: Service exposing creation, diagnostic, exam simulation, mastery check, revision test, doubt follow-up, starting, current question, answering, skipping, finishing, results, review, recommendations, teacher summary, and parent summary.

### 3. Controller & Express Router
Location: `server/src/controllers/adaptive-assessment.controller.ts` & `server/src/routes/adaptive-assessment.routes.ts`

Mounted under `/api/student/assessments`, `/api/teacher/assessments`, and `/api/parent/assessments`:
- `POST /`: Create assessment (`requireRole('student')`)
- `GET /`: Fetch student assessments (`requireRole('student')`)
- `GET /:id`: Fetch assessment details (`requireRole('student')`)
- `DELETE /:id`: Delete assessment (`requireRole('student')`)
- `POST /:id/start`: Start assessment (`requireRole('student')`)
- `GET /:id/current-question`: Fetch current question (`requireRole('student')`)
- `POST /:id/questions/:questionId/answer`: Submit question answer (`requireRole('student')`)
- `POST /:id/questions/:questionId/skip`: Skip question (`requireRole('student')`)
- `POST /:id/finish`: Finish assessment (`requireRole('student')`)
- `GET /:id/results`: Fetch results (`requireRole('student')`)
- `GET /:id/review`: Fetch review (`requireRole('student')`)
- `GET /:id/recommendations`: Fetch recommendations (`requireRole('student')`)
- `POST /from-doubt`: Create doubt follow-up assessment (`requireRole('student')`)
- `POST /diagnostic`: Create diagnostic assessment (`requireRole('student')`)
- `POST /exam-simulation`: Create exam simulation (`requireRole('student')`)
- `POST /mastery-check`: Create mastery check (`requireRole('student')`)
- `POST /revision-test`: Create revision test (`requireRole('student')`)
- `GET /api/teacher/assessments/student/:studentId/summary`: Teacher summary (`requireRole('teacher')`)
- `GET /api/parent/assessments/student/:studentId/summary`: Parent summary (`requireRole('parent')`, verified link)

---

## Frontend Components

Location: `client/src/pages/` & `client/src/components/assessment/`
- **`AdaptiveAssessmentPage`** (`/assessments`): Main assessment hub page.
- **`AssessmentRunnerPage`** (`/assessments/:id/run`): Interactive test runner page.
- **`AssessmentResultsPage`** (`/assessments/:id/results`): Performance & AI insights page.
- **`AssessmentReviewPage`** (`/assessments/:id/review`): Post-test answer review page.
- **`AdaptiveAssessmentCard`** (in `dashboard/`): Embedded dashboard card on `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_adaptive_assessment.js` (**52/52 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
