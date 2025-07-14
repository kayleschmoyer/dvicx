@echo off
echo Starting Digital Vehicle Inspection App...

start "Backend Server" cmd /k "cd backend && npm run dev"
start "Expo Dev Server" cmd /k "cd frontend && npx expo start"

echo Both servers are starting in separate windows.
pause