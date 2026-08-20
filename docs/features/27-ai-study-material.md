# Feature 27: AI Study Material & Personalized Notes Generator

## Overview
Feature 27 introduces the **AI Study Material & Personalized Notes Generator** for **BharatEdu AI**. The engine generates personalized study materials, detailed notes, quick notes, flashcards, key points, formula sheets, revision sheets, practice guides, and exam-focused revision materials dynamically tailored to each student's Learning Path, Knowledge Graph prerequisite gaps, topic mastery, exam preparation, goals, career path, smart revision schedule, risk level, and available study time.

The system is server-authoritative:
- **Prerequisite-First Note Generation**: Identifies weak prerequisite concepts via Knowledge Graph (Feature 21) and generates foundational repair notes first when prerequisite mastery is below 70%.
- **Multi-Format Study Notes**: Supports Summaries, Detailed Notes, Quick Notes, Key Points, Flashcards, Formula Sheets, Revision Sheets, Exam Notes, and Practice Guides.
- **Source Integrity**: Incorporates verified educational sources. Never fabricates citations, URLs, or exam claims. Content is clearly labeled.
- **Spaced Repetition Integration**: Interactive flashcard reviews (`again`, `hard`, `good`, `easy`) record review history directly into Smart Revision (Feature 24).

---

## Technical Architecture

### 1. Data Models
Location: `server/src/models/`
- **`StudyMaterial`** (`study-material.model.ts`): `materialId`, `studentId`, `title`, `subject`, `classLevel`, `board`, `topicIds`, `conceptIds`, `learningPathId`, `stageId`, `itemId`, `materialType` (`summary`, `detailed_notes`, `quick_notes`, `flashcards`, `key_points`, `examples`, `formula_sheet`, `revision_sheet`, `practice_guide`, `exam_notes`), `difficulty`, `language`, `estimatedMinutes`, `content`, `sections`, `sourceReferences`, `generatedBy`, `status` (`draft`, `ready`, `archived`).
- **`StudyFlashcard`** (`study-flashcard.model.ts`): `materialId`, `studentId`, `question`, `answer`, `explanation`, `conceptId`, `topicId`, `difficulty`, `order`, `status` (`active`, `archived`, `due`, `mastered`).

### 2. Backend Engine Module
Location: `server/src/ai/study-material/`
- **`types.ts`**: DTOs for study materials, sections, flashcards, and summaries.
- **`rules.ts`**: Deterministic personalization rules (prerequisite gap checks, exam urgency scaling, risk recovery mode, time budget bounding).
- **`ai-coach.ts`**: AI content generator with offline deterministic fallback templates.
- **`engine.ts`**: Content generator building structured notes, flashcards, key points, formula sheets, and revision materials.
- **`service.ts`**: Service exposing material generation, retrieval, today queue, flashcard generation, flashcard review, history, summary, archive, regeneration, teacher summary, and parent summary.

### 3. Controller & Express Router
Location: `server/src/controllers/study-material.controller.ts` & `server/src/routes/study-material.routes.ts`

Mounted at `/api/student/study-material` in `server/src/routes/index.ts`:
- `POST /generate`: Generate personalized study material (`requireRole('student')`)
- `GET /recommended`: Recommended study materials (`requireRole('student')`)
- `GET /today`: Today study materials queue (`requireRole('student')`)
- `GET /:id`: Material details and flashcards (`requireRole('student')`)
- `POST /:id/regenerate`: Regenerate material (`requireRole('student')`)
- `POST /:id/archive`: Archive material (`requireRole('student')`)
- `GET /:id/flashcards`: Fetch flashcards (`requireRole('student')`)
- `POST /:id/flashcards/generate`: Generate new flashcards (`requireRole('student')`)
- `POST /flashcards/:id/review`: Review flashcard outcome (`requireRole('student')`)
- `GET /history`: Fetch archived history (`requireRole('student')`)
- `GET /summary`: Study material overview (`requireRole('student')`)
- `GET /teacher/student/:studentId/summary`: Teacher summary (`requireRole('teacher')`)
- `GET /parent/student/:studentId/summary`: Parent summary (`requireRole('parent')`, verified link)

---

## Frontend Components

Location: `client/src/components/study-material/` & `client/src/pages/StudyMaterialPage.tsx`
- **`StudyMaterialPage`** (`/study-material`): Interactive student study notes workspace.
- **`StudyMaterialCard`**: Card rendering subject, type, difficulty badge, section snippets, estimated study time, and action links.
- **`StudyMaterialPriorityBadge`**: Difficulty indicator badge.
- **`StudyMaterialSummaryCard`**: Summary metrics component.
- **`FlashcardViewer`**: Interactive card-flip flashcard viewer with outcomes (`again`, `hard`, `good`, `easy`).
- **`StudyMaterialCard`** (in `dashboard/`): Compact preview card embedded on student `DashboardPage`.

---

## Empirical Verification Results

- **Feature Test Suite**: `scratch/test_study_material.js` (**35/35 PASSED**).
- **Production Build**: `npm run build` (**PASSED**, 0 errors).
- **Full Regression Audit**: `scratch/test_full_regression.js` (**PASSED**).
