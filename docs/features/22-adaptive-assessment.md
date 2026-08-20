# Feature 22: AI Question Generator & Adaptive Assessment Engine

## Feature Overview
Feature 22 introduces the **AI Question Generator & Adaptive Assessment Engine** for **BharatEdu AI**. It dynamically generates, selects, adapts, validates, and delivers educational questions based on the student's actual learning state, Knowledge Graph prerequisite chains (Feature 21), learning gaps (Feature 1), spaced-repetition retention (Feature 20), exam preparation priorities (Feature 9), risk level (Feature 12), and study plans (Feature 18).

The backend remains authoritative. Deterministic server-side rules control:
- **Concept Selection**: Knowledge Graph prerequisite gaps take priority over target concepts.
- **Adaptive Difficulty**: Foundational, easy, medium, hard, advanced. Bounded difficulty adaptation (+1 level for accuracy >= 80%, -1 level for accuracy < 50%).
- **Answer Validation**: `correctAnswer` is NEVER returned to the client before submission. Server-side correctness calculation prevents client spoofing.
- **Anti-repetition**: Prevents serving recent questions (minimum 10-question gap).
- **AI Fallback**: Generates item stems, distractors, explanations, and hints via LLM when available, and falls back to a high-quality starter catalog when `AI_API_KEY` is missing or invalid.

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/question.model.ts`, `server/src/models/question-attempt.model.ts`, `server/src/models/adaptive-assessment.model.ts`

- **`Question` Schema**:
  - `questionId`, `conceptId`, `subject`, `classLevel`, `board`
  - `questionType`: `'mcq'` | `'true_false'` | `'multiple_select'` | `'short_answer'` | `'numerical'` | `'conceptual'` | `'application'` | `'scenario'`
  - `difficulty`: `'foundational'` | `'easy'` | `'medium'` | `'hard'` | `'advanced'`
  - `stem`, `options`, `correctAnswer`, `explanation`, `hint`, `sourceType`, `sourceReference`, `generatedBy`, `verified`, `isActive`

- **`QuestionAttempt` Schema**:
  - `studentId`, `questionId`, `conceptId`, `assessmentId`
  - `selectedAnswer`, `isCorrect`, `responseTimeSeconds`, `hintsUsed`, `attemptNumber`, `difficulty`

- **`AdaptiveAssessment` Schema**:
  - `assessmentId`, `studentId`
  - `assessmentType`: `'diagnostic'` | `'adaptive_practice'` | `'remediation'` | `'exam_prep'` | `'revision'` | `'mastery_check'` | `'prerequisite_check'`
  - `targetConceptId`, `prerequisiteConceptIds`, `questionCount`, `completedQuestions`, `correctAnswers`, `accuracy`
  - `startingDifficulty`, `currentDifficulty`, `readinessBefore`, `readinessAfter`, `status`, `startedAt`, `completedAt`

### 2. Backend Question Generator Module
Location: `server/src/ai/question-generator/`

- **`types.ts`**: Interfaces for questions, attempts, assessments, validation, public item sanitization, and summary stats.
- **`catalog.ts`**: High-quality starter question bank across Math, Computer Science, and Science concepts present in the Knowledge Graph.
- **`rules.ts`**: Item validation rules (MCQ, True/False, numerical), initial difficulty selection (`determineInitialDifficulty`), difficulty adaptation (`adaptDifficulty`), and anti-repetition filter (`filterAntiRepetition`).
- **`ai-coach.ts`**: AI wording & distractor generator with offline fallback templates.
- **`engine.ts`**: Concept selection engine (Knowledge Graph prerequisite gap priority > learning gaps > exam priority > weak topics), adaptive question progression, and authoritative answer verification.
- **`service.ts`**: Service exposing student assessment creation, next question retrieval, answer submission, assessment completion, teacher analytics overview, and parent summary overview.

### 3. Controller & Express Router
Location: `server/src/controllers/adaptive-assessment.controller.ts` & `server/src/routes/adaptive-assessment.routes.ts`

Mounted at `/api/student/assessments` in `server/src/routes/index.ts`:
- `POST /`: Create adaptive assessment (`requireRole('student')`)
- `GET /`: List student assessments (`requireRole('student')`)
- `GET /questions/recommended`: Fetch recommended assessment (`requireRole('student')`)
- `POST /:id/questions/next`: Fetch next question (`requireRole('student')`)
- `POST /:id/questions/:questionId/answer`: Submit answer (`requireRole('student')`)
- `POST /:id/complete`: Complete assessment (`requireRole('student')`)
- `GET /:id/summary`: Get assessment summary (`requireRole('student')`)
- `GET /teacher/student/:studentId/summary`: Teacher analytics summary (`requireRole('teacher')`)
- `GET /parent/student/:studentId/summary`: Parent progress summary (`requireRole('parent')`, verified via parent-student link)

All endpoints use `authenticateJWT`. Identity and role guards enforce role boundaries.

---

## Frontend Components

Location: `client/src/components/assessment/` & `client/src/pages/AdaptiveAssessmentPage.tsx`

- **`AdaptiveAssessmentPage`** (`/adaptive-assessment`): Main student assessment workspace.
- **`AssessmentHeader`**: Header displaying concept, subject, and assessment type.
- **`QuestionProgress`**: Visual progress bar.
- **`PrerequisiteNotice`**: Highlighted alert when a weak prerequisite is being tested before the target concept.
- **`QuestionCard`**: Card rendering stem and choices.
- **`QuestionOptions`**: Choice selector for MCQ, True/False, and text/numerical inputs.
- **`DifficultyBadge`**: Badge showing current question difficulty (`foundational`, `easy`, `medium`, `hard`, `advanced`).
- **`HintPanel`**: Expandable hint toggle button and drawer.
- **`AnswerFeedback`**: Immediate feedback drawer with correctness, explanation, and next difficulty.
- **`AssessmentSummary`**: Final summary card displaying accuracy score, correct answers count, readiness impact, and remediation strategy.
- **`AdaptiveAssessmentCard`**: Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_adaptive_assessment.js` (**46/46 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
