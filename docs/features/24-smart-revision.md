# Feature 24: AI Smart Revision & Spaced Repetition Engine

## Feature Overview
Feature 24 introduces the **AI Smart Revision & Spaced Repetition Engine** for **BharatEdu AI**. The system calculates WHAT a student should revise, WHEN they should revise it, and WHY it is important using a server-authoritative spaced repetition algorithm (SuperMemo-2 derivative with bounded ease factor between 1.3 and 3.5) combined with Knowledge Graph prerequisite relationships (Feature 21), learning gaps (Feature 1), adaptive assessment history (Feature 22), exam preparation urgency (Feature 9), study planner time budgets (Feature 18), risk prediction (Feature 12), student goals (Feature 8), resource hub (Feature 23), and notification system (Feature 11).

The backend remains authoritative:
- **Server-Controlled Spaced Repetition**: Client submits ONLY `outcome` (`again`, `hard`, `good`, `easy`). Server authoritatively calculates `newInterval`, `newEaseFactor`, `nextReviewAt`, `reviewCount`, `successfulReviews`, and `failedReviews`.
- **Prerequisite-First Revision**: Knowledge Graph prerequisite gaps (e.g. Linear Equations before Quadratic Equations) take priority before target concepts.
- **Exam-Aware Frequency**: Scales review frequency based on exam proximity (>30d, 14–30d, 7–14d, <7d critical mode).
- **Time Budget Cap**: Revision tasks fit strictly within the student's `availableDailyMinutes`.

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/revision-item.model.ts` & `server/src/models/revision-history.model.ts`

- **`RevisionItem` Schema**:
  - `studentId`, `topicId`, `topic`, `conceptId`, `subject`, `sourceType`, `sourceId`, `lastReviewedAt`, `nextReviewAt`, `reviewCount`, `successfulReviews`, `failedReviews`, `currentIntervalDays`, `easeFactor`, `difficulty`, `masteryScore`, `confidenceScore`, `priority`, `status`.
  - Unique index on `{ studentId, conceptId }`.

- **`RevisionHistory` Schema**:
  - `studentId`, `revisionItemId`, `conceptId`, `topicId`, `reviewedAt`, `outcome`: `'again'` | `'hard'` | `'good'` | `'easy'`, `previousInterval`, `newInterval`, `previousEaseFactor`, `newEaseFactor`, `responseTimeSeconds`, `source`.

### 2. Backend Module Architecture
Location: `server/src/ai/smart-revision/`

- **`types.ts`**: TypeScript definitions for revision items, outcomes, queue summaries, and schedules.
- **`rules.ts`**: Spaced repetition algorithm (`calculateSpacedRepetitionNextState`), priority rules (`determineRevisionPriority`), and estimated minutes.
- **`ai-coach.ts`**: Natural language advice layer with offline fallback templates.
- **`engine.ts`**: Aggregates student context across Features 1–23 to generate daily revision queues and 7–30 day forecasts.
- **`service.ts`**: Service exposing `getDailyRevisionQueue`, `getRevisionSchedule`, `startRevisionSession`, `completeRevisionOutcome`, `refreshStudentRevisionQueue`, teacher overview, and parent summary.

### 3. Controller & Express Router
Location: `server/src/controllers/revision.controller.ts` & `server/src/routes/revision.routes.ts`

Mounted at `/api/student/revision` in `server/src/routes/index.ts`:
- `GET /today`: Daily revision queue (`requireRole('student')`)
- `GET /schedule`: 7–30 day revision forecast (`requireRole('student')`)
- `POST /refresh`: Recalculate revision queue (`requireRole('student')`)
- `POST /:id/start`: Start revision session (`requireRole('student')`)
- `POST /:id/complete`: Authoritatively submit revision outcome (`requireRole('student')`)
- `GET /teacher/student/:studentId/summary`: Teacher summary (`requireRole('teacher')`)
- `GET /parent/student/:studentId/summary`: Parent progress summary (`requireRole('parent')`, verified via parent-student link)

---

## Frontend Components

Location: `client/src/components/revision/` & `client/src/pages/SmartRevisionPage.tsx`

- **`SmartRevisionPage`** (`/revision`): Full Student Revision Workspace.
- **`RevisionTodaySummary`**: Summary metrics (Total Due, Critical Count, High Priority, Est. Time).
- **`RevisionAIInsight`**: AI Coach recommendation drawer.
- **`RevisionSchedule`**: 7-day spaced-repetition forecast card.
- **`RevisionCard`**: Card rendering item details, reason, difficulty, and 4 outcome buttons (`Again`, `Hard`, `Good`, `Easy`).
- **`RevisionPriorityBadge` & `RevisionReason`**: Priority badges and human-readable reason cards.
- **`SmartRevisionCard`**: Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_smart_revision.js` (**30/30 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
