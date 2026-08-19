# BharatEdu AI - Key Technical Differentiators

Top verified technical differentiators that distinguish BharatEdu AI from generic chatbots.

---

## Top 6 Technical Differentiators

1. **Strictly Grounded RAG with Chapter-Level Citations**:
   - Rather than relying on generic LLM memory, every tutor explanation queries the NCERT & Samagra Shiksha vector database to return exact chapter, section, and page citations.
2. **Server-Side Answer Security Guard**:
   - In practice sessions, `correctAnswer` is strictly withheld from all client HTTP responses before answer submission, preventing browser developer tool inspection or cheating.
3. **Deterministic Learning Intelligence Engine**:
   - Learning gaps (`knowledge_gap`, `prerequisite_gap`, `misconception`, `practice_gap`) and risk levels (`low`, `medium`, `high`, `critical`) are calculated using pure deterministic rules. The LLM is never allowed to fabricate student mastery scores.
4. **Actionable Teacher Intervention Intelligence**:
   - Aggregates student evidence into class-wide topic heatmaps and generates concrete pedagogical intervention cards (e.g. *"Review transposition rules before proceeding to linear expressions"*).
5. **Deterministic Scholarship Criteria Matcher**:
   - Evaluates class levels, location, and income limits deterministically. Missing profile fields are classified as `UNKNOWN` ("Need to Verify") rather than false failures. Displays mandatory legal disclaimers and links exclusively to official government portals (`scholarships.gov.in`).
6. **Zero-API-Key-Leakage Multilingual Architecture**:
   - Client uses Web Speech APIs (`en-IN`, `hi-IN`, `gu-IN`) for zero-latency speech recognition and synthesis. All AI calls execute server-side; no API keys reach browser JavaScript bundles.
