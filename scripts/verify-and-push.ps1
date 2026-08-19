# Helper Script: Verify Build, Security, and Push to GitHub
$ErrorActionPreference = "Stop"

Set-Location "C:\Project\BharatEdu AI"

Write-Host "Running Verification and Auto-Push Workflow..." -ForegroundColor Cyan
& ".\scripts\auto-push.ps1"
