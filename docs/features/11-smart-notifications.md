# Feature 11: Unified Smart Notifications & Alerts System

## Overview
Feature 11 introduces a deterministic, real-time smart notification and alert engine for **BharatEdu AI**. It aggregates actionable events across all 10 platform subsystems (Study Plan, Mistake Review, Teacher Interventions, Scholarships, Goals & Achievements, Exam Preparation, AI Learning Coach, and Career Roadmap) into a unified inbox with role-based access control and deduplication.

---

## Technical Architecture

### 1. Data Models
- **`NotificationModel`** (`server/src/models/notification.model.ts`):
  - `recipientUserId`: Target user ID (derived from JWT).
  - `recipientRole`: `'student'` | `'teacher'` | `'parent'`.
  - `type`: Specific alert type identifier (`overdue_task`, `exam_approaching`, `scholarship_deadline`, etc.).
  - `title`: Short descriptive alert title.
  - `message`: Detailed alert message.
  - `priority`: `'low'` | `'normal'` | `'high'` | `'critical'`.
  - `sourceType`: `'study_plan'` | `'mistake_review'` | `'intervention'` | `'scholarship'` | `'goal'` | `'achievement'` | `'exam'` | `'learning_coach'` | `'career'` | `'system'`.
  - `sourceId`: Reference ID of origin domain object.
  - `actionUrl`: Relative frontend route to navigate when actioned.
  - `isRead`: Boolean status flag.
  - `readAt`: Date of read action.
  - `dedupeKey`: Unique idempotent key to prevent duplicate alert creation across engine syncs.

### 2. Rule Evaluation Engine
- **`server/src/notifications/rules.ts`**:
  - `evaluateStudentRules(studentId)`: Evaluates overdue tasks, mistakes needing review, teacher intervention status, scholarship deadlines, completed goals, unlocked achievements, exam countdowns, learning gap alerts, and career roadmap updates.
  - `evaluateTeacherRules(teacherId)`: Evaluates class insights and student activity updates.
  - `evaluateParentRules(parentId)`: Evaluates progress alerts for linked students.
- **`server/src/notifications/engine.ts`**:
  - `syncUserNotifications(userId, role)`: Evaluates rules, filters out existing `dedupeKey`s, enriches messaging with OpenAI if `AI_API_KEY` is present (or falls back deterministically), and stores new notifications.

### 3. API Endpoints
- `GET /api/notifications`: Retrieve user's notifications (supports `isRead`, `priority`, `sourceType` filtering).
- `GET /api/notifications/unread-count`: Retrieve unread alert count.
- `POST /api/notifications/sync`: Explicitly trigger notification rule evaluation.
- `PATCH /api/notifications/:id/read`: Mark single notification as read.
- `PATCH /api/notifications/read-all` & `POST /api/notifications/read-all`: Mark all notifications as read.
- `DELETE /api/notifications/:id`: Delete notification.

---

## UI Components & Pages

- **`NotificationBell.tsx`** (`client/src/components/notifications/NotificationBell.tsx`): Header bell icon with unread badge counter and popover preview.
- **`NotificationCard.tsx`** (`client/src/components/notifications/NotificationCard.tsx`): Individual alert item with source icon, priority pill, relative timestamp, read toggle, and action link.
- **`NotificationList.tsx`** (`client/src/components/notifications/NotificationList.tsx`): Notification container with empty state handling.
- **`NotificationFilters.tsx`** (`client/src/components/notifications/NotificationFilters.tsx`): Tabbed filter bar.
- **`NotificationsPage.tsx`** (`client/src/pages/NotificationsPage.tsx`): Full inbox page mounted at `/notifications`.

---

## Security & Safety Principles

1. **Identity Protection**: Recipient ID is strictly derived from authenticated JWT (`req.user.id`). Never accepts `recipientUserId` from client requests.
2. **Access Control**: Student A cannot view or modify Student B notifications. Teacher and Parent receive only role-appropriate alerts.
3. **Idempotency**: `dedupeKey` prevents duplicate notifications on repeated rule evaluations.
4. **Deterministic Priority**: AI is NOT used to calculate priority, ownership, security, eligibility, or deadlines. AI may only optionally polish message wording.

---

## Empirical Verification

- **Feature Test Suite**: `scratch/test_notifications.js` (20/20 criteria passed).
- **Full Regression**: `scratch/test_full_regression.js` (Passed).
- **Production Build**: `npm run build` (Passed, 0 errors).
