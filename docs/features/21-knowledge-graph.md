# Feature 21: AI Knowledge Graph & Concept Dependency Engine

## Feature Overview
Feature 21 introduces an **AI Knowledge Graph & Concept Dependency Engine** for **BharatEdu AI**. It maps relationships and prerequisite dependencies across educational concepts in Mathematics, Computer Science, Physics, Chemistry, Biology, and English.

The engine calculates deterministic concept readiness scores (0–100) and detects **root learning gaps**—identifying foundational prerequisites that block downstream concepts (e.g., if a student struggles with Quadratic Equations, it determines whether Linear Equations or Algebraic Fundamentals is the root gap). AI acts strictly as an explanation, strategy, and natural language summary layer without overriding concept dependencies, readiness scores, or mastery levels.

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/knowledge-concept.model.ts`, `server/src/models/concept-dependency.model.ts`, `server/src/models/student-concept-mastery.model.ts`

- **`KnowledgeConcept` Schema**:
  - `conceptId`: String ID (e.g., `math_quadratic_eq`)
  - `name`, `subject`, `classLevel`, `board`, `description`, `aliases`, `difficulty`, `category`, `isActive`, `officialSourceUrl`

- **`ConceptDependency` Schema**:
  - `prerequisiteConceptId`, `dependentConceptId`
  - `dependencyType`: `'prerequisite'` | `'foundational'` | `'related'` | `'advanced'`
  - `strength`: 0.0 to 1.0 (default 0.9)
  - `confidence`: 0.0 to 1.0 (default 0.95)
  - `source`: String source (e.g., `curriculum_standard`)

- **`StudentConceptMastery` Schema**:
  - `studentId`: Ref to User
  - `conceptId`: Ref to KnowledgeConcept
  - `masteryScore`, `confidenceScore`, `evidenceCount`, `lastPracticedAt`, `lastAssessedAt`
  - `status`: `'unknown'` | `'weak'` | `'developing'` | `'ready'` | `'strong'`

### 2. Backend Knowledge Graph Module
Location: `server/src/ai/knowledge-graph/`

- **`types.ts`**: TypeScript interfaces for concepts, edges, readiness, root gaps, summaries, and advice.
- **`catalog.ts`**: Starter curriculum catalog across Math, CS, Physics, Chemistry, Biology, and English.
- **`rules.ts`**: Deterministic graph traversal (`getPrerequisites`, `getDependents`, `getConceptPath`, `getAncestors`, `getDescendants`), concept readiness calculator (`calculateDeterministicConceptReadiness`), and root gap detection engine (`identifyRootLearningGapsEngine`).
- **`ai-coach.ts`**: AI strategy & advice layer for knowledge graphs with offline fallback templates.
- **`engine.ts`**: Snapshot aggregator combining authoritative student context (Features 1–20) to compute readiness and root learning gaps.
- **`service.ts`**: Service exposing concept catalog lookup, readiness list, root gaps, recommendations, summary stats, teacher student overview, and parent student overview.

### 3. Controller & Express Router
Location: `server/src/controllers/knowledge-graph.controller.ts` & `server/src/routes/knowledge-graph.routes.ts`

Mounted at `/api/knowledge-graph` in `server/src/routes/index.ts`:
- `GET /concepts`: All catalog concepts
- `GET /concepts/:id`: Single concept details
- `GET /concepts/:id/prerequisites`: Direct prerequisites
- `GET /concepts/:id/dependents`: Direct dependents
- `GET /concepts/:id/path?toId=...`: Traversal path
- `GET /student/:studentId/readiness`: Student concept readiness list (`requireRole('student')`)
- `GET /student/:studentId/root-gaps`: Student root learning gaps (`requireRole('student')`)
- `GET /student/:studentId/recommendations`: Remediation recommendations (`requireRole('student')`)
- `GET /teacher/students/:studentId/overview`: Teacher overview (`requireRole('teacher')`)
- `GET /parent/students/:studentId/overview`: Parent overview (`requireRole('parent')`, verified via parent-student link)

All endpoints use `authenticateJWT`. Identity and role guards enforce role boundaries.

---

## Frontend Components

Location: `client/src/components/knowledge-graph/` & `client/src/pages/KnowledgeGraphPage.tsx`

- **`KnowledgeGraphPage`** (`/knowledge-graph`): Main student Learning Map page.
- **`ConceptGraph`**: Visual concept hierarchy display grouped by subject.
- **`ConceptNode`**: Interactive concept node showing readiness score and level.
- **`PrerequisiteChain`**: Visual prerequisite breadcrumb chain.
- **`ConceptReadiness`**: Visual readiness strength bar with levels (`blocked`, `weak`, `developing`, `ready`, `strong`).
- **`RootLearningGapCard`**: Highlighted card displaying the root blocker concept and affected downstream topics.
- **`ConceptRecommendationCard`**: Remediation card ranked by unblocking impact.
- **`KnowledgeGraphSummary`**: Stat grid (total concepts, strong/ready count, developing count, weak count, blocked count).
- **`KnowledgeGraphAIInsight`**: AI/fallback strategy banner.
- **`ConceptSearch`**: Real-time search & subject filter.
- **`ConceptDetails`**: Interactive modal displaying prerequisites, dependents, readiness, and official curriculum source link.
- **`KnowledgeGraphCard`**: Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_knowledge_graph.js` (**35/35 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
