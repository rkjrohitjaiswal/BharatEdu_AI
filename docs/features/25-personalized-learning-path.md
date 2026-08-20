# Feature 25: AI Personalized Learning Path & Curriculum Engine

## Overview
Feature 25 introduces the **AI Personalized Learning Path & Curriculum Engine** for **BharatEdu AI**. The engine continuously generates and adapts a student's long-term personalized learning path using the existing BharatEdu AI systems from Features 1–24.

The system is server-authoritative:
- **Prerequisite-First Concept Sequence**: Uses Knowledge Graph (Feature 21) prerequisite dependencies to enforce required concept mastery before dependent concepts unlock.
- **Server-Controlled Progress & Mastery**: `overallProgress` (0–100), `currentStage`, stage unlock conditions, and task completion states are calculated strictly on the backend.
- **Personalized Daily Budget**: Planned daily study items respect `sum(item.estimatedMinutes) <= availableDailyMinutes` (Feature 18).
- **Multi-System Adaptation**: Dynamically adapts when mastery changes, repeated mistakes occur, exams draw near, risk levels change, or learning goals are completed.

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/`
- **`LearningPath`** (`learning-path.model.ts`): `studentId`, `title`, `description`, `board`, `classLevel`, `target`, `targetType` (`exam`, `mastery`, `career`, `skill`, `custom`), `targetId`, `status` (`active`, `completed`, `paused`, `archived`), `currentStage`, `overallProgress`, `estimatedTotalMinutes`, `completedMinutes`.
- **`LearningPathStage`** (`learning-path-stage.model.ts`): `learningPathId`, `studentId`, `stageOrder`, `stageIndex`, `title`, `description`, `subject`, `conceptIds`, `topicIds`, `prerequisiteConceptIds`, `estimatedMinutes`, `completedMinutes`, `progressPercent`, `priority`, `status`, `targetMastery`, `masteryRequired`, `currentMastery`.
- **`LearningPathItem`** (`learning-path-item.model.ts`): `learningPathId`, `stageId`, `studentId`, `itemType` (`concept`, `topic`, `practice`, `revision`, `exam`, `goal`, `resource`), `referenceId`, `title`, `description`, `estimatedMinutes`, `priority`, `status` (`locked`, `available`, `in_progress`, `completed`, `skipped`), `masteryBefore`, `masteryAfter`, `order`, `scheduledDate`, `completedAt`.

### 2. Backend Engine Module
Location: `server/src/ai/learning-path/`
- **`types.ts`**: TypeScript definitions and DTOs.
- **`catalog.ts`**: Starter curriculum stages and items across subjects.
- **`rules.ts`**: Prioritization rules (1. Prerequisite gaps, 2. Risk recovery, 3. Exam urgent, 4. Weak mastery, 5. Repeated mistakes, 6. Goals, 7. Career skills, 8. Revision due, 9. Practice, 10. Maintenance), prerequisite unlock threshold (70%), strong mastery threshold (80%).
- **`ai-coach.ts`**: AI natural language guidance with offline fallback.
- **`engine.ts`**: Unified learning path snapshot generator.
- **`service.ts`**: Orchestration service exposing path creation, generation, stage/item completion, item skipping, pause/resume, refresh, teacher overview, and parent summary.

### 3. Controller & Express Router
Location: `server/src/controllers/learning-path.controller.ts` & `server/src/routes/learning-path.routes.ts`

Mounted at `/api/student/learning-path` in `server/src/routes/index.ts`:
- `GET /current`: Fetch active path (`requireRole('student')`)
- `GET /:id`: Fetch path details by ID (`requireRole('student')`)
- `POST /generate`: Generate or regenerate path (`requireRole('student')`)
- `POST /:id/refresh`: Refresh path state (`requireRole('student')`)
- `GET /:id/stages`: Fetch path stages (`requireRole('student')`)
- `GET /:id/items`: Fetch stage items (`requireRole('student')`)
- `POST /:id/items/:itemId/start`: Start item (`requireRole('student')`)
- `POST /:id/items/:itemId/complete`: Complete item (`requireRole('student')`)
- `POST /:id/items/:itemId/skip`: Skip item (`requireRole('student')`)
- `GET /:id/next`: Fetch recommended next item (`requireRole('student')`)
- `GET /:id/summary`: Fetch summary overview (`requireRole('student')`)
- `GET /:id/advice`: Fetch AI coach advice (`requireRole('student')`)
- `GET /teacher/student/:studentId/summary`: Teacher summary (`requireRole('teacher')`)
- `GET /parent/student/:studentId/summary`: Parent summary (`requireRole('parent')`, verified via active link)

---

## Frontend Components

Location: `client/src/components/learning-path/` & `client/src/pages/LearningPathPage.tsx`
- **`LearningPathPage`** (`/learning-path`): Interactive curriculum workspace.
- **`LearningPathHeader`**: Header rendering board, class level, title, and refresh button.
- **`LearningLevelCard`**: Authoritative readiness score indicator.
- **`LearningPathProgress`**: Curriculum progress bar & time budget metrics.
- **`LearningPathNextConcept`**: Recommended next focus card with single-click action.
- **`LearningPathStageCard`**: Stage card rendering tasks, mastery requirements, and completion status.
- **`LearningPathItemCard`**: Item component with start, complete, and skip actions.
- **`LearningPathSummary`**: Summary metric cards.
- **`LearningPathCard`**: Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_learning_path.js` (**35/35 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
