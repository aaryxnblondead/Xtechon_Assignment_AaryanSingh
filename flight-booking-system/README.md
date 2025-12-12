# Flight Booking System

Production-ready full-stack implementation for XTechon assignment.

## Structure
- `backend/` Node.js + TypeScript + MongoDB
- `frontend/` Next.js + React + TailwindCSS
- `docker-compose.yml` services for Mongo, Backend, Frontend

## Quick Start (Windows PowerShell)

```powershell
# From repo root
cd .\flight-booking-system\backend; npm install; cd ..\..
cd .\flight-booking-system\frontend; npm install; cd ..\..

# Seed database
cd .\flight-booking-system\backend; npm run seed; cd ..\..

# Start services (requires Docker Desktop)
docker-compose up --build
```

Backend API: `http://localhost:5000/api`
Frontend: `http://localhost:3000`

## Environment
- Backend `.env` (copy from `.env.example`)
- Frontend `.env.local` contains `NEXT_PUBLIC_API_URL`

## Features
- Surge pricing, wallet, PDF tickets
- JWT auth, bookings history
- TypeScript, validation, error handling
