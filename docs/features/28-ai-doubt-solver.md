# Feature 28: AI Doubt Solver & Contextual Learning Tutor

## Overview
Feature 28 introduces the **AI Doubt Solver & Contextual Learning Tutor** for **BharatEdu AI**. The system allows students to ask academic questions 24/7 and receive personalized, step-by-step solutions, Socratic hints, worked examples, and mistake explanations grounded in their actual curriculum, Knowledge Graph prerequisite dependencies, Learning Path stage, study notes, topic mastery, exam preparation, and smart revision schedule.

The system is server-authoritative:
- **Contextual Aggregation**: Context is generated strictly on the server by aggregating Features 1–27 (Knowledge Graph, Learning Path, Topic Mastery, Practice History, Study Materials, Exams, Goals, Career, Risk, Revision). Client-submitted mastery or risk values are rejected.
- **Deterministic Classification**: Categorizes doubts into 12 academic categories (`concept_explanation`, `prerequisite_gap`, `worked_example`, `formula_question`, `calculation`, `coding_question`, `mistake_analysis`, `exam_question`, `revision_question`, `career_application`, `resource_request`, `general_academic`).
- **Knowledge Graph Prerequisite Order**: When prerequisite gaps exist, the solver structures explanations step-by-step starting from foundational concepts.
- **Socratic Hint Mode**: Offers progressive hints (`hintLevel` 0 to 3) before revealing the complete solution.
- **Source & Security Integrity**: Uses verified educational sources. Never fabricates citations, URLs, or exam claims. Never exposes private conversations, passwords, or unrelated student data.

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/`
- **`DoubtSession`** (`doubt-session.model.ts`): `sessionId`, `studentId`, `subject`, `classLevel`, `board`, `topicId`, `conceptId`, `learningPathId`, `materialId`, `examId`, `title`, `status` (`active`, `resolved`, `archived`), `difficulty`, `language`, `createdAt`, `updatedAt`, `lastActivityAt`.
- **`DoubtMessage`** (`doubt-message.model.ts`): `messageId`, `sessionId`, `studentId`, `role` (`student`, `tutor`), `content`, `explanationLevel` (`simple`, `standard`, `detailed`, `exam`, `coding`), `referencedConceptIds`, `referencedTopicIds`, `sourceReferences`, `generatedBy`, `isHelpful`, `createdAt`.
- **`DoubtContext`** (`doubt-context.model.ts`): `studentId`, `sessionId`, `conceptId`, `topicId`, `masteryScore`, `confidenceScore`, `riskLevel`, `examUrgency`, `learningPathStage`, `prerequisiteConceptIds`, `learningGapIds`, `revisionDue`, `recommendedDifficulty`, `capturedAt`.

### 2. Backend Engine Module
Location: `server/src/ai/doubt-solver/`
- **`types.ts`**: DTOs for sessions, messages, context, step-by-step solutions, Socratic hints, and summaries.
- **`rules.ts`**: Deterministic classification rules & Socratic hint level progression.
- **`context.ts`**: Contextual aggregation engine for Features 1–27.
- **`ai-coach.ts`**: AI doubt explanation & Socratic hint generator with offline fallback.
- **`engine.ts`**: Core solver engine generating step-by-step solutions and prerequisite chains.
- **`service.ts`**: Orchestration service for session management, message sending, solving, Socratic mode, feedback, teacher summary, and parent summary.

### 3. Controller & Express Router
Location: `server/src/controllers/doubt-solver.controller.ts` & `server/src/routes/doubt-solver.routes.ts`

Mounted at `/api/student/doubts` in `server/src/routes/index.ts`:
- `POST /sessions`: Create doubt session (`requireRole('student')`)
- `GET /sessions`: Fetch student doubt sessions (`requireRole('student')`)
- `GET /sessions/:id`: Fetch session details (`requireRole('student')`)
- `DELETE /sessions/:id`: Delete session (`requireRole('student')`)
- `POST /sessions/:id/messages`: Send message (`requireRole('student')`)
- `GET /sessions/:id/messages`: Fetch session messages (`requireRole('student')`)
- `POST /sessions/:id/solve`: Solve doubt step-by-step (`requireRole('student')`)
- `POST /sessions/:id/socratic`: Fetch Socratic hint (`requireRole('student')`)
- `POST /messages/:id/feedback`: Submit feedback (`requireRole('student')`)
- `GET /context`: Fetch aggregated doubt context (`requireRole('student')`)
- `GET /recommendations`: Fetch doubt recommendations (`requireRole('student')`)
- `GET /teacher/student/:studentId/summary`: Teacher summary (`requireRole('teacher')`)
- `GET /parent/student/:studentId/summary`: Parent summary (`requireRole('parent')`, verified link)

---

## Frontend Components

Location: `client/src/components/doubt-solver/` & `client/src/pages/DoubtSolverPage.tsx`
- **`DoubtSolverPage`** (`/doubts`): Interactive 24/7 student doubt workspace.
- **`DoubtContextCard`**: Card rendering mastery, risk status, prerequisite dependencies, and curriculum context.
- **`StepByStepSolutionCard`**: Card rendering structured step-by-step solutions, prerequisite chains, and follow-up question chips.
- **`DoubtSolverCard`** (in `dashboard/`): Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_doubt_solver.js` (**42/42 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
