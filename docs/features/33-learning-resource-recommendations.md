# Feature 33: AI Learning Resource, Content Recommendation & Resource Discovery Engine

## Overview
Feature 33 delivers a production-ready personalized learning-resource recommendation and discovery system for BharatEdu AI. It matches verified, safe educational resources (videos, articles, practice items, interactive tools, NCERT e-books) to students based on 9 educational dimensions while strictly enforcing URL safety (`https://` scheme only), deterministic server-authoritative scoring (0–100), and multi-role privacy controls.

---

## Key Features

1. **Multi-Factor Candidate Matching (9 Dimensions)**
   - **Concept & Topic Match:** 25 pts max for aligning with student's weak concepts (<60% mastery).
   - **Prerequisite Gap Match:** 15 pts max for foundational prerequisite gaps.
   - **Exam Urgency Match:** 10 pts max based on upcoming exam dates and target topics.
   - **Difficulty Fit:** 10 pts max matching student target difficulty level.
   - **Learning Path Match:** 10 pts max aligned with active stage & next tasks.
   - **Career & Goal Fit:** 5 pts max for target career skills and learning goals.
   - **Language Fit:** 5 pts max for preferred medium (English, Hindi, Gujarati fallback).
   - **Resource Quality:** 5 pts max for trusted verified catalog sources (NCERT, official docs).

2. **Priority Classification & Context Reasons**
   - Assigns explicit priorities: `CRITICAL` (score >= 80 or high-risk gap), `HIGH` (score >= 60), `MEDIUM` (score >= 40), `LOW`.
   - Explains *why* the resource was recommended in clear, student-friendly language.

3. **Repetition Control & Time Budget Personalization**
   - Filters out already completed resources and penalizes recently skipped resources.
   - Adapts to available daily study budget (e.g., 15-minute quick reads vs 45-minute deep dives).

4. **Strict URL Safety & Quality Verification**
   - Validates external URLs against strict `https://` scheme requirements.
   - Rejects unsafe schemes (`javascript:`, `data:`, `file:`, `http:`).
   - Resources marked `verified = false` have `url = null` and are not rendered as raw clickable external links.

5. **Student Bookmarks & Interaction Tracking**
   - Save bookmarks with custom study notes.
   - Track interaction events: `viewed`, `opened`, `started`, `completed`, `helpful`, `not_helpful`, `skipped`.

6. **Teacher & Parent Insights**
   - **Teacher View:** Track recommended resource usage and engagement across students.
   - **Parent View:** Monitor child's resource consumption with active parent-student link authorization.

---

## API Endpoints

### Student Endpoints (`/api/student/resources`)
- `GET /recommendations` - Get personalized resource recommendations.
- `GET /recommendations/:id` - Get detailed recommendation context & AI explanation.
- `POST /recommendations/refresh` - Force fresh recommendation generation.
- `POST /recommendations/:id/dismiss` - Dismiss a recommendation.
- `GET /` - Browse all verified catalog resources.
- `GET /:resourceId` - Get resource details.
- `POST /:resourceId/interaction` - Record interaction event (`opened`, `completed`, etc.).
- `POST /:resourceId/bookmark` - Bookmark a resource with optional note.
- `DELETE /:resourceId/bookmark` - Remove bookmark.
- `GET /bookmarks` - List student bookmarks.
- `GET /history` - Get interaction history.

### Teacher Endpoints (`/api/teacher/resources`)
- `GET /student/:studentId/summary` - View student resource engagement summary.

### Parent Endpoints (`/api/parent/resources`)
- `GET /student/:studentId/summary` - View child resource summary (requires active link).

---

## Verification & Testing
- Automated audit script `scratch/test_resource_recommendations.js` ran 50+ criteria.
- Full server compilation (`npm run build:server`) and full production build (`npm run build`) passed with 0 errors.
- Full-system regression audit (`scratch/test_full_regression.js`) passed with 12/12 steps.
