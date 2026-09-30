@echo off
echo ========================================================
echo   Launching AI Customer Support Chatbot System...
echo ========================================================

echo [1/2] Starting Backend Server (Port 3000)...
start "AI Chatbot Backend (Port 3000)" cmd /k "cd /d %~dp0backend && npm run dev"

echo [2/2] Starting Frontend Vite Server (Port 5173)...
start "AI Chatbot Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers started!
echo Frontend will be ready at: http://localhost:5173
echo Backend will be ready at:  http://localhost:3000/api/health
echo ========================================================
pause
