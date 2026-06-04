# Scan paths that are safe to commit (excludes node_modules, .env files, models).
# Usage: powershell -File scripts/check-secrets.ps1

$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

$patterns = @(
    "sk-or-v1-[A-Za-z0-9]{8,}"
    "sk-proj-[A-Za-z0-9]{8,}"
    "gsk_[A-Za-z0-9]{20,}"
)

$scanRoots = @(
    "ai-resume-system\src"
    "ai-resume-system\*.md"
    "frontend\app"
    "frontend\lib"
    "frontend\*.md"
    "backend"
    "scripts"
    ".vscode"
    "*.md"
    "*.bat"
    "*.json"
    "*.ts"
    "*.py"
)

$hits = @()

function Test-FileForSecrets($filePath) {
    $content = Get-Content -LiteralPath $filePath -Raw -ErrorAction SilentlyContinue
    if (-not $content) { return }
    foreach ($pattern in $patterns) {
        if ($content -match $pattern) {
            $script:hits += $filePath
            return
        }
    }
}

foreach ($item in $scanRoots) {
    $target = Join-Path $root $item
    if ($item -match '\*') {
        Get-ChildItem -Path $root -Filter ($item.Split('\')[-1]) -File -ErrorAction SilentlyContinue | ForEach-Object {
            if ($_.Name -match '\.env') { return }
            Test-FileForSecrets $_.FullName
        }
    } elseif (Test-Path $target) {
        if ((Get-Item $target).PSIsContainer) {
            Get-ChildItem -Path $target -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
                if ($_.Name -match '^\.env') { return }
                Test-FileForSecrets $_.FullName
            }
        } else {
            Test-FileForSecrets $target
        }
    }
}

if ($hits.Count -gt 0) {
    Write-Host "SECRET SCAN FAILED - possible credentials in:" -ForegroundColor Red
    $hits | Select-Object -Unique | ForEach-Object { Write-Host "  $_" }
    exit 1
}

Write-Host "SECRET SCAN PASSED - no API key patterns in committable source paths." -ForegroundColor Green
exit 0
