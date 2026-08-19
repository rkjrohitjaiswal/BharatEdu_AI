# Safe GitHub Auto-Push & Automatic Watcher Automation

**Project:** BharatEdu AI  
**Repository:** `https://github.com/rkjrohitjaiswal/BharatEdu_AI.git`  
**Auto-Push Script:** [`scripts/auto-push.ps1`](file:///c:/Project/BharatEdu%20AI/scripts/auto-push.ps1)  
**Automatic Watcher Script:** [`scripts/watch-and-push.ps1`](file:///c:/Project/BharatEdu%20AI/scripts/watch-and-push.ps1)  
**NPM Commands:**
- `npm run git:push`: Manual trigger for safe build, test, and push cycle
- `npm run git:watch`: Background file watcher monitoring project changes with 60s debounce

---

## 1. Overview

The **BharatEdu AI Safe GitHub Automation System** ensures that code changes are automatically detected, safety-checked, built, tested, committed, and pushed to the remote `origin main` branch without risking broken builds or secret leaks.

---

## 2. Automatic Watcher Workflow (`npm run git:watch`)

```
Project File Modification (server/src, client/src, docs, config)
 ↓
Watcher Event Triggered (Ignores .git, node_modules, dist, *.log, scratch)
 ↓
Debounce Timer Reset (Resets 60-second inactivity countdown)
 ↓
Inactivity Reached (60s without further changes)
 ↓
Secret Safety Scan (Scans for hardcoded credentials & verifies .env exclusion)
 ↓
Production Build Verification (Runs `npm run build` - server tsc + client vite build)
 ↓
Discovered Tests Execution (Runs available scratch test scripts)
 ↓
Build & Test Guard (If build or tests fail -> STOP IMMEDIATELY, zero commits/pushes)
 ↓
Staged File Safety Check (Verifies node_modules, dist, .env are NOT staged)
 ↓
Meaningful Commit Generation (Conventional commit message generated based on scope)
 ↓
Safe Push (Pushes to `origin main` - NEVER uses --force)
```

---

## 3. NPM Commands & Usage

### 1. Manual Safe Push
To manually trigger a build check, secret scan, test suite run, commit, and push:

```bash
npm run git:push
```

### 2. Automatic Background Watcher
To start watching project changes in real-time with 60-second debounce:

```bash
npm run git:watch
```

To stop the watcher at any time, press `Ctrl + C` in the terminal.

---

## 4. Security & Security Safeguards

The automation enforces strict security rules:
- `.env`, `.env.*` (except `.env.example`), `node_modules/`, `dist/`, `server/dist/`, `client/dist/`, `*.log`, `coverage/`, `.DS_Store` are ignored via [`.gitignore`](file:///c:/Project/BharatEdu%20AI/.gitignore).
- Secret safety scanner verifies that no API keys (`sk-`), JWT secrets, or database connection URIs are committed.
- Merge/Rebase conflict guard verifies `.git/MERGE_HEAD` and `.git/rebase-merge` do not exist.
- If any forbidden or sensitive file is staged, the script automatically executes `git reset` and halts immediately.

---

## 5. Build & Test Guard Policy

- **Zero Broken Pushes:** Before staging or committing, `npm run build` executes full TypeScript server compilation (`tsc`) and Vite frontend bundle creation (`vite build`).
- **Automated Test Discovery:** Discovers and executes available test suites in `scratch/` (e.g. `scratch/test_full_regression.js`, `scratch/test_learning_coach.js`, `scratch/test_parent_insights.js`).
- If TypeScript errors, bundling failures, or test assertion failures occur, the push stops immediately with exit code 1.

---

## 6. Conventional Commit Message Generator

The commit message is generated dynamically based on the scope of modified files:
- **Parent Features:** `feat: add parent learning insights and progress report`
- **AI Coach Features:** `feat: upgrade AI Learning Coach and daily recommendations`
- **Scholarships:** `feat: update scholarship deadline alerts and tracking`
- **Fixes:** `fix: update auth and security configuration`
- **Documentation:** `docs: update project documentation`
- **Config & Automation:** `chore: update GitHub automation scripts and configuration`

Example generated commit message:
`feat: add parent learning insights and progress report (2026-08-20 00:30:00)`

---

## 7. Troubleshooting & Disabling

- **To Stop Watcher:** Press `Ctrl + C` in the terminal.
- **To Push Manually:** Run `git status`, `git add .`, `git commit -m "..."`, `git push origin main`.
