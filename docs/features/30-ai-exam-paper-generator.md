# Feature 30: AI Exam Paper Generator & Realistic Mock Exam Engine

## Overview
Feature 30 introduces the **AI Exam Paper Generator & Realistic Mock Exam Engine** for **BharatEdu AI**. The system dynamically generates and evaluates realistic, syllabus-aware, board-tailored mock exam papers using the student's board, class, subject, exam preparation data, Knowledge Graph, Learning Path, mastery score, mistake history, smart revision schedule, goals, career path, and risk profile.

Key Features & Server Security:
- **Server-Authoritative Evaluation & Blueprint**: Blueprints, question selection distributions, timing deadlines, score calculations (`grossMarks - negativeMarks = netMarks`), and answer evaluations are handled strictly on the server.
- **Answer-Key Payload Protection**: `correctAnswer` is strictly omitted from question payloads returned to the client during an exam. It is accessible only during post-test authorized review (`/exam-papers/:id/review`).
- **Timed Mock Exam Mode & Autosave**: Supports countdown timing, section navigation, question palette, mark-for-review, server-side deadline validation, and idempotent autosave.
- **Negative Marking Support**: Configurable fixed or question-type specific negative marking calculated on the server (`grossMarks - negativeMarks = netMarks`).
- **Integration across Features 1–29**: Integrates with Feature 29 Adaptive Assessment, Feature 9 Exam Preparation, Feature 21 Knowledge Graph, Feature 25 Learning Path, Feature 24 Smart Revision, Feature 17 Analytics, Feature 13 Risk, Feature 11 Notifications, Doubt Solver, Student Mentor, Teacher Copilot, and Parent Copilot.

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/`
- **`ExamPaper`** (`exam-paper.model.ts`): `paperId`, `studentId`, `title`, `board`, `classLevel`, `subject`, `academicYear`, `examType` (`school_exam`, `unit_test`, `midterm`, `preboard`, `board_style`, `mock_exam`, `practice_paper`, `custom`), `durationMinutes`, `totalMarks`, `questionCount`, `difficultyDistribution`, `sectionCount`, `status`, `startedAt`, `completedAt`, `createdAt`, `updatedAt`.
- **`ExamPaperSection`** (`exam-paper-section.model.ts`): `paperId`, `sectionId`, `title`, `instructions`, `sequence`, `questionType`, `questionCount`, `marksPerQuestion`, `totalMarks`, `negativeMarking`, `negativeMarks`, `durationMinutes`.
- **`ExamPaperQuestion`** (`exam-paper-question.model.ts`): `paperId`, `sectionId`, `questionId`, `sequence`, `subject`, `topicId`, `conceptId`, `difficulty`, `questionType`, `questionText`, `options`, `correctAnswer` (SERVER-SIDE ONLY - NEVER returned before submission!), `expectedConceptCoverage`, `rubric`, `marks`, `negativeMarks`, `sourceType`, `sourceId`, `generatedBy`, `status`.
- **`ExamPaperAttempt`** (`exam-paper-attempt.model.ts`): `paperId`, `questionId`, `studentId`, `answer`, `submittedAt`, `responseTimeSeconds`, `isCorrect`, `marksAwarded`, `negativeMarksApplied`, `feedback`.
- **`ExamPaperBlueprint`** (`exam-paper-blueprint.model.ts`): `paperId`, `board`, `classLevel`, `subject`, `examType`, `totalMarks`, `durationMinutes`, `sectionBlueprint`, `topicDistribution`, `difficultyDistribution`, `questionTypeDistribution`, `learningObjectiveDistribution`, `generatedAt`.

### 2. Backend Engine Module
Location: `server/src/ai/exam-paper/`
- **`types.ts`**: DTOs for papers, questions, sections, results, review, and summaries.
- **`blueprint.ts`**: Board & exam-type syllabus blueprint engine.
- **`syllabus.ts`**: Syllabus coverage analyzer mapping board requirements to internal curriculum.
- **`question-generator.ts`**: Multi-format question generator & catalog engine (MCQ, Multiple Select, True/False, Numerical, Short Answer, Long Answer, Coding).
- **`validator.ts`**: Question & paper validation.
- **`difficulty.ts`**: Difficulty distribution calculations.
- **`evaluation.ts`**: Deterministic answer evaluator with negative marking.
- **`engine.ts`**: Core exam runner engine managing generation, starting, current question (sanitized!), answer submission with autosave, skipping, mark for review, deadline auto-submit, finish, results, review.
- **`mock-engine.ts`**: Mock exam generator (full-length, section, topic, weak-area, exam-readiness mocks).
- **`ai-coach.ts`**: AI post-exam performance summary & insight generator with offline fallback.
- **`service.ts`**: Orchestration service for student, teacher, and parent APIs.

### 3. Controller & Express Router
Location: `server/src/controllers/exam-paper.controller.ts` & `server/src/routes/exam-paper.routes.ts`

Mounted under `/api/student/exam-papers`, `/api/teacher/exam-papers`, and `/api/parent/exam-papers`:
- `POST /`: Create exam paper (`requireRole('student')`)
- `GET /`: Fetch student exam papers (`requireRole('student')`)
- `GET /:id`: Fetch exam paper details (`requireRole('student')`)
- `DELETE /:id`: Delete exam paper (`requireRole('student')`)
- `POST /:id/start`: Start exam paper (`requireRole('student')`)
- `GET /:id/current`: Fetch current question (`requireRole('student')`)
- `POST /:id/questions/:questionId/answer`: Submit answer (`requireRole('student')`)
- `POST /:id/questions/:questionId/skip`: Skip question (`requireRole('student')`)
- `POST /:id/questions/:questionId/mark-review`: Mark for review (`requireRole('student')`)
- `POST /:id/finish`: Finish exam paper (`requireRole('student')`)
- `GET /:id/results`: Fetch results (`requireRole('student')`)
- `GET /:id/review`: Fetch review (`requireRole('student')`)
- `GET /:id/recommendations`: Fetch recommendations (`requireRole('student')`)
- `POST /generate-mock`: Generate full-length mock (`requireRole('student')`)
- `POST /generate-practice-paper`: Generate practice paper (`requireRole('student')`)
- `POST /generate-weak-area-paper`: Generate weak-area paper (`requireRole('student')`)
- `POST /generate-exam-readiness-paper`: Generate readiness paper (`requireRole('student')`)
- `GET /api/teacher/exam-papers/student/:studentId/summary`: Teacher summary (`requireRole('teacher')`)
- `GET /api/parent/exam-papers/student/:studentId/summary`: Parent summary (`requireRole('parent')`, verified link)

---

## Frontend Components

Location: `client/src/pages/` & `client/src/components/dashboard/`
- **`ExamPaperPage`** (`/exam-papers`): Main Mock Exam Hub page.
- **`ExamPaperRunnerPage`** (`/exam-papers/:id/run`): Interactive timed test runner page.
- **`ExamPaperResultsPage`** (`/exam-papers/:id/results`): Performance & AI insights page.
- **`ExamPaperReviewPage`** (`/exam-papers/:id/review`): Post-test answer review page.
- **`MockExamCard`** (in `dashboard/`): Embedded dashboard card on `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_exam_paper.js` (**52/52 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
