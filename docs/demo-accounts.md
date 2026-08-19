# BharatEdu AI - Demo Credentials & Setup Guide

Development & Demonstration Credentials for Hackathon Evaluators.

> **Note:** These credentials operate in the local development environment (`npm run dev`) and connect to either local MongoDB or in-memory fallback storage.

---

## 1. Pre-configured Demo Accounts

### Student Demo Account
- **Role:** Student (`student`)
- **Email:** `demo.student@bharatedu.ai`
- **Password:** `password123`
- **Class Level:** Class 8 (NCERT)
- **Preferred Language:** Hindi / English
- **Pre-populated State:** 1 Mastered Topic (Fractions), 1 Active Learning Gap (Linear Equations), 1 Scholarship Match (NMMSS).

### Teacher Demo Account
- **Role:** Teacher (`teacher`)
- **Email:** `demo.teacher@bharatedu.ai`
- **Password:** `password123`
- **Assigned Class:** Class 8-A Mathematics & Science
- **Pre-populated State:** 24 Students, 3 At-Risk Signals, 1 Class Topic Heatmap.

---

## 2. Environment Reset & Seeding Commands

To reset the demonstration dataset back to a clean state:

```bash
# Seed initial curriculum, scholarships, and RAG knowledge base
npm run demo:seed

# Reset active demo student practice history and gaps
npm run demo:reset
```
