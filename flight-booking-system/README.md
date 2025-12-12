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
# Flight Booking System

This repository contains a full-stack flight booking system with authentication, dynamic surge pricing, wallet-based payments, booking PDF tickets, and a modern Next.js frontend.

## Features
- Authentication: register, login, and profile.
- Flights: search, filter, sort, and surge indicator.
- Dynamic Pricing: surge +10% after repeated attempts; auto-reset.
- Wallet: default ₹50,000; deductions and refunds.
- Bookings: PNR generation, PDF tickets, history, and cancellation.
- Docker Compose: optional local stack with MongoDB.

## Tech Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Redux Toolkit.
- Backend: Node.js, Express, TypeScript, Mongoose.
- Database: MongoDB.
- PDF: pdfkit.
- Logging: winston.

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or Docker)
- Windows/macOS/Linux

## Setup & Run (Local)

1) Backend
```bash
cd flight-booking-system/backend
npm install
Copy-Item .env.example .env   # Windows PowerShell (use: cp .env.example .env on macOS/Linux)
npm run build
npm run dev
```
- Default: http://localhost:5000

2) Frontend
```bash
cd ../frontend
npm install
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
npm run dev
```
- Default: http://localhost:3000

## Environment Variables

Backend (`backend/.env`):
- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/flight_booking`
- `JWT_SECRET=your-secret-key`
- `JWT_EXPIRE=7d`

Frontend (`frontend/.env.local`):
- `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

## Docker Compose (Optional)
```bash
cd flight-booking-system
docker-compose up --build
```
- Starts MongoDB, backend, and frontend containers. Adjust env values in `docker-compose.yml` as needed.

## Dynamic Pricing Rules
- If a user attempts to book the same flight 3 times within 5 minutes, the price increases by 10%.
- After 10 minutes, the price resets to its original `basePrice`.
- Implementation: `backend/src/services/pricingEngine.ts`; constants in `backend/src/utils/constants.ts`.
- Persistence: Reset applied when fetching flight details or surge info.

## API Endpoints

Auth (`/api/auth`):
- `POST /register` → `{ token, user }`
- `POST /login` → `{ token, user }`
- `GET /profile` (Bearer) → `user`

Flights (`/api/flights`):
- `GET /search?departureCity=&arrivalCity=&limit=&sort=`
- `GET /:flightId`
- `GET /:flightId/surge-pricing` (Bearer)

Bookings (`/api/bookings`):
- `POST /book` (Bearer) → creates booking, deducts wallet, returns `booking` + `updatedWalletBalance`
- `GET /history` (Bearer)
- `GET /wallet/balance` (Bearer)
- `GET /:pnr`
- `GET /:pnr/download-ticket` → PDF ticket
- `POST /:pnr/cancel` (Bearer)

## Frontend Pages
- `/login` and `/register`: Auth flows; auto-redirect to `/flights` on success.
- `/flights`: Search, filters (airline, seats), sort (price/departure/duration), surge indicator.
- `/booking/[flightId]`: Details, cost breakdown, wallet validation, confirm booking.
- `/confirmation/[pnr]`: Booking summary, PNR, PDF download link.
- `/bookings`: History list, download, cancel.
- Navbar: Wallet pill, links, user menu.

## Seeding Flights
```bash
cd flight-booking-system/backend
npm run seed:flights
```
- Ensure MongoDB is running and `MONGODB_URI` is correct.

## Troubleshooting
- Backend exits (code 1):
	- Ensure `backend/.env` exists and `MONGODB_URI` is reachable.
	- Start MongoDB (local install or Docker).
	- Run `npm run build` then `npm run dev` to surface compile errors.
- Frontend cannot reach API:
	- Verify `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.
	- Confirm backend is running and accessible.

## Quick Demo Steps
1. Register and login (wallet defaults to ₹50,000).
2. Search flights, open a flight detail page.
3. Attempt booking the same flight 3 times within 5 minutes → see 10% surge.
4. After 10 minutes, fetch details/surge → price resets to base.
5. Confirm booking → wallet deducts; view confirmation and download PDF.
6. Cancel booking → wallet refunds and status updates.

## Scripts

Backend:
```bash
npm run build
npm run dev
npm run seed:flights
```

Frontend:
```bash
npm run dev
npm run build
npm start
```

## Notes
- Wallet default: ₹50,000 (see `backend/src/models/user.ts`).
- For production, set strong JWT secrets and secure environment variables.
