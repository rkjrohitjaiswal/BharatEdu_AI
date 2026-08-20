# Feature 36: AI Teacher Assessment, Assignment Evaluation, Rubric Grading & Personalized Feedback Engine

## Overview
Feature 36 provides a production-ready assessment platform for BharatEdu AI. It enables teachers to create assignments, quizzes, subjective tests, and coding assessments, while BharatEdu AI assists with rubric-based evaluation, evidence extraction, misconception detection, and constructive personalized feedback.

---

## Core Principles & Design

1. **Assistive AI Architecture**
   - AI serves as an **assistive** evaluator; AI does NOT determine final student grades.
   - For objective questions (MCQ, multiple-select, numerical), the server calculates correctness and marks authoritatively.
   - For subjective questions (short answer, long answer, essay), AI produces a proposed evaluation with confidence, evidence, rubric breakdown, strengths, and weaknesses.
   - The teacher remains the final, authoritative grading power.

2. **Grade & Answer Key Security**
   - `correctAnswer`, `modelAnswer`, and expected points are completely stripped from pre-submission question payloads to prevent answer-key leakage in browser tools.
   - Client submission payloads cannot inject final scores, percentage, grade, rubric scores, or evaluation status.
   - Student identity is strictly derived from JWT (`req.user.id`). Attempt state locking prevents modifying returned submissions.

3. **Rubric Engine & Score Bounding**
   - Structured rubric criteria matching (e.g. Conceptual Clarity, Step Structure, Language & Reasoning).
   - Score bounds `0 <= score <= maxMarks` are strictly enforced by both rubric engine and server review service.

4. **Misconceptions & Intelligence Stack Integration**
   - Misconceptions mapped to Knowledge Graph prerequisite concepts, Learning Path, Smart Revision, and Doubt Solver link creation.
   - Contributes to Risk Prediction signals and Study Planner remediation tasks.

5. **AI Safety Guardrails & Fallback Mode**
   - Grading prompt excludes student name, gender, caste, religion, financial status, or sensitive attributes.
   - When `AI_API_KEY` is unavailable, objective questions are graded normally, rubric scoring uses deterministic rules, and subjective questions are marked "Teacher review required".

---

## API Endpoints

### Teacher Endpoints (`/api/teacher/assessments` & `/api/teacher/submissions`)
- `POST /api/teacher/assessments` - Create an assessment draft.
- `GET /api/teacher/assessments` - List teacher's assessments.
- `POST /api/teacher/assessments/rubrics` - Create grading rubric.
- `GET /api/teacher/assessments/:assessmentId` - Fetch assessment details.
- `PUT /api/teacher/assessments/:assessmentId` - Update assessment details.
- `POST /api/teacher/assessments/:assessmentId/publish` - Publish assessment.
- `POST /api/teacher/assessments/:assessmentId/close` - Close assessment.
- `POST /api/teacher/assessments/:assessmentId/reopen` - Reopen assessment.
- `POST /api/teacher/assessments/:assessmentId/questions` - Add question.
- `GET /api/teacher/assessments/:assessmentId/submissions` - List submissions.
- `GET /api/teacher/assessments/:assessmentId/analytics` - Fetch class & question quality analytics.
- `GET /api/teacher/submissions/:submissionId` - View submission details.
- `GET /api/teacher/submissions/:submissionId/evaluation` - Fetch AI proposed evaluation.
- `POST /api/teacher/submissions/:submissionId/approve-ai` - Approve AI evaluation.
- `POST /api/teacher/submissions/:submissionId/finalize` - Modify grade & finalize/return to student.

### Student Endpoints (`/api/student/teacher-assessments` & `/api/student/submissions`)
- `GET /api/student/teacher-assessments` - Fetch published assignments.
- `GET /api/student/teacher-assessments/:assessmentId` - Fetch assignment details.
- `GET /api/student/teacher-assessments/:assessmentId/questions` - Fetch sanitized questions.
- `POST /api/student/teacher-assessments/:assessmentId/save` - Save draft answers.
- `POST /api/student/teacher-assessments/:assessmentId/submit` - Submit assessment.
- `GET /api/student/submissions/:submissionId/result` - Fetch returned result & feedback.

### Parent Endpoints (`/api/parent/assessments`)
- `GET /api/parent/assessments/student/:studentId/summary` - View child assessment summary (requires active link).

---

## Verification & Testing
- Feature audit script `scratch/test_teacher_assessment.js` passed **75/75 test criteria**.
- Server compilation (`npm run build:server`) and full production build (`npm run build`) passed with **0 errors**.
- Full-system regression audit (`scratch/test_full_regression.js`) passed with **12/12 steps**.
