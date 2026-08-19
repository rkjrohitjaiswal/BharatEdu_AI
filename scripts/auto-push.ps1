# Safe Automatic GitHub Deployment & Push Script for BharatEdu AI
$ErrorActionPreference = "Stop"

$ProjectPath = "C:\Project\BharatEdu AI"
Set-Location $ProjectPath

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " BharatEdu AI - Safe GitHub Auto Push" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Check Git Repository & Branch
if (-not (Test-Path ".git")) {
    Write-Error "ERROR: Not a valid Git repository!"
    exit 1
}

$currentBranch = (git branch --show-current).Trim()
$remote = (git remote get-url origin).Trim()

Write-Host "Project Path : $ProjectPath"
Write-Host "Git Branch   : $currentBranch"
Write-Host "Git Remote   : $remote"
Write-Host ""

# 2. Check .gitignore
if (-not (Test-Path ".gitignore")) {
    Write-Error "ERROR: .gitignore file is missing!"
    exit 1
}

# 3. Check for Uncommitted Changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to push. Repository is up to date." -ForegroundColor Green
    exit 0
}

Write-Host "Changed Files Detected:" -ForegroundColor Yellow
$status | ForEach-Object { Write-Host "  $_" }
Write-Host ""

# 4. Secret Safety Inspection
Write-Host "Running Secret Safety Scan..." -ForegroundColor Cyan

$forbiddenFiles = @(".env", ".env.local", ".env.production", ".env.development")
foreach ($f in $forbiddenFiles) {
    if (Test-Path $f) {
        $staged = git status --porcelain | Select-String $f
        if ($staged) {
            Write-Error "SECURITY ERROR: Forbidden environment file '$f' is staged for commit!"
            exit 1
        }
    }
}

# 5. Production Build Verification
Write-Host "Running Production Build (npm run build)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "BUILD FAILED! Auto-push aborted to prevent pushing broken code."
    exit 1
}
Write-Host "Production Build Succeeded! ✅" -ForegroundColor Green
Write-Host ""

# 6. Generate Meaningful Commit Message based on changed files
$changedFilesList = git status --porcelain
$commitType = "chore"
$commitSummary = "update project files"

if ($changedFilesList -match "server/src/ai/learning-coach" -or $changedFilesList -match "LearningCoach") {
    $commitType = "feat"
    $commitSummary = "upgrade AI Learning Coach and daily recommendations"
} elseif ($changedFilesList -match "scholarship" -or $changedFilesList -match "Scholarship") {
    $commitType = "feat"
    $commitSummary = "update scholarship deadline alerts and tracking"
} elseif ($changedFilesList -match "teacher" -or $changedFilesList -match "intervention") {
    $commitType = "feat"
    $commitSummary = "update teacher intervention and remediation"
} elseif ($changedFilesList -match "practice" -or $changedFilesList -match "quiz") {
    $commitType = "feat"
    $commitSummary = "update practice and mistake review features"
} elseif ($changedFilesList -match "auth" -or $changedFilesList -match "security") {
    $commitType = "fix"
    $commitSummary = "update auth and security configuration"
} elseif ($changedFilesList -match "scripts/" -or $changedFilesList -match "package.json" -or $changedFilesList -match "\.gitignore") {
    $commitType = "chore"
    $commitSummary = "update GitHub automation scripts and configuration"
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "${commitType}: ${commitSummary} (${timestamp})"

# 7. Stage Changes
Write-Host "Staging Changes (git add .)..." -ForegroundColor Cyan
git add .

# 8. Verify Staged Files Safety
$stagedFiles = (git diff --cached --name-only)
$safetyViolations = @()

foreach ($file in $stagedFiles) {
    if ($file -like "*.env*" -and $file -ne ".env.example") {
        $safetyViolations += $file
    }
    if ($file -like "node_modules/*" -or $file -like "dist/*" -or $file -like "server/dist/*" -or $file -like "client/dist/*") {
        $safetyViolations += $file
    }
}

if ($safetyViolations.Count -gt 0) {
    Write-Host "SECURITY VIOLATION DETECTED! Forbidden files staged:" -ForegroundColor Red
    $safetyViolations | ForEach-Object { Write-Host "  FAILED: $_" -ForegroundColor Red }
    git reset
    Write-Error "Auto-push stopped. Staged forbidden files have been reset."
    exit 1
}

Write-Host "Staged Files Verified Safe: ✅" -ForegroundColor Green
$stagedFiles | ForEach-Object { Write-Host "  + $_" -ForegroundColor Gray }
Write-Host ""

# 9. Commit & Push
Write-Host "Creating Commit: '$commitMessage'..." -ForegroundColor Cyan
git commit -m $commitMessage

Write-Host "Pushing to remote 'origin/$currentBranch'..." -ForegroundColor Cyan
git push origin $currentBranch

if ($LASTEXITCODE -eq 0) {
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host " SUCCESS: Code successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host " Branch: $currentBranch" -ForegroundColor Green
    Write-Host " Message: $commitMessage" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
} else {
    Write-Error "ERROR: git push failed."
    exit 1
}
