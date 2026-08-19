# BharatEdu AI - Live Pre-Presentation Checklist

Perform these verification checks 10 minutes prior to presenting to hackathon judges.

---

## Pre-Presentation Checklist

### Environment & Servers
- [ ] **Node.js Server**: Running on port `5000` (`npm run dev:server`).
- [ ] **Vite Frontend**: Running on port `5173` (`npm run dev:client`).
- [ ] **Health Endpoint**: `http://localhost:5000/api/health` returns `200 OK`.
- [ ] **Database Connection**: MongoDB connected or in-memory fallback active.
- [ ] **AI API Key**: `AI_API_KEY` present in `server/.env` (if showcasing live LLM generation).

### Student Flow Readiness
- [ ] **Student Login**: Log in with `demo.student@bharatedu.ai` / `password123`.
- [ ] **Dashboard Cards**: Subject mastery scores and active learning gaps load cleanly.
- [ ] **AI Tutor RAG**: Ask a test doubt; verify NCERT source citation appears at bottom.
- [ ] **Adaptive Practice**: Click recommended practice; verify questions load and difficulty adapts.
- [ ] **Language Switcher**: Test switching between English, Hindi, and Gujarati.

### Teacher Flow Readiness
- [ ] **Teacher Login**: Log in with `demo.teacher@bharatedu.ai` / `password123`.
- [ ] **Needs Attention Panel**: Verify flagged at-risk student card displays gap & severity.
- [ ] **Topic Heatmap**: Verify class mastery percentages render with accessible amber/emerald badges.

### Scholarship Engine Readiness
- [ ] **Scholarship Hub**: Open `/scholarships`; verify NMMSS 100% potential match and official `scholarships.gov.in` link display under legal disclaimer banner.
