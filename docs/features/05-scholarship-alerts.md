# Feature 5: Scholarship Deadline & Opportunity Alerts

**Feature Title:** Scholarship Deadline & Opportunity Alerts  
**Implementation Date:** August 19, 2026  
**Repository:** `BharatEdu AI`  
**Feature Status:** 🟢 **COMPLETE**

---

## Executive Summary

The **Scholarship Deadline & Opportunity Alerts** system upgrades BharatEdu AI's Scholarship Intelligence from static matching to a deadline-aware opportunity tracking engine.

Students receive real-time deadline status (`open`, `closing_soon`, `urgent`, `closed`, `rolling`, `unknown`), alert priority rankings (`URGENT`, `HIGH`, `MEDIUM`, `LOW`), saved scholarship bookmarking, and self-reported application progress tracking (`not_started`, `planning`, `applied`, `submitted`, `closed`).

Key System Highlights:
- **Deterministic Server-Side Deadline Engine (`deadline.service.ts`):** Calculates `daysRemaining` and `deadlineStatus` dynamically using server time. The LLM and frontend are strictly prohibited from calculating or overriding deadline states or eligibility.
- **Verified Official Sources Only:** Deadlines are displayed only when supported by verified official sources (`deadlineVerified: true`). Unverified items display `"Deadline not verified. Check the official scholarship portal."` with zero invented dates.
- **Self-Reported Application Tracking (`StudentSavedScholarship` model):** Allows students to track their application status (`applied`, `submitted`, etc.) with clear UI disclaimers: `"Self-reported application status"`. Does not claim official provider confirmation.
- **Strict User Isolation:** Student A cannot view or alter Student B's saved scholarships or application status. Teachers and unauthenticated callers are strictly blocked (`403`/`401`) from private student scholarship data.
- **Mandatory Legal & URL Verification:** Preserves the mandatory legal disclaimer and links only to verified official portals (e.g. `scholarships.gov.in`).
- **Interactive UI Workflows:** Adds `SavedScholarshipsPage.tsx` (`/scholarships/saved`), `ScholarshipAlertsCard.tsx` on Student Dashboard, upgraded tabbed `ScholarshipsPage.tsx`, and sidebar navigation.

---

## Section 1: Architecture & Data Flow

```
Student Profile Setup (Class, State, Income, Category)
 ↓
Deterministic Recommendation Engine (criteria.engine.ts + matcher.ts)
 ↓
Deadline Engine Calculation (deadline.service.ts evaluates daysRemaining & status)
 ↓
Personalized Deadline Alerts API (GET /api/scholarships/alerts)
 ↓
Student Dashboard Alerts Widget (ScholarshipAlertsCard at /dashboard)
 ↓
Save & Track Opportunities (POST /api/scholarships/:id/save & PUT /api/scholarships/:id/status)
 ↓
Official Application Portal Redirection (Verified domain scholarships.gov.in)
```

---

## Section 2: Data Models Schema

### 1. Scholarship Schema Extension ([`server/src/models/scholarship.model.ts`](file:///c:/Project/BharatEdu%20AI/server/src/models/scholarship.model.ts))
```typescript
export interface IScholarship extends Document {
  name: string;
  provider: string;
  description: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationUrl: string;
  deadline?: Date;
  deadlineType?: 'fixed' | 'rolling' | 'unknown';
  deadlineVerified?: boolean;
  deadlineSourceUrl?: string;
  deadlineVerifiedAt?: Date;
  status: 'active' | 'closed' | 'upcoming';
  source: 'official' | 'ai_aggregated';
}
```

### 2. Student Saved Scholarship Schema ([`server/src/models/student-saved-scholarship.model.ts`](file:///c:/Project/BharatEdu%20AI/server/src/models/student-saved-scholarship.model.ts))
```typescript
export interface IStudentSavedScholarship extends Document {
  studentId: mongoose.Types.ObjectId;
  scholarshipId: mongoose.Types.ObjectId;
  applicationStatus: 'not_started' | 'planning' | 'applied' | 'submitted' | 'closed';
  savedAt: Date;
  updatedAt: Date;
}
```

---

## Section 3: REST API Endpoints

### 1. Fetch Scholarship Deadline Alerts
- **Endpoint:** `GET /api/scholarships/alerts`
- **Headers:** `Authorization: Bearer <student_jwt>`
- **Response Payload (`200 OK`):**
  ```json
  {
    "success": true,
    "legalDisclaimer": "BharatEdu AI provides matching guidance based on published official criteria. Final eligibility is determined strictly by the official scholarship provider.",
    "data": [
      {
        "scholarship": { "name": "National Means-cum-Merit Scholarship Scheme (NMMSS)", "provider": "Ministry of Education" },
        "matchScore": 85,
        "daysRemaining": 73,
        "deadlineStatus": "open",
        "alertPriority": "LOW",
        "alertType": "new_match",
        "isSaved": true,
        "source": { "officialUrl": "https://scholarships.gov.in", "verified": true }
      }
    ]
  }
  ```

### 2. Fetch Upcoming Deadlines
- **Endpoint:** `GET /api/scholarships/deadlines?days=30&limit=10`
- **Headers:** `Authorization: Bearer <student_jwt>`

