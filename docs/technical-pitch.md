# BharatEdu AI - Technical Deep-Dive Pitch

Detailed technical architecture walkthrough for technical hackathon judges.

---

## 1. Full Stack Architecture
- **Frontend Layer**: React 18, Vite, TypeScript, Vanilla CSS design tokens. Built with accessible components, i18n hooks (`en`, `hi`, `gu`), Web Speech API bindings (`en-IN`, `hi-IN`, `gu-IN`), and Accessibility Context (`textSize`, `highContrast`, `reducedMotion`).
- **Backend API Layer**: Node.js, Express, TypeScript, RESTful API architecture. Protected by JWT authentication and strict role guards (`student`, `teacher`).
- **Database & Storage**: MongoDB with Mongoose schemas (or zero-dependency in-memory fallback mode). Indexes optimized for `studentId`, `teacherId`, `topicId`, `verificationStatus`, and `createdAt`.

## 2. AI & Grounded RAG Pipeline
- **Retriever Engine**: `server/src/ai/rag/retriever.ts` performs vector similarity search over ingested NCERT & Samagra Shiksha textbook chunks.
- **Provider Abstraction**: `server/src/ai/provider/` encapsulates OpenAI GPT-4o calls behind a clean provider interface, allowing plug-and-play provider switching.
- **Grounded System Prompt**: Prompt explicitly constrains LLM responses to retrieved context and attaches structured source metadata citations (`title`, `page`, `section`, `publisher`).

## 3. Deterministic Learning Intelligence & Practice Engine
- **Evidence Rule Engine**: Analyzes quiz & practice attempt history to update `TopicMastery` and detect `LearningGap` events without letting the LLM mutate student scores.
- **Adaptive Topic Selector**: Prioritizes topics: Critical Gaps -> High Gaps -> Misconceptions -> Prerequisite Gaps -> Needs Review -> Low Practice.
- **Server-Side Answer Security**: Sanitizes question objects in `practice.controller.ts` to remove `correctAnswer` before returning payloads to client.

## 4. Security & Privacy Controls
- **Zero Client Key Exposure**: AI API keys and JWT secrets exist strictly in backend `.env`.
- **IDOR Protection**: Server enforces `req.user.id` ownership on student data and teacher class ownership on class analytics.
