@echo off
REM One-click: start AI Resume System and open http://localhost:3003/resume

setlocal enabledelayedexpansion

echo.
echo ============================================
echo  AI RESUME WEBSITE STARTER
echo ============================================
echo.
echo Starting AI Resume System on port 3003...
echo.

cd /d "%~dp0ai-resume-system"

if not exist "node_modules\" (
  echo Installing dependencies (first run only)...
  call npm install
  if errorlevel 1 (
    echo npm install failed. Fix errors above and try again.
    pause
    exit /b 1
  )
)

start "AI Resume System - Dev Server" cmd /k "set PORT=3003&& npm run dev"

echo Waiting for server to start...
timeout /t 10 /nobreak >nul

echo Opening browser...
start "" "http://localhost:3003/resume"

cd /d "%~dp0"

echo.
echo ============================================
echo  AI Resume System is running.
echo  URL: http://localhost:3003/resume
echo  Keep the "Dev Server" window open while you use the app.
echo ============================================
echo.
pause
