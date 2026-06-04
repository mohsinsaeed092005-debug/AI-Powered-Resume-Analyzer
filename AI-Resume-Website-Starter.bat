@echo off
REM AI Resume Website Starter
REM This file starts the AI Resume System and opens it in the browser

setlocal enabledelayedexpansion

echo.
echo ============================================
echo  AI RESUME WEBSITE STARTER
echo ============================================
echo.
echo Starting AI Resume System...
echo.

REM Change to ai-resume-system directory
cd /d "M:\AI-Powered-Resume-Analyzer\ai-resume-system"

REM Start npm dev in a new window
start "AI Resume System - Dev Server" cmd /k "npm run dev"

REM Wait for server to start (8 seconds)
echo Waiting for server to start...
timeout /t 8 /nobreak

REM Open the browser to the resume page
echo Opening AI Resume System in browser...
start "" "http://localhost:3003/resume"

REM Return to original directory
cd /d "M:\AI-Powered-Resume-Analyzer"

echo.
echo ============================================
echo  AI Resume System is now running!
echo  Browser opened at: http://localhost:3003/resume
echo ============================================
echo.
pause