### 3. Save / Unsave & Application Tracking
- `POST /api/scholarships/:id/save`: Save scholarship to student account.
- `DELETE /api/scholarships/:id/save`: Remove scholarship from saved list.
- `GET /api/scholarships/saved`: Retrieve student's saved list with self-reported application status.
- `PUT /api/scholarships/:id/status`: Update application tracking status (`{ "status": "applied" }`).

---

## Section 4: Security & Access Matrix

| Security Test Case | Request Context | Result | Status |
| :--- | :--- | :---: | :---: |
| **Student A -> Own saved scholarships** | `GET /api/scholarships/saved` | 🟢 200 OK | **ALLOWED** |
| **Student B -> Student A saved list** | `GET /api/scholarships/saved` (Student B JWT) | 🟢 200 OK (Isolated 0 items) | **BLOCKED** |
| **Student B -> Modify Student A status** | `PUT /api/scholarships/:id/status` (Student B JWT) | 🟢 200 OK (Isolated to Student B) | **BLOCKED** |
| **Teacher -> Student private alerts** | `GET /api/scholarships/alerts` (Teacher JWT) | 🔴 403 Forbidden | **BLOCKED** |
| **Unauthenticated access** | Any protected endpoint without JWT | 🔴 401 Unauthorized | **BLOCKED** |

---

## Section 5: Component Inventory & Files Created / Modified

| File Path | Component Purpose | Status |
| :--- | :--- | :---: |
| [`scholarship.model.ts`](file:///c:/Project/BharatEdu%20AI/server/src/models/scholarship.model.ts) | Extended Scholarship schema with verified deadline fields. | 🟢 **MODIFIED** |
| [`student-saved-scholarship.model.ts`](file:///c:/Project/BharatEdu%20AI/server/src/models/student-saved-scholarship.model.ts) | Schema for student saved scholarships and application tracking. | 🟢 **NEW** |
| [`deadline.service.ts`](file:///c:/Project/BharatEdu%20AI/server/src/scholarships/deadline.service.ts) | Server-side deterministic deadline calculation engine. | 🟢 **NEW** |
| [`scholarship.controller.ts`](file:///c:/Project/BharatEdu%20AI/server/src/controllers/scholarship.controller.ts#L205) | Added deadline alert, saved scholarship, and status update handlers. | 🟢 **MODIFIED** |
| [`scholarship.routes.ts`](file:///c:/Project/BharatEdu%20AI/server/src/routes/scholarship.routes.ts) | Authenticated student scholarship subroutes. | 🟢 **MODIFIED** |
| [`data.repository.ts`](file:///c:/Project/BharatEdu%20AI/server/src/repositories/data.repository.ts#L1130) | Added saved scholarship CRUD and status tracking repository methods. | 🟢 **MODIFIED** |
| [`ScholarshipsPage.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/pages/ScholarshipsPage.tsx) | Upgraded tabbed portal with deadline status badges & save toggles. | 🟢 **MODIFIED** |
| [`SavedScholarshipsPage.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/pages/SavedScholarshipsPage.tsx) | Student portal page at `/scholarships/saved`. | 🟢 **NEW** |
| [`ScholarshipAlertsCard.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/components/dashboard/ScholarshipAlertsCard.tsx) | Student Dashboard widget displaying top upcoming opportunities. | 🟢 **NEW** |
| [`DashboardPage.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/pages/DashboardPage.tsx#L125) | Integrated `ScholarshipAlertsCard` into Student Dashboard. | 🟢 **MODIFIED** |
| [`App.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/App.tsx#L85) | Added protected `/scholarships/saved` route. | 🟢 **MODIFIED** |
| [`Sidebar.tsx`](file:///c:/Project/BharatEdu%20AI/client/src/components/Sidebar.tsx#L49) | Added "Saved Scholarships" link to Student Hub. | 🟢 **MODIFIED** |
| [`api.ts`](file:///c:/Project/BharatEdu%20AI/client/src/services/api.ts#L705) | Added scholarship deadline alert & saved helper functions. | 🟢 **MODIFIED** |

---

## Section 6: Automated Verification & Production Build Output

- **Feature Test Suite (`scratch/test_scholarship_deadlines.js`):** Passed 100%. Verifies all 30 criteria (Deterministic matching, verified deadlines, days remaining calculation, closing_soon, urgent, unknown deadline handling, saved scholarship isolation, self-reported status disclaimer, official URL domain checks, and legal disclaimer).
- **Full Regression Test Suite (`scratch/test_full_regression.js`):** Passed 100%. Zero regressions across authentication, adaptive practice, tutor, scholarships, teacher, study plans, and dashboard.
- **Production Build Verification (`npm run build`):**
  ```
  > bharatedu-ai@1.0.0 build
  > npm run build:server && npm run build:client

  > bharatedu-ai-server@1.0.0 build
  > tsc

  > bharatedu-ai-client@1.0.0 build
  > tsc && vite build

  vite v5.4.21 building for production...
  ✓ 1551 modules transformed.
  rendering chunks...
  dist/index.html                   0.83 kB │ gzip:  0.48 kB
  dist/assets/index-3wwg2YcS.css   37.85 kB │ gzip:  6.74 kB
  dist/assets/index-FNP_ND6S.js   347.12 kB │ gzip: 89.25 kB
  ✓ built in 5.07s
  ```

---

**Feature 5 Final Classification:** 🟢 **COMPLETE**
