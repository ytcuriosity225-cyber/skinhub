@echo off
REM azzivone-dev.bat: Start all Azzivone services (Frontend, Backend, AI Engine)

REM Start AI Engine (Python FastAPI)
echo Starting AI Engine (FastAPI) on port 8000...
cd ai_engine
call ..\.venv\Scripts\activate
start cmd /k "uvicorn main:app --reload --host 127.0.0.1 --port 8000"
cd ..

REM Start Backend (Node.js)
echo Starting Backend (Node.js) on port 5000...
cd backend
call npm install
start cmd /k "node server.js"
cd ..

REM Start Frontend (Next.js)
echo Starting Frontend (Next.js) on port 3000...
call npm install
start cmd /k "npm run dev"
