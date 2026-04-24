#!/bin/bash
# azzivone-dev.sh: Start all Azzivone services (Frontend, Backend, AI Engine)

# Start AI Engine (Python FastAPI)
echo "Starting AI Engine (FastAPI) on port 8000..."
cd ai_engine && source ../.venv/Scripts/activate && uvicorn main:app --reload --host 127.0.0.1 --port 8000 &
cd ..

# Start Backend (Node.js)
echo "Starting Backend (Node.js) on port 5000..."
cd backend && npm install && node server.js &
cd ..

# Start Frontend (Next.js)
echo "Starting Frontend (Next.js) on port 3000..."
npm install && npm run dev
