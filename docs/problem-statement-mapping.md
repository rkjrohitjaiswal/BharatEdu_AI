# BharatEdu AI - OOSC 4.0 Problem Statement Mapping

**Problem Statement 2:** *AI for Equitable Education Access & Out-of-School Children (OOSC) Re-integration*

---

## Direct Requirement Mapping

| Problem Statement Requirement | BharatEdu AI Implementation | Verified Codebase Location |
| :--- | :--- | :--- |
| **1. Grounded Curriculum Doubt Solving** | RAG-based AI Tutor grounded in official NCERT textbooks with exact chapter, page, and section citations. Zero hallucinations. | `server/src/ai/rag/retriever.ts`<br/>`client/src/components/SourceCitation.tsx` |
| **2. Adaptive Practice & Remediation** | Dynamic topic selector prioritizing critical learning gaps; server-side answer evaluation; adaptive in-session difficulty adjustment (`easy`/`medium`/`hard`). | `server/src/ai/practice/selector.ts`<br/>`server/src/ai/practice/difficulty.ts` |
| **3. Learning Gap & Misconception Detection** | Automated evidence analyzer classifying `knowledge_gap`, `prerequisite_gap`, `misconception`, and `practice_gap` with severity levels. | `server/src/ai/learning/analyzer.ts`<br/>`server/src/models/learning-gap.model.ts` |
| **4. Teacher Intelligence & Actionable Insights** | Real-time teacher dashboard displaying class topic difficulty heatmaps, at-risk student signals, and targeted pedagogical intervention cards. | `server/src/controllers/teacher.controller.ts`<br/>`client/src/pages/TeacherDashboardPage.tsx` |
| **5. Equity & Scholarship Assistance** | Grounded government scholarship database (NMMSS, Samagra Shiksha), deterministic eligibility matching (class, income ceiling, state), document checklists, and official portal links. | `server/src/scholarships/matcher.ts`<br/>`client/src/pages/ScholarshipsPage.tsx` |
| **6. Multilingual & Inclusion Support** | Full UI & Tutor support for English, Hindi, and Gujarati; Web Speech API voice input/output; accessible text sizing, high-contrast, and screen-reader `aria-live` support. | `client/src/i18n/`<br/>`client/src/context/AccessibilityContext.tsx`<br/>`client/src/services/voice/` |
| **7. Multi-Modal Doubt Input** | Vision-assisted OCR extracting textbook questions and handwritten equations from photo uploads for grounded solving. | `server/src/ai/vision/provider.ts` |
