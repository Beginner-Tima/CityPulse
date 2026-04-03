@echo off
echo ========================================
echo CityPulse AI - Quick Start
echo ========================================
echo.
echo Backend (API): http://localhost:5000
echo Frontend: dashboard.html
echo.
echo Opening Dashboard...
start http://localhost:5000/health
start "" "C:\Users\akzha\citypulse-backend\dashboard.html"
pause
