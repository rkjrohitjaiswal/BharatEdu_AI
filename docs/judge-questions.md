# BharatEdu AI - Hackathon Judge Q&A Guide

Verified answers to 15 key technical and domain questions from judges.

---

### Q1: Why not just use ChatGPT or generic chatbots?
**A:** Generic chatbots hallucinate educational facts, lack chapter-level textbook citations, cannot evaluate student answers securely, and have no integration with teacher analytics or government scholarship engines. BharatEdu AI uses RAG grounded in official NCERT textbooks with exact citations.

### Q2: How do you prevent AI hallucinations?
**A:** System prompts strictly enforce that explanations must be derived from retrieved educational chunks. If no relevant source chunk meets the similarity threshold, the tutor explicitly states that verified source evidence is unavailable rather than fabricating an answer.

### Q3: How does RAG retrieval work in BharatEdu AI?
**A:** Open educational resources (NCERT textbooks, Samagra Shiksha guides) are chunked into structured segments, embedded into vector space, and indexed. When a student asks a doubt, `retriever.ts` searches relevant chunks by vector cosine similarity and feeds them as grounded context to the LLM.

### Q4: How are citations generated?
**A:** Each retrieved chunk carries source metadata (`title`, `publisher`, `section`, `page`). When the AI Orchestrator generates a response, it attaches these exact metadata records as structured citation objects returned to the frontend.

### Q5: How is personalization achieved?
**A:** Every student has a stored `TopicMastery` and `LearningProfile`. The AI Orchestrator retrieves the student's current class level, preferred language, active learning gaps, and recent mastery scores to tailor explanation depth and vocabulary.

### Q6: How does the system detect learning gaps?
**A:** `analyzer.ts` evaluates attempt accuracy, time spent, and error patterns against deterministic rules. Multiple incorrect attempts trigger a `knowledge_gap` or `misconception` event with assigned severity (`low`, `medium`, `high`, `critical`).

### Q7: How does adaptive practice work?
**A:** `selector.ts` prioritizes topics with active critical/high gaps. `difficulty.ts` sets initial difficulty based on mastery score (<40 easy, 40-70 medium, >70 hard) and adjusts difficulty dynamically during the session (2 consecutive correct -> step up; 2 consecutive incorrect -> step down).

### Q8: How does the teacher benefit?
**A:** Teachers receive class-wide analytics including topic difficulty heatmaps, at-risk student signals, and concrete pedagogical intervention recommendations (e.g. *"Review prerequisite algebra before linear equations"*).

### Q9: How do you protect student data & privacy?
**A:** All endpoints enforce JWT authentication and role authorization. Backend ownership checks prevent Student A from accessing Student B's data or Teacher A from accessing Teacher B's classes. Zero student audio or images are stored permanently.

### Q10: How does scholarship matching work?
**A:** `criteria.engine.ts` compares student class, location, category, and income against published government criteria deterministically. Unprovided profile fields are marked `UNKNOWN` ("Need to Verify") rather than false failures. Matches display document checklists and direct official portal links under legal disclaimers.

### Q11: Why use an API provider abstraction instead of hardcoding LLM calls?
**A:** The provider pattern (`server/src/ai/provider/`) decouples application logic from specific AI vendors. We can switch between OpenAI, local models, or cloud providers seamlessly without changing Tutor, RAG, or Practice code.

### Q12: What happens if the AI API is unavailable?
**A:** The system handles provider timeouts and missing API keys gracefully by returning helpful user-facing messages. Core functionality (adaptive practice, dashboard, mastery tracking, scholarship matching) continues to function offline or in fallback mode.

### Q13: How does multilingual support work?
**A:** UI strings use localized JSON files (`en`, `hi`, `gu`). The AI Tutor and Practice engines format prompts and explanations in the student's selected language (`english`, `hindi`, `gujarati`), while Web Speech API handles native speech recognition & synthesis.

### Q14: How can this scale to millions of students across India?
**A:** The architecture uses stateless REST endpoints, MongoDB indexes, client-side Web Speech APIs, and pre-computed analytics aggregations to handle high concurrent user traffic efficiently.

### Q15: What would you build next?
**A:** Regional language speech models for additional Indian dialects, automated SMS/WhatsApp study reminders for low-connectivity regions, and direct integration with state educational portals.
