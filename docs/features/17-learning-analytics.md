# Feature 17: AI Learning Analytics & Progress Insights

## Feature Overview
Feature 17 introduces **AI Learning Analytics & Progress Insights** for **BharatEdu AI**. It transforms authoritative learning data across Features 1–16 into accessible progress insights, subject performance metrics, topic recommendations, practice activity breakdowns, study consistency scores, learning gap progress, goal trends, exam readiness trends, risk status, weekly learning reports, and AI progress explanations.

The system does NOT calculate or alter any deterministic metrics. Server backend engines remain authoritative for all numerical scores, mastery, accuracy, risk scores, readiness, gaps, and goal progress.

---

## Technical Architecture

### 1. Backend Module
Location: `server/src/ai/learning-analytics/`

- **`types.ts`**: TypeScript definitions for `OverallProgressMetrics`, `SubjectAnalyticsData`, `TopicAnalyticsData`, `LearningGapProgressData`, `PracticeAnalyticsData`, `ConsistencyScoreData`, `GoalAnalyticsData`, `ExamReadinessTrendData`, `RiskAnalyticsData`, `WeeklyLearningReportData`, and `AnalyticsAdviceData`.
- **`rules.ts`**: Deterministic rule classification functions for:
  - Progress trend (`improving` | `stable` | `declining` | `insufficient_data`)
  - Subject status (`strong` | `improving` | `needs_attention` | `critical` | `insufficient_data`)
  - 0–100 Consistency Score calculation based on practice days, schedule adherence, streak, and study volume.
  - Topic recommendation prioritization (critical gaps -> high gaps -> declining mastery -> low mastery -> repeated mistakes).
  - Weekly learning report wins, areas needing attention, and next-week priorities derivation.
- **`ai-coach.ts`**: AI analytics explainer layer. Prompted with strict non-fabrication system instructions. Provides fallback text when `AI_API_KEY` is missing and sanitizes output against secret/token leakage.
- **`engine.ts`**: Authoritative snapshot aggregator pulling data from masteries, practice history, learning gaps, mistake review, study plans, goals, achievements, exam preps, and risk profiles.
- **`service.ts`**: Service providing overview, subjects, topics, practice, weekly, advice, and summary orchestration.

### 2. Express Controller & Security Scoping
Location: `server/src/controllers/learning-analytics.controller.ts` & `server/src/routes/learning-analytics.routes.ts`

- **`GET /api/student/analytics/overview`**: Returns overall progress & consistency.
- **`GET /api/student/analytics/subjects`**: Returns subject-level analytics.
- **`GET /api/student/analytics/topics`**: Returns topic performance & recommendations.
- **`GET /api/student/analytics/practice`**: Returns practice activity breakdown & daily activity timeline.
- **`GET /api/student/analytics/weekly`**: Returns weekly report, gap progress, goal analytics, and exam readiness trend.
- **`GET /api/student/analytics/advice`**: Returns AI/fallback analytics advice.
- **`GET /api/student/analytics/summary`**: Returns concise analytics summary.

Security Scoping:
- Authenticated using `authenticateJWT` and restricted to students via `requireRole('student')`.
- Student identity derived strictly from `(req as any).user.id`.
- Rejects teacher/parent role requests with `403` and unauthenticated requests with `401`.
- Client cannot spoof `studentId`.

---

## Frontend Components

Location: `client/src/components/learning-analytics/` & `client/src/pages/LearningAnalyticsPage.tsx`

- **`LearningAnalyticsPage`** (`/analytics`): Primary analytics dashboard page for students.
- **`AnalyticsOverview`**: Stat cards for overall mastery, accuracy, questions solved, study time, and streak.
- **`ProgressTrendCard`**: Highlight card displaying overall progress trend badge.
- **`SubjectAnalytics`**: Grid of subject performance cards.
- **`TopicAnalytics`**: Topic performance & prioritized recommendation list.
- **`PracticeAnalytics`**: Correct/incorrect breakdown and daily practice activity timeline.
- **`ConsistencyScore`**: 0–100 study consistency meter & contributing factors.
- **`LearningGapProgress`**: Total, critical, high, and medium gap counters with trend.
- **`GoalAnalytics`**: Active goals, completed goals, and average progress.
- **`ExamReadinessTrend`**: Exam readiness countdown & preparedness level.
- **`RiskTrend`**: Risk status & recommended recovery action.
- **`WeeklyLearningReport`**: Weekly wins, attention areas, and next-week priorities.
- **`AnalyticsAIInsight`**: AI/fallback natural language progress explanation banner.
- **`LearningAnalyticsCard`**: Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_learning_analytics.js` (**30/30 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
