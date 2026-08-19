# Feature 8: Student Goals, Milestones & Achievement System

## Overview
Feature 8 empowers students on the BharatEdu AI platform to set personalized learning goals, track target progress, reach milestones, and earn deterministic achievement badges based on real study activity.

---

## Technical Architecture

### 1. Data Models
- **`StudentGoal`** (`server/src/models/student-goal.model.ts`): Stores goals with fields `studentId`, `title`, `description`, `goalType`, `targetValue`, `currentValue`, `unit`, `targetDate`, `status` (`active` | `completed` | `paused` | `expired`), `progressPercent`, `completedAt`.
- **`Achievement`** (`server/src/models/achievement.model.ts`): Stores earned badges with compound unique index on `{ studentId: 1, achievementType: 1, evidenceId: 1 }` preventing duplicate badges and guaranteeing idempotency.

### 2. Engine & Progress Calculation
- **`AchievementRulesEngine`** (`server/src/ai/achievements/rules.ts`): Evaluates 12 system rules (`first_practice`, `questions_10`, `questions_50`, `questions_100`, `streak_7`, `streak_14`, `streak_30`, `first_topic_mastered`, `topics_5_mastered`, `subject_mastery_80`, `accuracy_90`, `goal_completed`) against authoritative database activity.
- **`GoalProgressCalculator`** (`server/src/learning-goals/progress.ts`): Computes `currentValue` and `progressPercent` (bounded 0–100%) server-side from practice session counts, topic mastery, and study activity.
- **`GoalService`** (`server/src/learning-goals/service.ts`): Manages goal lifecycle and triggers goal auto-completion (`status = completed`) when `currentValue >= targetValue`.

### 3. Authorization & Security
- All endpoints use `authenticateJWT` + `requireRole('student')`.
- All database queries scope strictly to `req.user.id`.
- Client payload fields (`studentId`, `currentValue`, `progressPercent`, `status`, `completedAt`) are stripped by the controller to prevent progress spoofing.

---

## API Endpoints

### Student Goals
- `POST /api/student/goals`: Create a goal (requires `title`, `targetValue > 0`).
- `GET /api/student/goals`: Retrieve authenticated student's goals.
- `GET /api/student/goals/:id`: Get goal by ID.
- `PUT /api/student/goals/:id`: Update goal title/description/targetDate.
- `PUT /api/student/goals/:id/pause`: Pause goal.
- `PUT /api/student/goals/:id/resume`: Resume goal.
- `DELETE /api/student/goals/:id`: Delete goal.

### Achievements
- `GET /api/student/achievements`: Retrieve earned achievement badges.
- `GET /api/student/achievements/summary`: Retrieve summary statistics (`totalAchievements`, `currentStreak`, `goalsCompleted`, `nextMilestones`).

---

## UI Components
- **`StudentGoalsPage.tsx`** (`/goals`): Dedicated student goals management dashboard.
- **`AchievementsPage.tsx`** (`/achievements`): Badges and milestones showcase page.
- **`StudentGoalsCard.tsx`**: Dashboard card displaying active goals.
- **`AchievementSummaryCard.tsx`**: Dashboard card displaying badge summary.

---

## Empirical Verification
- **Test Suite**: `scratch/test_student_goals.js` (20 test criteria passed).
- **Regression Suite**: `scratch/test_full_regression.js` (Passed).
- **Build**: `npm run build` (Passed, 0 errors).
- **GitHub Commit**: `1a6322e` pushed to `origin/main`.
