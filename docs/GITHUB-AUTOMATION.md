# Safe GitHub Auto-Push & Deployment Automation

**Project:** BharatEdu AI  
**Repository:** `https://github.com/rkjrohitjaiswal/BharatEdu_AI.git`  
**Automation Script:** [`scripts/auto-push.ps1`](file:///c:/Project/BharatEdu%20AI/scripts/auto-push.ps1)  
**NPM Command:** `npm run git:push`

---

## 1. Overview

The **BharatEdu AI Safe Auto-Push Automation** ensures that code changes are automatically validated, safety-checked, compiled, committed, and pushed to the current active Git branch without risking broken builds or secret leaks.

---

## 2. How It Works

When `npm run git:push` is executed:

```
1. Git Branch & Remote Check (Determines active branch, e.g. main)
 ↓
2. Secret Safety Scan (Scans for hardcoded credentials & verifies .env exclusion)
 ↓
3. Production Build Verification (Runs `npm run build` - server + client)
 ↓
4. Build Guard (If build fails -> STOPS IMMEDIATELY, zero code committed/pushed)
 ↓
5. Staged File Verification (Verifies node_modules, dist, .env are NOT staged)
 ↓
6. Commit Message Generator (Generates conventional commit message based on changed files)
 ↓
7. Safe Push (Pushes to `origin <CURRENT_BRANCH>` - NEVER uses --force)
```

---

## 3. How to Run Automation

To manually trigger a build check, secret scan, commit, and push:

```bash
npm run git:push
```

Or execute the PowerShell script directly:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/auto-push.ps1
```

---

## 4. Secret & Security Protection Rules

The automation enforces strict security rules:
- `.env`, `.env.*` (except `.env.example`), `node_modules/`, `dist/`, `server/dist/`, `client/dist/`, `*.log`, `coverage/`, `.DS_Store` are ignored via [`.gitignore`](file:///c:/Project/BharatEdu%20AI/.gitignore).
- Secret safety scanner verifies that no API keys (`sk-`), JWT secrets, or database connection URIs are committed.
- If any forbidden or sensitive file is staged, the script automatically executes `git reset` and halts immediately.

---

## 5. Build Guard Policy

- **Zero Broken Pushes:** Before staging or committing, `npm run build` executes full TypeScript server compilation (`tsc`) and Vite frontend bundle creation (`vite build`).
- If TypeScript errors or bundling failures occur, the push stops immediately with exit code 1.

---

## 6. Meaningful Commit Message Generation

The commit message is generated based on the scope of modified files:
- **Feature updates:** `feat: update AI learning coach`, `feat: update scholarship deadline alerts`
- **Fixes:** `fix: update auth and security configuration`
- **Config & Automation:** `chore: update GitHub automation scripts and configuration`

Example generated commit message:
`feat: upgrade AI Learning Coach and daily recommendations (2026-08-20 00:15:00)`

---

## 7. Disabling or Overriding Automation

To push manually using standard Git commands:

```bash
git status
git add .
git commit -m "your custom commit message"
git push origin <branch-name>
```

---

## 8. Antigravity Workflow Rule for Future Tasks

For future feature implementation tasks:
1. Run automated test suites.
2. Run `npm run build`.
3. Run secret safety scan.
4. Run `npm run git:push`.
