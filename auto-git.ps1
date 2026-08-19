$ProjectPath = "C:\Project\BharatEdu AI"
$DelaySeconds = 45

Set-Location $ProjectPath

Write-Host "========================================="
Write-Host " BharatEdu AI - Git Auto Push"
Write-Host "========================================="
Write-Host "Watching: $ProjectPath"
Write-Host "Waiting $DelaySeconds seconds after changes..."
Write-Host "Press Ctrl+C to stop."
Write-Host ""

$lastHash = ""

while ($true) {

    $status = git status --porcelain

    if ($status) {

        $currentHash = ($status | Out-String)

        if ($currentHash -ne $lastHash) {

            $lastHash = $currentHash

            Write-Host ""
            Write-Host "Changes detected. Waiting $DelaySeconds seconds..."

            Start-Sleep -Seconds $DelaySeconds

            $statusAfterWait = git status --porcelain

            if ($statusAfterWait) {

                Write-Host "Changes stabilized. Pushing to GitHub..."

                git add .

                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

                git commit -m "Auto update: $timestamp"

                git push origin main

                if ($LASTEXITCODE -eq 0) {
                    Write-Host "SUCCESS: GitHub updated."
                }
                else {
                    Write-Host "ERROR: GitHub push failed."
                }

                Write-Host ""
            }

            $lastHash = ""
        }
    }

    Start-Sleep -Seconds 5
}