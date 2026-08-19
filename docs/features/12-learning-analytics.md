# Feature 12: AI Learning Analytics & Insights Dashboard

## Overview
Feature 12 introduces a comprehensive, multi-role **AI Learning Analytics & Insights Dashboard** for **BharatEdu AI**. It synthesizes learning data across all 11 existing platform subsystems into deterministic metrics, subject/topic mastery trends, study plan adherence, goal progress, exam readiness, career skill development, early-warning risk indicators, and role-scoped AI weekly summaries.

---

## Key Features

1. **Student Analytics Dashboard (`GET /api/analytics/student`):**
   - **Overall Topic Mastery**: Weighted average of topic mastery scores (bounded 0–100%).
   - **Practice Accuracy & Activity**: Practice session accuracy percentage and total questions attempted.
   - **Study Plan Adherence**: Completion rate of daily study plan tasks.
   - **Gap Resolution Trends**: Total, active, resolved, and critical learning gap metrics.
   - **Goals & Achievements Progress**: Active vs completed goals, unlocked achievement badges.
   - **Exam Readiness Progression**: Days remaining and readiness scores across active exam preps.
   - **Career Skill Progression**: Target role readiness and skill score tracking.
   - **Deterministic Early-Warning Risk Indicators**: Authoritative risk level (`low`, `moderate`, `high`, `critical`) and mathematical risk factors.
   - **AI Weekly Learning Summary**: Concise natural-language summary (with fallback template when `AI_API_KEY` is missing).

2. **Teacher Class Analytics (`GET /api/analytics/teacher`):**
   - **Class Overview**: Total students, class average mastery, and class practice accuracy.
   - **Student Performance Indicators**: List of improving students and struggling students (with risk profiles).
   - **Remediation & Intervention Effectiveness**: Percentage of assigned teacher interventions completed with resolved gaps.
   - **AI Class Intelligence Summary**: Concise summary for teachers with fallback template.

3. **Parent-Safe Progress Report (`GET /api/analytics/parent/:studentId`):**
   - **Parent Authorization Guard**: Strict link validation via `checkParentStudentLinkActive`. Unlinked parents receive HTTP `403`.
   - **Privacy Protection**: Exposes high-level mastery, study time, active gap counts, and highlights without exposing correct answers, passwords, or raw responses.
   - **AI Family Summary**: Clear, supportive 2-sentence progress summary for parents.

---

## Technical Architecture

- **`LearningAnalyticsModel`** (`server/src/models/learning-analytics.model.ts`): Schema for storing analytics snapshots.
- **Analytics Types** (`server/src/ai/analytics/types.ts`): TypeScript interfaces for analytics responses and risk profiles.
- **Analytics Engine** (`server/src/ai/analytics/engine.ts`): Deterministic aggregation engine that queries `dataRepository`.
- **AI Summarizer** (`server/src/ai/analytics/ai-summarizer.ts`): OpenAI completion generator with offline fallback templates.
- **Express Controller & Router** (`server/src/controllers/analytics.controller.ts`, `server/src/routes/analytics.routes.ts`): JWT-authenticated endpoints mounted under `/api/analytics`.

---

## Security & Architectural Guarantees

1. **Backend Authority**: Numerical scores, progress metrics, and risk classifications are calculated strictly by server logic. Client requests cannot modify or spoof analytics.
2. **AI Boundary**: AI generates explanations and summaries only. It NEVER calculates or alters mastery, risk levels, or eligibility.
3. **Role Isolation**: Students access only `/api/analytics/student`, teachers access `/api/analytics/teacher`, and parents access `/api/analytics/parent/:studentId` for linked students.
4. **Data Privacy**: Passwords, JWT secrets, answer keys, and sensitive data are strictly excluded.

---

## Verification Results

- **Feature Test Suite**: `scratch/test_learning_analytics.js` (23/23 criteria passed).
- **Production Build**: `npm run build` (Passed, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (Passed).
