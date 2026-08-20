# Feature 26: AI Resource Recommendation & Personalized Content Engine

## Overview
Feature 26 introduces the **AI Resource Recommendation & Personalized Content Engine** for **BharatEdu AI**. The engine recommends verified educational resources (videos, articles, textbooks, documentation, notes, exercises, quizzes, practice, simulations, projects) for each student based on their Learning Path, Knowledge Graph prerequisite gaps, topic mastery, exam preparation, career goals, risk prediction, revision schedule, and available daily study time.

The system is server-authoritative:
- **Prerequisite-First Resource Selection**: Uses Knowledge Graph (Feature 21) prerequisite dependencies to enforce required concept mastery before recommending advanced content.
- **Deterministic 0–100 Relevance Score Engine**: Relevance score is calculated strictly on the backend via weighted criteria (Prerequisites 20%, Learning Path 15%, Mastery Gap 15%, Exam 15%, Career 10%, Goals 10%, Risk 5%, Revision 5%, Time/Difficulty Fit 5%).
- **Personalized Daily Study Budget**: Recommended resource estimated minutes fit within `availableDailyMinutes` (Feature 18).
- **Verified Educational Sources**: Prioritizes official portals (NCERT, DIKSHA, Khan Academy, NPTEL, SWAYAM, MDN, Python Docs, Microsoft Learn) with `qualityScore` and `isVerified` flags.

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/`
- **`LearningResource`** (`learning-resource.model.ts`): `resourceId`, `title`, `description`, `resourceType`, `subject`, `classLevel`, `board`, `topicIds`, `conceptIds`, `skillIds`, `careerIds`, `difficulty`, `estimatedMinutes`, `language`, `provider`, `officialSource`, `officialSourceUrl`, `url`, `qualityScore`, `isVerified`, `tags`.
- **`StudentResourceRecommendation`** (`student-resource-recommendation.model.ts`): `studentId`, `resourceId`, `reason`, `recommendationType`, `priority`, `relevanceScore`, `difficultyMatch`, `masteryMatch`, `goalMatch`, `examMatch`, `careerMatch`, `riskMatch`, `prerequisiteMatch`, `estimatedMinutes`, `status` (`recommended`, `started`, `completed`, `dismissed`), `recommendedAt`, `startedAt`, `completedAt`, `dismissedAt`, `dedupeKey`.

### 2. Backend Recommendation Module
Location: `server/src/ai/resource-recommendation/`
- **`types.ts`**: TypeScript definitions and DTOs.
- **`catalog.ts`**: Verified starter catalog of high-quality educational resources.
- **`rules.ts`**: Deterministic 0–100 relevance score calculator, prerequisite filtering, and time budgeting logic.
- **`ai-coach.ts`**: AI explanation and study strategy generator with offline fallback.
- **`engine.ts`**: Dynamic recommendation snapshot builder aggregating Features 1–25.
- **`service.ts`**: Orchestration service for recommendations, today queue, next resource, history, summary, teacher overview, and parent summary.

### 3. Controller & Express Router
Location: `server/src/controllers/resource-recommendation.controller.ts` & `server/src/routes/resource-recommendation.routes.ts`

Mounted at `/api/student/resources` in `server/src/routes/index.ts`:
- `GET /recommended`: Fetch recommended resources (`requireRole('student')`)
- `GET /today`: Fetch today recommended queue (`requireRole('student')`)
- `GET /next`: Fetch top next resource (`requireRole('student')`)
- `POST /refresh`: Refresh recommendations (`requireRole('student')`)
- `POST /:id/start`: Start resource tracking (`requireRole('student')`)
- `POST /:id/complete`: Complete resource (`requireRole('student')`)
- `POST /:id/dismiss`: Dismiss recommendation (`requireRole('student')`)
- `GET /history`: Fetch completed/dismissed history (`requireRole('student')`)
- `GET /summary`: Fetch recommendation summary (`requireRole('student')`)
- `GET /:id/explanation`: Fetch AI resource explanation (`requireRole('student')`)
- `GET /teacher/student/:studentId/summary`: Teacher summary (`requireRole('teacher')`)
- `GET /parent/student/:studentId/summary`: Parent summary (`requireRole('parent')`, verified via active link)

---

## Frontend Components

Location: `client/src/components/resources/` & `client/src/pages/ResourceRecommendationsPage.tsx`
- **`ResourceRecommendationsPage`** (`/resources`): Interactive student workspace.
- **`ResourceCard`**: Card rendering provider, quality score, priority, relevance match, description, reason, and action links.
- **`ResourcePriorityBadge`**: Priority badge indicator.
- **`ResourceQualityBadge`**: Verified quality score badge.
- **`ResourceSummaryCard`**: Summary metrics component.
- **`ResourceRecommendationCard`**: Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_resource_recommendations.js` (**35/35 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
