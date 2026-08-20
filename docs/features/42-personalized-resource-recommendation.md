# Feature 42: AI Personalized Learning Content & Resource Recommendation Engine

## 1. Overview
The AI Personalized Learning Content & Resource Recommendation Engine delivers curriculum-aligned, verified educational resources tailored to each student's concept mastery, prerequisite learning gaps, exam targets, and revision schedules.

## 2. Architecture & Components
- **Data Models**:
  - `LearningResource`: Verified curriculum material metadata (NCERT, CBSE, official sources).
  - `ResourceConcept`: Links resources to Knowledge Graph concepts with relationship type (`teaches`, `prerequisite`, `reinforces`, `revision`).
  - `StudentResourceInteraction`: Authoritative server interaction tracking (`viewed`, `started`, `completed`, `bookmarked`, `rated`).
  - `ResourceFeedback`: Student ratings, helpfulness feedback, and difficulty assessments.
- **AI Recommendation Engine**:
  - `Catalog`: Verified starter catalog with official NCERT and CBSE URLs.
  - `Validator`: Quality, domain, URL, and verification validator rejecting invalid content.
  - `CurriculumAlignment`: Class, board, subject, topic, and concept matching.
  - `Ranking`: 14-factor deterministic ranking algorithm.
  - `AICoach`: Non-authoritative AI explanations with deterministic fallbacks.
  - `Analytics`: Resource completion, time spent, and effectiveness analytics.

## 3. Key Integrations
- **Knowledge Graph (Feature 21)**: Prioritizes prerequisite repair over advanced topics.
- **Learning Gaps & Smart Revision (Feature 24)**: Recommends targeted content when revision is due.
- **Exam Preparation (Feature 41)**: Increases board exam weightage material ranking near exams.
- **Assessment Engine (Feature 40)**: Suggests remedial content following weak assessment scores.

## 4. API Endpoints
### Student
- `GET /api/student/resources`: Browse catalog.
- `GET /api/student/resources/recommended`: Get personalized ranking.
- `GET /api/student/resources/:resourceId`: Resource detail.
- `GET /api/student/resources/:resourceId/reason`: Recommendation explanation.
- `POST /api/student/resources/:resourceId/start`: Start resource.
- `POST /api/student/resources/:resourceId/progress`: Update progress.
- `POST /api/student/resources/:resourceId/complete`: Mark complete.
- `POST /api/student/resources/:resourceId/bookmark`: Bookmark resource.
- `POST /api/student/resources/:resourceId/rating`: Rate resource.
- `GET /api/student/resources/next`: Get next best resource.

### Teacher
- `GET /api/teacher/resources`: Browse verified resources catalog.
- `POST /api/teacher/resources/recommend`: Recommend resource to class.
- `GET /api/teacher/resources/class/:classId/analytics`: Class resource analytics.

### Parent
- `GET /api/parent/resources/student/:studentId`: View child's recommended resources.
- `GET /api/parent/resources/student/:studentId/progress`: View child resource progress.

## 5. Security & Safety
- **Server Authoritative**: All recommendation scores, progress, and verification flags are server-derived.
- **URL & Domain Validation**: Never fabricates URLs or official sources.
- **Role Isolation**: 401 unauthenticated and 403 unauthorized enforcement.
