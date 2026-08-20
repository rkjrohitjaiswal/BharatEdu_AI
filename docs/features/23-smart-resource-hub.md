# Feature 23: AI Learning Resource Recommendation & Smart Resource Hub

## Feature Overview
Feature 23 introduces the **AI Learning Resource Recommendation & Smart Resource Hub** for **BharatEdu AI**. It builds a centralized, intelligent study resource recommendation system that identifies what a student should study next based on Knowledge Graph prerequisite gaps (Feature 21), weak topic mastery (Feature 1), adaptive assessment performance (Feature 22), exam preparation priorities (Feature 9), study planner targets (Feature 18), risk level (Feature 12), student goals (Feature 8), and career roadmaps (Feature 10).

The system features:
- **Server-Authoritative Ranking**: Deterministic prioritization rules with bounded relevance scores (0 to 100).
- **Prerequisite-First Prioritization**: Root prerequisite gaps take top priority (+35 score boost) to fix foundational weaknesses before downstream topics.
- **Resource Types Supported**: `article`, `video`, `practice`, `assessment`, `notes`, `worksheet`, `reference`, `course`, `pdf`, `quiz`, `flashcards`, `simulation`, `textbook`, `revision`, `exam_material`, `career_resource`.
- **Student Progress Tracking**: `StudentResourceProgress` model (`started`, `completed`, `progressPercent`, `lastOpenedAt`, `completedAt`).
- **Student Resource Hub (`/resources`)**: Full frontend workspace featuring "Top Recommendation", "Fix Root Prerequisite Gaps", "Quick Study (Under 15 Min)", catalog search & filter, and resource details modal.
- **Dashboard Integration**: Compact `ResourceHubCard` rendering top 3 study recommendations on student `DashboardPage`.
- **Teacher & Parent Views**: Guarded summaries for teachers and linked parents (`403` for unlinked parents).

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/learning-resource.model.ts` & `server/src/models/student-resource-progress.model.ts`

- **`LearningResource` Schema**:
  - `resourceId`, `title`, `description`, `resourceType`, `subject`, `topic`, `conceptId`, `classLevel`, `board`, `difficulty`, `estimatedMinutes`, `provider`, `officialSourceUrl`, `tags`, `language`, `isVerified`, `active`.

- **`StudentResourceProgress` Schema**:
  - `studentId`, `resourceId`, `status`: `'started'` | `'completed'`, `progressPercent`, `lastOpenedAt`, `completedAt`.

### 2. Backend Module Architecture
Location: `server/src/ai/resource-recommendations/`

- **`types.ts`**: TypeScript interfaces for resource items, recommendations, ranking contexts, and summaries.
- **`catalog.ts`**: High-quality starter catalog mapped to Knowledge Graph concepts across Math, Computer Science, and Physics/Chemistry.
- **`rules.ts`**: Server-deterministic ranking algorithm (`rankResourceItem`) and deduplication filter (`deduplicateRecommendations`).
- **`ai-coach.ts`**: Natural language explanation layer explaining *why* a resource is recommended, with offline fallback templates.
- **`engine.ts`**: Aggregates student context across Features 1–22 to compute server-authoritative rankings.
- **`service.ts`**: Service exposing recommended resources, catalog search, progress tracking, teacher analytics summary, and parent overview.

### 3. Controller & Express Router
Location: `server/src/controllers/resource-recommendation.controller.ts` & `server/src/routes/resource-recommendation.routes.ts`

Mounted at `/api/student/resources` in `server/src/routes/index.ts`:
- `GET /recommended`: Fetch student's recommended study resources (`requireRole('student')`)
- `GET /`: Search/list resource catalog
- `GET /history`: Fetch student's resource engagement history (`requireRole('student')`)
- `POST /refresh`: Refresh recommendations (`requireRole('student')`)
- `GET /:id`: Get resource details
- `POST /:id/start`: Mark resource as started (`requireRole('student')`)
- `PUT /:id/progress`: Update resource progress percentage (`requireRole('student')`)
- `POST /:id/complete`: Mark resource as completed (`requireRole('student')`)
- `GET /teacher/student/:studentId/summary`: Teacher summary (`requireRole('teacher')`)
- `GET /parent/student/:studentId/summary`: Parent progress summary (`requireRole('parent')`, verified via parent-student link)

---

## Frontend Components

Location: `client/src/components/resources/` & `client/src/pages/LearningResourcesPage.tsx`

- **`LearningResourcesPage`** (`/resources`): Full Student Resource Hub.
- **`RecommendedResourceCard`**: Banner displaying top study recommendation with AI explanation.
- **`ResourceCard`**: Card for catalog & category resource items.
- **`ResourceReasonCard`**: Card explaining why a specific resource is recommended.
- **`ResourceProgress`**: Visual progress bar for started/completed resources.
- **`ResourceSearch` & `ResourceFilters`**: Real-time keyword search, subject filter, and resource type filter.
- **`ResourceDetails`**: Interactive modal preview for starting or completing a resource.
- **`ResourceHubCard`**: Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_resource_recommendations.js` (**PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
