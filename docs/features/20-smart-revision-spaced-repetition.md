# Feature 20: AI Personalized Revision & Spaced-Repetition Engine

## Feature Overview
Feature 20 introduces an **AI Personalized Revision & Spaced-Repetition Engine** for **BharatEdu AI**. It dynamically calculates what a student should revise, when they should revise it, how urgently, and for how long, using real learning evidence from Features 1–19 (mistakes, practice history, gaps, exams, goals, risk, mentor, resources, planner, and analytics).

The system uses a server-side deterministic retention model (0–100) and spaced-repetition interval progression (1d -> 2d -> 4d -> 7d -> 14d -> 30d -> 60d). AI acts strictly as an explanation, strategy, and motivation layer without altering authoritative retention scores, priority scores, next review dates, exam readiness, or risk ratings.

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/revision-item.model.ts` & `server/src/models/revision-session.model.ts`

- **`RevisionItem` Schema**:
  - `studentId`: Ref to User
  - `subject`, `topic`, `subtopic`
  - `sourceType`: `'mistake'` | `'practice'` | `'learning_gap'` | `'exam'` | `'goal'` | `'resource'` | `'manual'`
  - `masteryScore`, `retentionScore`: Bounded 0–100
  - `difficulty`: `'beginner'` | `'intermediate'` | `'advanced'`
  - `priority`: `'CRITICAL'` | `'HIGH'` | `'MEDIUM'` | `'LOW'`
  - `reviewLevel`: `'new'` | `'learning'` | `'reinforcing'` | `'retained'` | `'mastered'`
  - `intervalDays`, `repetitionCount`, `lastReviewedAt`, `nextReviewAt`, `lastResult`, `consecutiveCorrect`, `consecutiveIncorrect`, `overdue`
  - `status`: `'active'` | `'due'` | `'overdue'` | `'mastered'` | `'paused'` | `'archived'`
  - Compound Index: `{ studentId: 1, topic: 1 }` (unique).

- **`RevisionSession` Schema**:
  - `studentId`, `revisionItemId`, `topic`, `startedAt`, `completedAt`
  - `plannedMinutes`, `actualMinutes`, `questionsAttempted`, `questionsCorrect`, `accuracy`
  - `result`: `'failed'` (<40%), `'weak'` (40-59%), `'passed'` (60-79%), `'strong'` (80-100%)
  - `retentionBefore`, `retentionAfter`, `nextReviewAt`

### 2. Backend Spaced-Repetition Module
Location: `server/src/ai/revision/`

- **`types.ts`**: TypeScript definitions.
- **`rules.ts`**: Deterministic retention score calculation (0–100), priority weighting (retention decay 25%, learning gap 20%, exam urgency 20%, mistake 15%, mastery weakness 10%, goal 5%, risk 5%), accuracy-to-result mapping, and interval progression algorithm.
- **`ai-coach.ts`**: AI revision advice & strategy layer with offline fallback templates.
- **`engine.ts`**: Snapshot aggregator across Features 1–19 and persistence engine (MongoDB + in-memory fallback).
- **`service.ts`**: Service exposing daily plan, weekly plan, summary, due/overdue items, session start, and session completion.

### 3. Controller & Express Router
Location: `server/src/controllers/revision.controller.ts` & `server/src/routes/revision.routes.ts`

Mounted at `/api/student/revision` in `server/src/routes/index.ts`:
- `GET /today`: Today's revision plan
- `GET /week`: 7-Day revision schedule
- `GET /summary`: Summary stats
- `GET /due`: Due items
- `GET /overdue`: Overdue items
- `GET /:id`: Revision item detail
- `POST /generate`: Force generate revision items
- `POST /refresh`: Refresh revision plan
- `POST /:id/start`: Start review session
- `POST /:id/complete`: Complete review session (server calculates accuracy, result, interval, and next review date)

All endpoints protected by `authenticateJWT` and `requireRole('student')`. Identity is derived strictly from `req.user.id`.

---

## Frontend Components

Location: `client/src/components/revision/` & `client/src/pages/RevisionPage.tsx`

- **`RevisionPage`** (`/revision`): Main student Smart Revision page.
- **`RevisionHeader`**: Header with plan refresh trigger.
- **`RevisionSummary`**: Stat grid (due, overdue, average retention, mastered, streak).
- **`RevisionTaskCard`**: Task card showing subject, topic, review level, retention meter, priority, due date, reason, and start review trigger.
- **`RevisionRetentionMeter`**: Visual 0–100 retention meter with informational levels (`Critical`, `Weak`, `Developing`, `Strong`, `Retained`).
- **`RevisionOverdueCard`**: Highlighted card for overdue items.
- **`RevisionDueCard`**: Due topics section.
- **`RevisionWeeklyPlan`**: 7-day spaced repetition schedule.
- **`RevisionAIInsight`**: AI/fallback strategy banner.
- **`RevisionEmptyState`**: Zero-state prompt.
- **`RevisionCard`**: Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_revision_engine.js` (**40/40 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
