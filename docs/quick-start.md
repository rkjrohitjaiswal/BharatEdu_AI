# BharatEdu AI - Quick Start Guide

Complete instructions for setting up, seeding, building, and running BharatEdu AI.

---

## 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB** (Optional): Local instance or MongoDB Atlas connection string. If omitted, system runs automatically in in-memory fallback mode.

---

## 2. Installation & Setup

```bash
# Clone repository and install dependencies
git clone https://github.com/bharatedu-ai/bharatedu-ai.git
cd bharatedu-ai

# Install root, server, and client dependencies
npm run install:all
```

---

## 3. Environment Configuration

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bharatedu-ai
JWT_SECRET=bharatedu_production_jwt_secret_key_2026
AI_PROVIDER=openai
AI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4o
EMBEDDING_MODEL=text-embedding-3-small
```

---

## 4. Database Seeding & Development

```bash
# Compile TypeScript build
npm run build

# Seed NCERT curriculum, scholarships, and RAG knowledge base
npm run demo:seed

# Launch development environment (Backend: 5000, Frontend: 5173)
npm run dev
```

---

## 5. System Health Check & Verification

```bash
# Run automated system health check
npm run health:check

# Run test suites
node scratch/test_auth_phase2.js
node scratch/test_phase6a.js
node scratch/test_phase6b.js
node scratch/test_phase8.js
```
