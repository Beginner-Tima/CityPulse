@echo off
echo ========================================
echo CityPulse AI - Dashboard Launcher
echo ========================================
echo.
echo Starting HTTP Server...
echo.
python -m http.server 8080 --directory "C:\Users\akzha\citypulse-backend"
pause
