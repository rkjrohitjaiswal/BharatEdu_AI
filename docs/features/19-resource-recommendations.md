# Feature 19: AI Learning Resource & Knowledge Recommendation Engine

## Feature Overview
Feature 19 introduces an **AI Learning Resource & Knowledge Recommendation Engine** for **BharatEdu AI**. It analyzes student progress across Features 1–18 (weak topics, learning gaps, recent mistakes, exam countdowns, risk profiles, goals, practice performance, study planner time budget, career milestones, and success mentor priorities) and recommends verified educational materials.

The recommendation engine relies strictly on deterministic server-side relevance scoring (bounded 0–100) and trust classification. Verified and official sources receive the highest trust ranking, and unverified resources carry explicit disclaimers. AI acts solely as an explanation, strategy, and personalization layer without overriding numerical metrics or verification levels.

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/learning-resource.model.ts` & `server/src/models/resource-recommendation.model.ts`

- **`LearningResource` Schema**:
  - `title`, `description`, `resourceType`: `'video'` | `'article'` | `'notes'` | `'pdf'` | `'practice'` | `'quiz'` | `'flashcards'` | `'simulation'` | `'textbook'` | `'revision'` | `'exam_material'` | `'career_resource'`
  - `subject`, `topic`, `difficulty`: `'beginner'` | `'intermediate'` | `'advanced'`
  - `board`, `classLevel`, `language`, `url`, `provider`, `sourceDomain`, `thumbnailUrl`, `estimatedMinutes`, `tags`
  - `verified`: Boolean
  - `official`: Boolean
  - `active`: Boolean

- **`ResourceRecommendation` Schema**:
  - `studentId`: Ref to User
  - `resourceId`: String ID
  - `topic`, `reason`, `priority`: `'CRITICAL'` | `'HIGH'` | `'MEDIUM'` | `'LOW'`
  - `relevanceScore`: Bounded 0–100
  - `trustScore`: Bounded 0–100 (100 for verified+official, 80 for verified, 40 for unverified)
  - `difficultyMatch`, `estimatedMinutes`, `sourceFeature`, `actionUrl`
  - `status`: `'recommended'` | `'started'` | `'completed'` | `'dismissed'` | `'expired'`
  - Compound Index: `{ studentId: 1, resourceId: 1, topic: 1 }` (unique) to prevent duplicates.

### 2. Backend Module & Starter Catalog
Location: `server/src/ai/resource-recommendations/`

- **`catalog.ts`**: Starter catalog of verified educational materials across Mathematics, Physics, Chemistry, Biology, CS, Programming, AI/ML, English, Exam Prep, and Career Prep. Uses verified domains (`khanacademy.org`, `ncert.nic.in`, `python.org`, `nptel.ac.in`, `phet.colorado.edu`, `cbseacademic.nic.in`, `coursera.org`).
- **`types.ts`**: TypeScript definitions for catalog items, recommendation objects, summaries, and AI advice.
- **`rules.ts`**: Deterministic relevance score calculator (learning gap 25%, exam urgency 20%, mastery 15%, mistakes 15%, goal 10%, risk 5%, time budget 5%, trust 5%) and diversity filter (max 10 total, max 3 per topic).
- **`ai-coach.ts`**: AI resource strategy & explanation layer with offline fallback templates.
- **`engine.ts`**: Authoritative snapshot aggregator pulling context across Features 1–18 and persisting recommendations in MongoDB or in-memory fallback mode.
- **`service.ts`**: Service exposing catalog retrieval, recommendations, generation, refresh, status changes, and summaries.

### 3. Controller & Express Router
Location: `server/src/controllers/resource-recommendation.controller.ts` & `server/src/routes/resource-recommendation.routes.ts`

Mounted at `/api/student/resources` in `server/src/routes/index.ts`:
- `GET /`: Retrieve catalog resources
- `GET /recommended`: Retrieve student recommendations
- `GET /summary`: Summary endpoint
- `GET /:id`: Resource detail
- `POST /generate`: Force generate recommendations
- `POST /refresh`: Refresh recommendations
- `PATCH /recommendations/:id/status`: Update recommendation status (`started`, `completed`, `dismissed`)

All endpoints use `authenticateJWT` and `requireRole('student')`. Student identity is derived strictly from `req.user.id`.

---

## Frontend Components

Location: `client/src/components/resources/` & `client/src/pages/LearningResourcesPage.tsx`

- **`LearningResourcesPage`** (`/resources`): Student resource recommendation page with tabbed views (Recommended for You vs Full Catalog).
- **`ResourceCard`**: Card for catalog items showing type, trust badge, time, difficulty, and open material link.
- **`ResourceRecommendationCard`**: Interactive recommendation card showing priority, match score, trust badge, reason, status toggle, and study trigger.
- **`ResourceFilters`**: Filter bar by subject, material type, and verified-only toggle.
- **`ResourceSummary`**: Stat grid showing total recommended, high priority count, gaps addressed, and exam mode status.
- **`ResourceAIInsight`**: AI/fallback strategy banner.
- **`ResourceEmptyState`**: Zero-state fallback.
- **`RecommendedResourcesCard`**: Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_resource_recommendations.js` (**35/35 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
