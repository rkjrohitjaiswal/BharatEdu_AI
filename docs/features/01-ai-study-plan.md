# Feature 1: AI-Powered Personalized Study Plan Generator

**Feature Title:** AI-Powered Personalized Study Plan Generator  
**Implementation Date:** August 19, 2026  
**Repository:** `BharatEdu AI`  
**Feature Status:** 🟢 **COMPLETE**

---

## Executive Summary

The **AI-Powered Personalized Study Plan Generator** transforms a student's real-time learning profile, topic mastery, learning gaps, prerequisite constraints, recommended topics, and daily available study time into a structured, actionable daily or weekly study plan.

Key System Highlights:
- **Deterministic Prioritization Engine:** Enforces strict pedagogical task ordering (`Critical Gaps -> High Gaps -> Prerequisite Gaps -> Misconceptions -> Weak Mastery (<60%) -> Recommendations -> Revision`). The LLM does not alter mastery scores, risk levels, or priority scores.
- **Time Allocation Bounds:** Guarantees `sum(task.estimatedMinutes) <= availableDailyMinutes` so generated schedules are realistic and achievable.
- **Zero-Dependency AI Reason Fallback:** Uses OpenAI (`gpt-4o-mini`) to enrich task descriptions with personalized pedagogical encouragement. If `AI_API_KEY` is unconfigured or offline, it falls back cleanly to deterministic template strings with 0 downtime.
- **Interactive Student UI Component ([`StudyPlanCard.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/components/dashboard/StudyPlanCard.tsx)):** Provides "Generate Plan" and "Regenerate Plan" controls, duration toggles (`Daily` / `Weekly`), time customization inputs, task completion checkboxes, and direct deep-links to Practice (`/practice`) and AI Tutor (`/tutor`).

---

## Section 1: Architecture & Data Flow

```
Student Learning State (TopicMastery + LearningGaps + LearningProfile)
 ↓
REST API Request (POST /api/student/study-plan/generate)
 ↓
Authentication & Role Middleware (authenticateJWT -> requireRole('student'))
 ↓
StudyPlanRulesEngine (Determines task priorities & time allocation bounds)
 ↓
StudyPlanAIEnricher (Enriches reasons via OpenAI or deterministic template fallback)
 ↓
StudyPlan Storage (Archives previous active plans & saves new StudyPlan document)
 ↓
Interactive Frontend Rendering (StudyPlanCard.tsx with completion toggles & deep-links)
```

---

## Section 2: Component Inventory & Files Created / Modified

| File Path | Component Purpose | Status |
| :--- | :--- | :---: |
| [`types.ts`](file:///c:/Project/BharatEdu%20AI/server/src/ai/study-plan/types.ts) | TypeScript interfaces for options, prioritized tasks, and plan payloads. | 🟢 **NEW** |
| [`rules.ts`](file:///c:/Project/BharatEdu%20AI/server/src/ai/study-plan/rules.ts) | Deterministic 7-tier topic prioritization engine & time allocation bounds. | 🟢 **NEW** |
| [`ai-enricher.ts`](file:///c:/Project/BharatEdu%20AI/server/src/ai/study-plan/ai-enricher.ts) | OpenAI reason enricher with zero-dependency fallback. | 🟢 **NEW** |
| [`planner.ts`](file:///c:/Project/BharatEdu%20AI/server/src/ai/study-plan/planner.ts) | Main `StudyPlanGenerator` orchestrator class. | 🟢 **NEW** |
| [`study-plan.controller.ts`](file:///c:/Project/BharatEdu%20AI/server/src/controllers/study-plan.controller.ts) | Controller handling generate, fetch current, and update task status endpoints. | 🟢 **NEW** |
| [`study-plan.routes.ts`](file:///c:/Project/BharatEdu%20AI/server/src/routes/study-plan.routes.ts) | Authenticated student router mounted under `/api/student/study-plan`. | 🟢 **NEW** |
| [`data.repository.ts`](file:///c:/Project/BharatEdu%20AI/server/src/repositories/data.repository.ts#L703) | Added `saveGeneratedStudyPlan` method with plan archiving support. | 🟢 **MODIFIED** |
| [`StudyPlanCard.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/components/dashboard/StudyPlanCard.tsx) | Upgraded dashboard card with interactive generation modal and deep-links. | 🟢 **MODIFIED** |
| [`api.ts`](file:///c:/Project/BharatEdu%20AI/client/src/services/api.ts#L500) | Added `generateStudyPlan`, `fetchCurrentStudyPlan`, and `updateStudyTaskStatus`. | 🟢 **MODIFIED** |

---

## Section 3: REST API Endpoints

### 1. Generate Study Plan
- **Endpoint:** `POST /api/student/study-plan/generate`
- **Headers:** `Authorization: Bearer <student_jwt>`
- **Request Body:**
  ```json
  {
    "dailyStudyMinutes": 60,
    "planDuration": "daily",
    "preferredLanguage": "english"
  }
  ```
- **Response Payload (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Personalized study plan generated successfully",
    "data": {
      "_id": "plan_1787153784_a1b2",
      "title": "Today's Targeted Study Schedule",
      "description": "Tailored daily plan for Class 8 focusing on active gaps and weak concepts.",
      "tasks": [
        {
          "_id": "task_1787153784_0",
          "title": "Learn Algebraic Expressions & Identities",
          "taskType": "learn",
          "estimatedMinutes": 30,
          "completed": false,
          "reason": "Recommended core topic for Class 8 Mathematics.",
          "priority": "medium"
        }
      ],
      "status": "active"
    }
  }
  ```

### 2. Fetch Current Active Plan
- **Endpoint:** `GET /api/student/study-plan/current`
- **Headers:** `Authorization: Bearer <student_jwt>`
- **Response Payload (`200 OK`):** Returns active `StudyPlan` document.

### 3. Update Task Completion
- **Endpoint:** `PUT /api/student/study-plan/tasks/:taskId`
- **Request Body:** `{ "completed": true }`
- **Response Payload (`200 OK`):** `{ "success": true, "message": "Study task completed successfully" }`

---

## Section 4: Security & Ownership Matrix

| Resource / Endpoint | Student A | Student B | Teacher | Unauthenticated | Security Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `POST /api/student/study-plan/generate` | 🟢 201 | 🟢 201 | 🔴 403 | 🔴 401 | 🟢 **VERIFIED** |
| `GET /api/student/study-plan/current` | 🟢 200 (Own) | 🟢 200 (Own) | 🔴 403 | 🔴 401 | 🟢 **VERIFIED** |
| `PUT /api/student/study-plan/tasks/:taskId` | 🟢 200 (Own) | 🔴 404 | 🔴 403 | 🔴 401 | 🟢 **VERIFIED** |

---

## Section 5: Automated Verification & Production Build Output

- **Test Suite Execution:** `node scratch/test_study_plan.js` passed 100%.
- **Production Build Verification (`npm run build`):**
  ```
  > bharatedu-ai@1.0.0 build
  > npm run build:server && npm run build:client

  > bharatedu-ai-server@1.0.0 build
  > tsc

  > bharatedu-ai-client@1.0.0 build
  > tsc && vite build

  vite v5.4.21 building for production...
  ✓ 1541 modules transformed.
  rendering chunks...
  dist/index.html                   0.83 kB │ gzip:  0.47 kB
  dist/assets/index-DALrst65.css   36.42 kB │ gzip:  6.56 kB
  dist/assets/index-SxCrhydn.js   295.63 kB │ gzip: 80.79 kB
  ✓ built in 4.93s
  ```

---

**Feature 1 Final Classification:** 🟢 **COMPLETE**
