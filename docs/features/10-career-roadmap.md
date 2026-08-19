# Feature 10 — AI Career & Skill Roadmap

## Status
Implementation committed to `main`. Local build and live API verification should be run from the Antigravity project checkout after pulling the latest `main` commits.

## What it adds
- Student career goals with ownership enforced by JWT identity.
- Curated career catalog for Full-Stack Developer, AI/ML Engineer, Data Scientist and Frontend Developer.
- Deterministic skill assessment derived from authoritative `TopicMastery` records.
- Bounded 0–100 career readiness score.
- Skill levels: strong, developing, needs_work, missing.
- Priority levels: critical, high, medium, low.
- Personalized roadmap ordered by weakest relevant skills first.
- Practical project recommendation for each skill gap.
- Optional OpenAI career coaching with a deterministic fallback when `AI_API_KEY` is unavailable.
- Student-only protected REST API with goal ownership isolation.
- Student career roadmap page at `/career`.

## API
- `GET /api/student/career/catalog`
- `GET /api/student/career/goals`
- `POST /api/student/career/goals`
- `GET /api/student/career/goals/:id/roadmap`
- `GET /api/student/career/goals/:id/advice`
- `DELETE /api/student/career/goals/:id`

## Safety principles
The server calculates readiness, skill scores and priorities. The LLM is not allowed to alter scores or invent prerequisites. AI advice uses only supplied roadmap data and falls back safely when the API key is missing or unavailable.

## Verification
Run from the project root:

```bash
npm run build
node scratch/test_career_roadmap.js
node scratch/test_full_regression.js
npm run git:push
```

For the feature test, set `STUDENT_TOKEN` to a valid student JWT and ensure the local API is running.
