@echo off
echo ========================================
echo CityPulse AI - Starting Servers
echo ========================================
echo.
echo Starting Backend on port 5000...
start "Backend" cmd /k "cd /d %~dp0 && node index.js"
echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend on port 3000...
start "Frontend" cmd /k "cd /d %~dp0 && npx serve -s . -l 3000"
echo.
echo ========================================
echo Servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000/dashboard.html
echo.
echo Press any key to exit this window...
pause >nul
