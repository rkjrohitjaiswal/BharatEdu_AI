# Feature 25: AI Learning Path & Personalized Curriculum Engine

## Feature Overview
Feature 25 introduces the **AI Learning Path & Personalized Curriculum Engine** for **BharatEdu AI**. The system constructs a long-term, dynamic personalized curriculum for each student, answering:
1. Where is the student now?
2. What should the student learn next?
3. Which prerequisites must be completed first?
4. What should be learned this week and month?
5. Which concepts can be skipped because mastery is already strong?
6. Which concepts require remediation?
7. How does the path support goals, exams, career roadmaps, risk profiles, Knowledge Graph prerequisite chains, study planners, smart revision, adaptive assessments, and resource recommendations?

Server-side deterministic logic remains authoritative:
- **Server-Controlled Progress Calculation**: `progressPercent` (0–100), `learningLevel`, `currentStage`, and completed stage triggers are calculated strictly server-side.
- **Prerequisite-First Next Concept Selection**: Knowledge Graph root prerequisite gaps (Feature 21) ALWAYS take precedence before downstream concepts (e.g., Linear Equations before Quadratic Equations).
- **Personalized Time Budgeting**: Scheduled task minutes strictly satisfy `sum(estimatedMinutes) <= availableDailyMinutes` (Feature 18).
- **Multi-System Synergy**: Seamlessly connects Knowledge Graph, Topic Mastery, Learning Gaps, Practice History, Mistakes, Adaptive Assessment, Smart Revision, Exam Preparation, Study Planner, Goals, Career Roadmap, Risk Prediction, Resource Hub, and Student Success Mentor.

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/`
- **`LearningPath`** (`learning-path.model.ts`): Schema for `studentId`, `title`, `description`, `board`, `classLevel`, `targetType`, `status`, `progressPercent`, `currentStage`, `totalStages`, `completedStages`, `estimatedTotalMinutes`, `dailyMinutes`, `weeklyMinutes`.
- **`LearningPathStage`** (`learning-path-stage.model.ts`): Schema for `learningPathId`, `studentId`, `stageIndex`, `title`, `description`, `subject`, `conceptIds`, `topicIds`, `prerequisiteConceptIds`, `estimatedMinutes`, `priority`, `status`, `masteryRequired`, `currentMastery`.
- **`LearningPathTask`** (`learning-path-task.model.ts`): Schema for `learningPathId`, `stageId`, `studentId`, `taskType`, `title`, `description`, `conceptId`, `topicId`, `resourceId`, `estimatedMinutes`, `priority`, `status`, `completedAt`.

### 2. Backend Module Architecture
Location: `server/src/ai/learning-path/`
- **`types.ts`**: Data Transfer Objects (DTOs), learning level types (`foundation`, `developing`, `intermediate`, `advanced`, `mastery`), and summary types.
- **`catalog.ts`**: Starter curriculum stages and task templates across subjects.
- **`rules.ts`**: Next-best-concept algorithm, prerequisite precedence rules, learning level calculator (0–100), mastery skipping rules, and time budgeting logic.
- **`ai-coach.ts`**: AI guidance layer providing natural language explanations with offline fallback templates.
- **`engine.ts`**: Aggregates student context across Features 1–24 to construct unified learning path snapshots and calculate progress.
- **`service.ts`**: Service exposing path creation, retrieval, task/stage completion, pause/resume, refresh, teacher overview, and parent summary.

### 3. Controller & Express Router
Location: `server/src/controllers/learning-path.controller.ts` & `server/src/routes/learning-path.routes.ts`

Mounted at `/api/student/learning-path` in `server/src/routes/index.ts`:
- `POST /`: Create custom path (`requireRole('student')`)
- `GET /`: List student paths (`requireRole('student')`)
- `GET /summary`: Fetch summary overview (`requireRole('student')`)
- `POST /refresh`: Recalculate learning path (`requireRole('student')`)
- `GET /:id`: Fetch path details (`requireRole('student')`)
- `GET /:id/stages`: Fetch path stages (`requireRole('student')`)
- `GET /:id/tasks`: Fetch path tasks (`requireRole('student')`)
- `GET /:id/next`: Fetch recommended next concept & task (`requireRole('student')`)
- `POST /:id/tasks/:taskId/start`: Start task (`requireRole('student')`)
- `POST /:id/tasks/:taskId/complete`: Complete task (`requireRole('student')`)
- `POST /:id/stages/:stageId/complete`: Complete stage (`requireRole('student')`)
- `POST /:id/pause`: Pause path (`requireRole('student')`)
- `POST /:id/resume`: Resume path (`requireRole('student')`)
- `GET /teacher/student/:studentId/summary`: Teacher summary (`requireRole('teacher')`)
- `GET /parent/student/:studentId/summary`: Parent summary (`requireRole('parent')`, verified via active link)

---

## Frontend Components

Location: `client/src/components/learning-path/` & `client/src/pages/LearningPathPage.tsx`
- **`LearningPathPage`** (`/learning-path`): Main student curriculum workspace.
- **`LearningPathHeader`**: Header rendering board, class level, title, and refresh button.
- **`LearningLevelCard`**: Authoritative readiness level & score indicator.
- **`LearningPathProgress`**: Curriculum progress bar & time budget metrics.
- **`LearningPathNextConcept`**: Next recommended concept card with single-click action.
- **`LearningPathStageCard`**: Stage card rendering stage status, mastery requirements, and interactive task list.
- **`LearningPathAIInsight`**: AI Coach recommendation drawer.
- **`LearningPathCard`**: Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_learning_path.js` (**35/35 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
