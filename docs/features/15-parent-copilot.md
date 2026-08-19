# Feature 15: AI Parent Copilot

## Overview
Feature 15 introduces the **AI Parent Copilot** for **BharatEdu AI**. It empowers parents to understand their linked child's learning progress without technical jargon, offering supportive progress insights, positive strengths, worth-reviewing topics, recommended home-support actions, and a tailored Monday-to-Friday home support plan.

---

## Technical Architecture

### 1. Backend Module
Location: `server/src/ai/parent-copilot/`

- **`types.ts`**: Defines `ParentCopilotStudentSnapshot`, `ParentCopilotAdvice`, `IParentRecommendation`, and `IParentWeeklyPlanDay`.
- **`rules.ts`**: Implements deterministic priority rules evaluating student metrics across 10 levels (Critical Risk -> Critical Gaps -> Repeated Misconceptions -> Exam Urgency -> Low Mastery -> Practice Inactivity -> Study Plan Adherence -> Goal Delay -> Normal Revision -> Positive Reinforcement). Generates Monday to Friday home-support plan.
- **`ai-coach.ts`**: AI explanation and parent guidance synthesis layer. Uses warm, supportive language ("showing improvement", "a good area to practice", "worth reviewing"). Includes offline template fallbacks when `AI_API_KEY` is missing and sanitizes output against secret/token leakage.
- **`engine.ts`**: Snapshot builder collecting authoritative metrics across all 14 prior features. Excludes private tutor conversations, passwords, tokens, answer keys, and private teacher notes.
- **`service.ts`**: High-level service enforcing active parent-student link validation.

### 2. Authorization & Privacy Safeguards
- **Role Guard**: `requireRole('parent')` restricts endpoints exclusively to authenticated parents (`403` for students/teachers, `401` for unauthenticated).
- **Parent Link Validation**: `dataRepository.checkParentStudentLinkActive(parentId, studentId)` ensures Parent A cannot access Parent B's students or unlinked students (`403`).
- **Authoritative Backend**: Mastery, risk scores, gap severity, practice accuracy, and exam readiness are calculated strictly on the backend. AI cannot calculate, override, or invent student data.
- **Data Safeguards**: Passwords, JWT secrets, answer keys, `correctAnswer`, private teacher notes, and sensitive conversation data are strictly excluded.
- **Output Safeguards**: Every AI-generated output is explicitly tagged `"AI-generated guidance"`.

---

## API Endpoints

- **`GET /api/parent/copilot/students`**: Returns only linked students for the authenticated parent.
- **`GET /api/parent/copilot/student/:studentId`**: Returns parent-safe learning snapshot.
- **`POST /api/parent/copilot/student/:studentId/advice`**: Generates AI/deterministic parent guidance.
- **`GET /api/parent/copilot/student/:studentId/weekly-plan`**: Returns weekly home-support plan.

---

## Frontend Components

Location: `client/src/components/parent-copilot/` & `client/src/pages/ParentCopilotPage.tsx`

- **`ParentCopilotPage`** (`/parent/copilot`): Main dashboard page.
- **`ParentStudentSelector`**: Dropdown filtering linked children.
- **`ParentLearningSummary`**: High-level progress cards & risk meter with supportive wording.
- **`ParentWeeklySupportPlan`**: Monday to Friday home support plan component.
- **`ParentRecommendedActions`**: Explainable home-support actions with priority badges.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_parent_copilot.js` (**31/31 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
