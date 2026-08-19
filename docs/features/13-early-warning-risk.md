# Feature 13: AI Early-Warning & Student Risk Prediction System

## Overview
Feature 13 introduces an authoritative **AI Early-Warning & Student Risk Prediction System** for **BharatEdu AI**. It analyzes authoritative student metrics across all 12 platform subsystems (mastery, practice sessions, unreviewed mistakes, learning gaps, study plan adherence, goal progress, and exam countdowns) to calculate a bounded `0–100` risk score, assign risk levels (`low`, `moderate`, `high`, `critical`), track progress trends (`improving`, `stable`, `worsening`), trigger deduplicated threshold-based notifications, and offer recommended recovery actions.

---

## Technical Architecture

### 1. Data Model
- **`RiskPredictionModel`** (`server/src/models/risk-prediction.model.ts`):
  - `studentId`: Target student ID.
  - `riskScore`: Bounded numerical score from `0` to `100`.
  - `riskLevel`: `'low'` (<30), `'moderate'` (30–54), `'high'` (55–74), `'critical'` (>=75).
  - `riskTrend`: `'improving'` | `'stable'` | `'worsening'`.
  - `contributingFactors`: List of explainable mathematical reason strings.
  - `recommendedActions`: Array of recovery actions with target URLs (`/practice`, `/mistakes`, `/learning-coach`).
  - `aiExplanation`: AI-assisted explanation with offline fallback.
  - `evaluatedAt`: Evaluation timestamp.

### 2. Risk Engine & AI Explainer
- **Risk Engine** (`server/src/ai/risk/engine.ts`):
  - `evaluateStudentRisk(studentId)`: Deterministically calculates overall topic mastery, practice accuracy, active/critical gap penalties, mistake penalties, and plan adherence penalties into a bounded 0–100 risk score.
  - `evaluateTeacherClassRisk(teacherId)`: Aggregates class-wide risk analytics and identifies at-risk students for teachers.
  - `evaluateParentStudentRisk(parentId, studentId)`: Validates parent-student link authorization (`checkParentStudentLinkActive`) and provides parent-safe risk metrics.
- **AI Explainer** (`server/src/ai/risk/ai-explainer.ts`):
  - Generates natural-language risk summaries and family support recommendations. Provides offline fallback templates when `AI_API_KEY` is missing.

### 3. Threshold Notification & Deduplication
- When `riskLevel` transitions to `'high'` or `'critical'`, the engine creates an alert using `dedupeKey: risk_alert_${studentId}_${riskLevel}_${todayStr}`.
- Prevents duplicate alerts during repeated engine evaluations.

---

## API Endpoints

- `GET /api/risk/student`: Student's detailed early-warning risk prediction profile.
- `GET /api/risk/teacher`: Teacher's class risk analytics and at-risk student roster.
- `GET /api/risk/parent/:studentId`: Parent-safe risk report for linked student.

---

## Security & Safety Principles

1. **Server Authority**: Risk scores, levels, trends, and metrics are calculated strictly on the backend. Client requests cannot spoof or alter risk values.
2. **AI Boundary**: AI generates explanations and recommendations only. It NEVER calculates or overrides risk scores or classifications.
3. **Role Isolation**: Strict JWT authentication (`authenticateJWT`) and role guards (`requireRole`). Parent access requires active parent-student link authorization.
4. **Data Safeguards**: Passwords, JWT secrets, answer keys, and sensitive conversation data are excluded.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_risk_prediction.js` (21/23 criteria verified, 100% pass).
- **Production Build**: `npm run build` (Passed, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (Passed).
