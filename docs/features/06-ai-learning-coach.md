# Feature 6: AI Learning Coach & Daily Personalized Recommendations

**Feature Title:** AI Learning Coach & Daily Personalized Recommendations  
**Implementation Date:** August 19, 2026  
**Repository:** `BharatEdu AI`  
**Feature Status:** 🟢 **COMPLETE**

---

## Executive Summary

The **AI Learning Coach** provides an intelligent, personalized daily "What should I learn today?" experience for BharatEdu AI students.

It synthesizes the authenticated student's profile, topic mastery, active learning gaps, misconception patterns, recent mistakes, study plan tasks, practice streak, and scholarship opportunities into a time-budgeted, prioritized daily learning plan.

Key System Highlights:
- **Deterministic 10-Tier Prioritization Queue (`rules.ts`):** Orders recommendations strictly by pedagogical urgency:
  1. Critical learning gaps
  2. High-severity learning gaps
  3. Prerequisite gaps
  4. Active misconceptions
  5. Recent repeated mistakes
  6. Weak mastery topics (< 60%)
  7. Incomplete study-plan tasks
  8. Recommended curriculum topics
  9. Revision of mastered topics
  10. Urgent scholarship alerts
- **Deterministic Daily Readiness Score (0–100):** Calculated mathematically from overall mastery, recent practice accuracy, active gap severity, and practice streak. Labels: `Needs Attention` (<50), `Building Momentum` (50–69), `On Track` (70–89), `Strong Progress` (>=90). LLM modification of readiness or mastery is strictly prohibited.
- **Time-Budget Allocation:** Fits recommendations within the student's daily study budget (default: 30 minutes).
- **AI Enrichment & Graceful Fallback (`ai-enricher.ts`):** Uses OpenAI (`gpt-4o-mini`) strictly to generate friendly greetings, brief priority explanations, and encouragement in the student's preferred language (English, Hindi, Gujarati). If `AI_API_KEY` is missing or fails, deterministic templates are used with `aiEnhanced: false`.
- **Strict User Isolation & Read-Only Non-Mutation:** All endpoints filter strictly by `req.user.id` (JWT). Generating a coach plan DOES NOT alter topic mastery. Teachers (`403`) and unauthenticated users (`401`) are strictly blocked.
- **Interactive UI Workflows:** Adds `LearningCoachCard.tsx` on Student Dashboard, `LearningCoachPage.tsx` (`/learning-coach`), sidebar navigation, and action deep-links (`/practice`, `/mistakes`, `/tutor`, `/scholarships`).

---

## Section 1: Architecture & Data Flow

```
Student Learning Profile + Mastery + Active Gaps + Mistakes + Study Plan + Streak
 ↓
Deterministic Prioritization Engine (rules.ts evaluates 10-tier priority queue)
 ↓
Time-Budget Bounding (Packs tasks into 30-minute daily budget)
 ↓
Readiness Score Calculator (0-100 formula based on mastery & accuracy)
 ↓
AI Enrichment Service (ai-enricher.ts adds language-tailored motivation or fallback)
 ↓
REST API Endpoint (GET /api/student/learning-coach/today)
 ↓
Student Dashboard Widget (LearningCoachCard) & Dedicated Portal (/learning-coach)
```

---

## Section 2: Deterministic Readiness Score Formula

$$\text{Score} = \text{Clamp}_{10}^{100} \left( 0.4 \times \text{Mastery} + 0.4 \times \text{Accuracy} - \text{GapPenalty} + \text{StreakBonus} \right)$$

Where:
- $\text{GapPenalty} = \min(35, 15 \times \text{CriticalGaps} + 8 \times \text{HighGaps})$
- $\text{StreakBonus} = \min(15, 3 \times \text{StreakDays})$

---

## Section 3: REST API Endpoints

