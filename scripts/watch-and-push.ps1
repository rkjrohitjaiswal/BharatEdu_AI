# Automatic GitHub Watcher & Deployment Script for BharatEdu AI
$ErrorActionPreference = "Continue"

$ProjectPath = "C:\Project\BharatEdu AI"
Set-Location $ProjectPath

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " BharatEdu AI - Automatic GitHub Watcher" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Project Path : $ProjectPath"
Write-Host "Debounce Time: 60 seconds"
Write-Host "Press Ctrl+C to stop the watcher."
Write-Host ""

$DebounceSeconds = 60
$lastChangeTime = [DateTime]::MinValue
$isPendingChange = $false
$isPushing = $false

# Setup FileSystemWatcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $ProjectPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Filter out build outputs, node_modules, .git, and temp logs
$action = {
    $path = $Event.SourceEventArgs.FullPath
    
    # Ignore forbidden/generated paths to prevent infinite loops
    if ($path -match "\\.git\\" -or 
        $path -match "\\node_modules\\" -or 
        $path -match "\\dist\\" -or 
        $path -match "\\server\\dist\\" -or 
        $path -match "\\client\\dist\\" -or 
        $path -match "\\.vite\\" -or 
        $path -match "\.log$" -or 
        $path -match "scratch\\") {
        return
    }

    $script:lastChangeTime = [DateTime]::Now
    $script:isPendingChange = $true
    Write-Host "[Watcher] Change detected in: $($Event.SourceEventArgs.Name) at $(Get-Date -Format 'HH:mm:ss'). Resetting 60s debounce timer..." -ForegroundColor Yellow
}

# Register watcher event handlers
Register-ObjectEvent $watcher Changed -Action $action | Out-Null
Register-ObjectEvent $watcher Created -Action $action | Out-Null
Register-ObjectEvent $watcher Deleted -Action $action | Out-Null
Register-ObjectEvent $watcher Renamed -Action $action | Out-Null

Write-Host "[Watcher] FileSystemWatcher initialized and actively monitoring..." -ForegroundColor Green
Write-Host ""

# Main Monitoring Loop
while ($true) {
    Start-Sleep -Seconds 2

    if ($isPendingChange -and (-not $isPushing)) {
        $elapsed = ([DateTime]::Now - $lastChangeTime).TotalSeconds

        if ($elapsed -ge $DebounceSeconds) {
            $isPendingChange = $false
            $isPushing = $true

            Write-Host ""
            Write-Host "=========================================" -ForegroundColor Cyan
            Write-Host " 60s Inactivity Reached! Starting Verification & Push" -ForegroundColor Cyan
            Write-Host "=========================================" -ForegroundColor Cyan

            try {
                # Check git status for uncommitted changes
                $status = (git status --porcelain)
                if ($status) {
                    & "powershell" "-ExecutionPolicy" "Bypass" "-File" ".\scripts\auto-push.ps1"
                } else {
                    Write-Host "[Watcher] No uncommitted changes detected. Skipping push." -ForegroundColor Green
                }
            } catch {
                Write-Host "[Watcher] Push Workflow Encountered Error: $_" -ForegroundColor Red
            } finally {
                $isPushing = $false
                Write-Host ""
                Write-Host "[Watcher] Resuming monitoring for new changes..." -ForegroundColor Green
            }
        } else {
            $remaining = [Math]::Ceiling($DebounceSeconds - $elapsed)
            # Quiet countdown status line
        }
    }
}
