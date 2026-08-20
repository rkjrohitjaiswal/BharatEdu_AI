# Feature 39: AI Academic Resource & Content Recommendation Engine

## Executive Overview
The AI Academic Resource & Content Recommendation Engine delivers personalized, server-authoritative, verified learning resource recommendations (NCERT, DIKSHA, CBSE, NIOS, official university textbooks, and interactive practice modules) tailored to every student's learning profile.

## Key Features & Capabilities
1. **Verified Resource Catalog**: Strictly uses verified, safe educational resources from official providers with non-fabricated URLs.
2. **Deterministic Server-Authoritative Scoring Engine**: Evaluates resource candidates against 9 weighted signals (0–100 score):
   - Learning Gap Relevance (Weight 20)
   - Knowledge Graph Prerequisite Gap (Weight 20)
   - Exam Preparation Relevance (Weight 15)
   - Mastery Need (Weight 15)
   - Goal Alignment (Weight 10)
   - Career Alignment (Weight 8)
   - Risk Alignment (Weight 5)
   - Revision Need (Weight 4)
   - Resource Preference (Weight 3)
3. **Multi-Role Dashboards**:
   - **Student**: `/resources` - Recommended For You, Fix My Gaps, Prerequisite First, Exam Prep, Career Skills, and Revision collections.
   - **Teacher**: `/teacher/resources` - Class-wide resource engagement, completion rates, and feedback analytics.
   - **Parent**: `/parent/resources` - Child's recommended study materials portal.
4. **Interactive Tracking & Feedback**:
   - Track `viewed`, `started`, `completed`, `saved`, `skipped`, and `rated` interactions.
   - Diversity filter prevents completed/dismissed resources from cluttering daily recommendations.

## API Endpoint Reference
- `GET /api/student/resources/recommended`
- `GET /api/student/resources/today`
- `GET /api/student/resources/exam`
- `GET /api/student/resources/gaps`
- `GET /api/student/resources/prerequisites`
- `GET /api/student/resources/career`
- `GET /api/student/resources/revision`
- `GET /api/student/resources/search`
- `GET /api/student/resources/:resourceId`
- `POST /api/student/resources/:resourceId/start`
- `POST /api/student/resources/:resourceId/complete`
- `POST /api/student/resources/:resourceId/save`
- `POST /api/student/resources/:resourceId/dismiss`
- `POST /api/student/resources/:resourceId/feedback`
- `GET /api/teacher/resources/class/:classId`
- `GET /api/teacher/resources/class/:classId/analytics`
- `GET /api/parent/resources/student/:studentId`
