@echo off
cd /d "%~dp0ai-resume-system"
start "Claude Dashboard" cmd /k "npm run dev"
timeout /t 2 /nobreak > nul
cd /d "%~dp0frontend"
start "Resume Analyzer" cmd /k "set PORT=3001 && npm run dev"
timeout /t 8 /nobreak > nul
start "Open Dashboard" "http://localhost:3000/dashboard"
