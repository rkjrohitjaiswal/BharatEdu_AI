# Feature 14: AI Teacher Copilot

## Overview
Feature 14 introduces the **AI Teacher Copilot** for **BharatEdu AI**. It empowers teachers to select an authorized student from their class roster, analyze their complete learning snapshot, receive deterministic & AI-enhanced recommendations, view a tailored weekly teacher action plan, and generate professional parent communication drafts.

---

## Technical Architecture

### 1. Backend Module
Location: `server/src/ai/teacher-copilot/`

- **`types.ts`**: Defines `TeacherCopilotStudentSnapshot`, `TeacherCopilotAdvice`, `IExplainableRecommendation`, `IWeeklyPlanDay`, and `TeacherParentMessageDraft`.
- **`rules.ts`**: Implements deterministic priority rules evaluating student data across 10 levels (Critical Risk -> Critical Gaps -> Repeated Misconceptions -> Exam Urgency -> Low Mastery -> Low Practice Accuracy -> Study Plan Adherence -> Goal Delay -> Career Skill Gap -> Normal Revision). Generates Monday to Friday weekly action plan.
- **`ai-coach.ts`**: AI explanation and recommendation synthesis layer. Provides offline template fallbacks when `AI_API_KEY` is missing and sanitizes output against secret/token leakage.
- **`engine.ts`**: Collects authoritative metrics from `dataRepository`, topic masteries, learning gaps, practice history, mistake review, study plans, goals, exam readiness, career progress, and interventions into a unified student snapshot.
- **`service.ts`**: High-level service enforcing teacher-student ownership validation.

### 2. Authorization & Security Model
- **Role Guard**: `requireRole('teacher')` restricts endpoints exclusively to authenticated teachers (`403` for students/parents, `401` for unauthenticated).
- **Teacher Ownership Validation**: `dataRepository.validateTeacherStudentOwnership(teacherId, studentId)` ensures Teacher A cannot access Teacher B's students.
- **Authoritative Backend**: Numerical scores, risk levels, masteries, and gap classifications are calculated strictly by the server. AI cannot calculate, override, or invent performance data.
- **Output Safeguards**: Every AI-generated output is explicitly tagged `"AI-generated recommendation"` or `"AI-generated draft — review before sending."` Sensitive keywords (passwords, tokens, answer keys, private tutor messages) are strictly redacted.

---

## API Endpoints

- **`GET /api/teacher/copilot/students`**: Returns only authorized students in the authenticated teacher's roster.
- **`GET /api/teacher/copilot/student/:studentId`**: Returns an authoritative student intelligence snapshot.
- **`POST /api/teacher/copilot/student/:studentId/advice`**: Generates teacher copilot advice & weekly action plan.
- **`POST /api/teacher/copilot/student/:studentId/parent-message`**: Generates a teacher-friendly parent communication draft.

---

## Frontend Components

Location: `client/src/components/teacher-copilot/` & `client/src/pages/TeacherCopilotPage.tsx`

- **`TeacherCopilotPage`** (`/teacher/copilot`): Main dashboard page.
- **`TeacherStudentSelector`**: Dropdown filtering authorized roster.
- **`TeacherStudentSummary`**: Student performance cards & mastery/risk meter.
- **`TeacherWeeklyPlan`**: Monday to Friday action plan.
- **`TeacherRecommendedActions`**: Explainable recommendations with priority badges and direct execution links.
- **`TeacherParentMessage`**: Draft generator with copy-to-clipboard functionality and review disclaimer.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_teacher_copilot.js` (**25/25 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
