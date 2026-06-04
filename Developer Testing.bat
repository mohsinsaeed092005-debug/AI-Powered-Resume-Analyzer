@echo off
REM One-click: start Resume Analyzer (testing UI) and open http://localhost:3001/resume-analyzer

setlocal enabledelayedexpansion

echo.
echo ============================================
echo  DEVELOPER TESTING - RESUME ANALYZER
echo ============================================
echo.
echo Starting testing dashboard on port 3001...
echo.

cd /d "%~dp0frontend"

if not exist "node_modules\" (
  echo Installing dependencies (first run only)...
  call npm install
  if errorlevel 1 (
    echo npm install failed. Fix errors above and try again.
    pause
    exit /b 1
  )
)

start "Resume Analyzer - Dev Server" cmd /k "set PORT=3001&& npm run dev"

echo Waiting for server to start...
timeout /t 10 /nobreak >nul

echo Opening browser...
start "" "http://localhost:3001/resume-analyzer"

cd /d "%~dp0"

echo.
echo ============================================
echo  Developer testing dashboard is running.
echo  URL: http://localhost:3001/resume-analyzer
echo  Keep the "Dev Server" window open while you test APIs.
echo ============================================
echo.
pause
