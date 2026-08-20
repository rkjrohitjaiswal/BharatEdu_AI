# Feature 18: AI Adaptive Study Planner & Daily Schedule

## Feature Overview
Feature 18 introduces an **AI Adaptive Study Planner & Daily Schedule** for **BharatEdu AI**. It automatically converts a student's current learning state across Features 1–17 (mastery, gaps, exam countdowns, risk indicators, practice accuracy, goals, mistake review, and career milestones) into a realistic daily and weekly study schedule bounded strictly by their available daily study minutes.

The server remains authoritative for task selection, time budgets (`plannedMinutes <= availableMinutes`), priority ranking, and task completion. AI serves exclusively as an explanation and strategy layer, providing motivation and context without altering numerical metrics or time limits.

---

## Technical Architecture

### 1. Data Model
Location: `server/src/models/study-planner.model.ts`

- **`StudyPlanner` Schema**:
  - `studentId`: Ref to User
  - `date`: Date string (`YYYY-MM-DD`)
  - `weekStart`: Monday start date (`YYYY-MM-DD`)
  - `availableMinutes`: Number (default: 45)
  - `plannedMinutes`: Number (sum of estimated minutes)
  - `completedMinutes`: Number (sum of completed task minutes)
  - `completionPercent`: Bounded percentage (0–100%)
  - `tasks`: Array of `IPlannerTask`
  - `priority`: Top priority title
  - `status`: `'active'` | `'completed'` | `'archived'`
  - `generatedAt`, `updatedAt`: Timestamps

- **Study Task Structure**:
  - `taskId`: Unique task identifier
  - `title`: Actionable task headline
  - `subject`, `topic`: Educational context
  - `taskType`: `'learn'` | `'revise'` | `'practice'` | `'mistake_review'` | `'goal_work'` | `'exam_prep'` | `'weak_topic'` | `'study_plan'` | `'career_skill'`
  - `estimatedMinutes`: Duration (10–15 mins)
  - `priority`: `'CRITICAL'` | `'HIGH'` | `'MEDIUM'` | `'LOW'`
  - `reason`: Authoritative explanation
  - `sourceFeature`: Source feature label
  - `actionUrl`: Navigation target
  - `completed`: Boolean
  - `completedAt`: Timestamp

### 2. Backend Module
Location: `server/src/ai/study-planner/`

- **`types.ts`**: TypeScript definitions for `IPlannerTaskData`, `IDailyPlannerData`, `IWeeklyPlannerDay`, `IWeeklyPlannerData`, `IPlannerSummaryData`, and `IPlannerAdviceData`.
- **`rules.ts`**: Deterministic daily and weekly schedule generator implementing all 16 planning rules.
- **`ai-coach.ts`**: AI schedule strategy & encouragement layer with fallback templates.
- **`engine.ts`**: Authoritative aggregator connecting Features 1–17 and handling persistence for both MongoDB and in-memory fallback modes.
- **`service.ts`**: Service exposing today's plan, weekly plan, generate, refresh, complete task, summary, and advice.

### 3. Controller & Express Router
Location: `server/src/controllers/study-planner.controller.ts` & `server/src/routes/study-planner.routes.ts`

Mounted at `/api/student/study-planner` in `server/src/routes/index.ts`:
- `GET /today`: Fetch today's study plan
- `GET /week`: Fetch Monday–Sunday weekly schedule
- `POST /generate`: Force generate new plan
- `POST /refresh`: Adaptive schedule refresh
- `PATCH /tasks/:taskId/complete`: Complete a task
- `GET /summary`: Summary endpoint for cards & stats

All endpoints use `authenticateJWT` and `requireRole('student')`. Student identity is strictly derived from `req.user.id`.

---

## Frontend Components

Location: `client/src/components/study-planner/` & `client/src/pages/StudyPlannerPage.tsx`

- **`StudyPlannerPage`** (`/study-planner`): Main student study planner dashboard.
- **`PlannerHeader`**: Page header with date and Adaptive Refresh button.
- **`AdaptivePlanNotice`**: Status banner indicating dynamic recalibration.
- **`PlannerPriorityCard`**: Top priority focus banner.
- **`StudyTimeBudget`**: Interactive time selector & available vs. planned stats.
- **`PlannerProgress`**: Visual completion percentage bar.
- **`TodaySchedule`**: List of today's study task cards.
- **`StudyTaskCard`**: Task card with priority badge, estimated duration, reason, completion trigger, and direct navigation.
- **`WeeklyPlanner`**: Monday–Sunday 7-day schedule grid.
- **`PlannerAIInsight`**: AI/fallback strategy banner.
- **`PlannerEmptyState`**: Zero-state prompt.
- **`StudyPlannerCard`**: Compact dashboard card on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_study_planner.js` (**30/30 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