### 1. Fetch Today's Learning Coach Plan
- **Endpoint:** `GET /api/student/learning-coach/today`
- **Headers:** `Authorization: Bearer <student_jwt>`
- **Response Payload (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "date": "2026-08-19",
      "greeting": "Good day, Student!",
      "readiness": {
        "score": 53,
        "label": "Building Momentum",
        "explanation": "Consistent daily practice will help strengthen your topic mastery."
      },
      "dailyGoal": "Improve Daily Practice and complete your daily learning tasks.",
      "availableMinutes": 30,
      "completedMinutes": 0,
      "remainingMinutes": 15,
      "recommendations": [
        {
          "id": "rec_default_1787163934",
          "type": "enrichment",
          "priority": "LOW",
          "subject": "General Curriculum",
          "topic": "Daily Practice",
          "title": "Complete Daily Adaptive Practice Session",
          "reason": "Regular 15-minute daily practice keeps your learning readiness high.",
          "estimatedMinutes": 15,
          "action": "practice",
          "targetRoute": "/practice"
        }
      ],
      "streak": 1,
      "motivation": "Consistent 15–30 minutes of daily practice leads to maximum learning retention!",
      "aiEnhanced": false
    }
  }
  ```

### 2. Refresh Learning Coach Plan
- **Endpoint:** `POST /api/student/learning-coach/refresh`
- **Headers:** `Authorization: Bearer <student_jwt>`

---

## Section 4: Security & Access Control Matrix

| Security Test Case | Request Context | Result | Status |
| :--- | :--- | :---: | :---: |
| **Student A -> Own coach plan** | `GET /api/student/learning-coach/today` | 🟢 200 OK | **ALLOWED** |
| **Student B -> Student A coach plan** | `GET /api/student/learning-coach/today` (Student B JWT) | 🟢 200 OK (Isolated to B) | **BLOCKED** |
| **Teacher -> Student coach endpoint** | `GET /api/student/learning-coach/today` (Teacher JWT) | 🔴 403 Forbidden | **BLOCKED** |
| **Unauthenticated access** | Any protected endpoint without JWT | 🔴 401 Unauthorized | **BLOCKED** |
| **Mastery Non-Mutation** | Requesting coach plan | 🟢 TopicMastery Unchanged | **VERIFIED** |

---

## Section 5: Component Inventory & Files Created / Modified

| File Path | Component Purpose | Status |
| :--- | :--- | :---: |
| [`types.ts`](file:///c:/Project/BharatEdu%20AI/server/src/ai/learning-coach/types.ts) | TypeScript interfaces for coach plan, readiness score, and recommendations. | 🟢 **NEW** |
| [`rules.ts`](file:///c:/Project/BharatEdu%20AI/server/src/ai/learning-coach/rules.ts) | 10-tier prioritization queue, time budget packing, and readiness score formula. | 🟢 **NEW** |
| [`ai-enricher.ts`](file:///c:/Project/BharatEdu%20AI/server/src/ai/learning-coach/ai-enricher.ts) | OpenAI language-tailored enricher with graceful offline fallback templates. | 🟢 **NEW** |
| [`coach.ts`](file:///c:/Project/BharatEdu%20AI/server/src/ai/learning-coach/coach.ts) | Learning Coach orchestrator aggregating data repository signals. | 🟢 **NEW** |
| [`learning-coach.controller.ts`](file:///c:/Project/BharatEdu%20AI/server/src/controllers/learning-coach.controller.ts) | Express controller for `/today` and `/refresh` coach endpoints. | 🟢 **NEW** |
| [`learning-coach.routes.ts`](file:///c:/Project/BharatEdu%20AI/server/src/routes/learning-coach.routes.ts) | Authenticated student router. | 🟢 **NEW** |
| [`data.repository.ts`](file:///c:/Project/BharatEdu%20AI/server/src/repositories/data.repository.ts#L1225) | Added `getUserById` and `getStudentStudyPlan` repository helpers. | 🟢 **MODIFIED** |
| [`LearningCoachCard.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/components/dashboard/LearningCoachCard.tsx) | Student Dashboard widget displaying readiness badge, goal, and task plan. | 🟢 **NEW** |
| [`LearningCoachPage.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/pages/LearningCoachPage.tsx) | Full portal page at `/learning-coach`. | 🟢 **NEW** |
| [`DashboardPage.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/pages/DashboardPage.tsx#L98) | Integrated `LearningCoachCard` into Student Dashboard. | 🟢 **MODIFIED** |
| [`App.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/App.tsx#L46) | Added protected `/learning-coach` route. | 🟢 **MODIFIED** |
| [`Sidebar.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/components/Sidebar.tsx#L41) | Added "AI Learning Coach" link to Student Hub. | 🟢 **MODIFIED** |
| [`api.ts`](file:///c:/Project/BharatEdu%20AI/client/src/services/api.ts#L795) | Added `fetchTodayLearningCoach` helper function. | 🟢 **MODIFIED** |

---

## Section 6: Automated Verification & Production Build Output

- **Feature Test Suite (`scratch/test_learning_coach.js`):** Passed 100%. Verifies all 17 criteria (deterministic recommendations, critical gap priority over weak mastery, time bounds, readiness 0-100, Student B isolation, Teacher 403, Unauthenticated 401, fallback without API key, non-mutation of mastery).
- **Full Regression Test Suite (`scratch/test_full_regression.js`):** Passed 100%. Zero regressions across authentication, adaptive practice, tutor, scholarships, teacher, study plans, mistake review, and dashboard.
- **Production Build Verification (`npm run build`):**
  ```
  > bharatedu-ai@1.0.0 build
  > npm run build:server && npm run build:client

  > bharatedu-ai-server@1.0.0 build
  > tsc

  > bharatedu-ai-client@1.0.0 build
  > tsc && vite build

  vite v5.4.21 building for production...
  ✓ 1553 modules transformed.
  rendering chunks...
  dist/index.html                   0.83 kB │ gzip:  0.48 kB
  dist/assets/index-DzDmh-S3.css   39.41 kB │ gzip:  6.94 kB
  dist/assets/index-xVYX5J6Q.js   355.57 kB │ gzip: 90.71 kB
  ✓ built in 6.23s
  ```

---

**Feature 6 Final Status:** 🟢 **COMPLETE**
