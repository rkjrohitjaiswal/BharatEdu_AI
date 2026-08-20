# Feature 32: AI Doubt Solver, Step-by-Step Explanation & Personalized Learning Engine

## Overview
Feature 32 provides a production-ready AI doubt-solving system for BharatEdu AI where students can ask academic questions and receive grounded, step-by-step explanations personalized to their current mastery, knowledge graph position, learning path, mistakes, exam goals, preferred difficulty, and language (English, Hindi, Gujarati).

## System Architecture

### 1. Data Models
- **`StudentDoubt`**: Doubt session tracking (`doubtId`, `studentId`, `question`, `normalizedQuestion`, `subject`, `topicId`, `conceptId`, `sourceContext`, `sourceId`, `difficulty`, `status`, `createdAt`, `updatedAt`, `resolvedAt`).
- **`DoubtResponse`**: Grounded AI & deterministic response (`doubtId`, `studentId`, `responseId`, `answer`, `explanation`, `steps`, `keyConcepts`, `prerequisiteConcepts`, `examples`, `commonMistakes`, `verificationNotes`, `confidence`, `sourceReferences`, `responseType`, `generatedAt`).
- **`DoubtFollowup`**: Follow-up Q&A within same context (`doubtId`, `studentId`, `parentResponseId`, `question`, `responseId`, `answer`, `explanation`, `createdAt`).
- **`DoubtFeedback`**: Helpfulness feedback (`doubtId`, `studentId`, `responseId`, `helpful`, `feedbackType`, `comment`, `createdAt`).

### 2. Grounded Pipeline & Security
- **Intent & Classification**: Detects categories (`concept_explanation`, `solve_problem`, `explain_answer`, `compare_concepts`, `formula_explanation`, `coding_help`, `debugging`, `exam_question`, `mistake_explanation`, `prerequisite_help`, `revision_help`, `career_question`, `general_academic`).
- **RAG & Grounding Validation**: Grounded against NCERT & curriculum catalog sources without fabricating URLs.
- **Multilingual & Level Personalization**: Personalizes depth (`beginner`, `standard`, `advanced`, `exam_focused`) and language (`en`, `hi`, `gu`) while preserving math/code notation.
- **Deduplication**: Identical repeated questions from the same student reuse previous response.
- **Role Guards & Privacy**: Student identity derived strictly from JWT (`req.user.id`). Unauthenticated requests return `401`. Cross-user access returns `403`. Unlinked parent requests return `403`.

---

## API Endpoints

### Student Endpoints
- `POST /api/student/doubts`: Submit & solve academic doubt.
- `GET /api/student/doubts`: List student doubts.
- `GET /api/student/doubts/:doubtId`: Fetch doubt details & response.
- `POST /api/student/doubts/:doubtId/followup`: Ask follow-up question.
- `POST /api/student/doubts/:doubtId/feedback`: Submit feedback.
- `GET /api/student/doubts/:doubtId/context`: Get curriculum context.
- `GET /api/student/doubts/:doubtId/recommendations`: Get learning recommendations.
- `POST /api/student/doubts/:doubtId/add-to-revision`: Add concept to Smart Revision queue.
- `POST /api/student/doubts/:doubtId/practice`: Generate related practice session.

### Teacher & Parent Endpoints
- `GET /api/teacher/doubts/student/:studentId/summary`: Teacher summary of student doubts.
- `GET /api/parent/doubts/student/:studentId/summary`: Parent-safe summary (guarded by link check).

---

## Verification
- Audit Test: `scratch/test_doubt_solver.js` (50+ PASSED).
- Full Regression: `scratch/test_full_regression.js` (12/12 PASSED).
- Production Build: `npm run build` (0 ERRORS).
