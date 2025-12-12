# XTechon – Flight Booking System (Full‑Stack Assignment)

Production‑ready, end‑to‑end flight booking application implementing database‑driven search, dynamic pricing, wallet payments, PDF ticketing, booking history, and authentication.

## Overview
- Backend: Node.js, Express, TypeScript, MongoDB (Mongoose)
- Frontend: Next.js (App Router), React, TailwindCSS, Redux Toolkit
- Features: DB‑backed search, surge pricing, wallet, PDF tickets, bookings history, JWT auth
- Docker: `docker-compose` (MongoDB + Backend + Frontend)

## Project Structure
```
flight-booking-system/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/database.ts
│   │   ├── models/{User,Flight,Booking}.ts
│   │   ├── services/{pricingEngine,pdfGenerator}.ts
│   │   ├── controllers/{authController,flightController,bookingController}.ts
│   │   ├── routes/{auth,flights,bookings}.ts
│   │   ├── middleware/{auth,validation,errorHandler}.ts
│   │   ├── utils/{constants,logger}.ts
│   │   └── seeds/flightSeeder.ts
│   ├── package.json, tsconfig.json, .env.example, Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/{layout.tsx,page.tsx}
│   │   ├── app/{login,register,flights,booking/[flightId],bookings,confirmation/[pnr]}/page.tsx
│   │   ├── components/{Navbar,SearchBar,FlightCard,PriceTag,SurgeIndicator}.tsx
│   │   ├── store/{index.ts} and slices/{authSlice,flightSlice,bookingSlice}.ts
│   │   └── services/api.ts, types/
│   ├── package.json, next.config.js, tailwind.config.ts, .env.local
├── docker-compose.yml
└── README.md (this file)
```

## Requirements Coverage
1) Flight Search Module (Database Required)
- Seeds 18 flights into MongoDB via `backend/src/seeds/flightSeeder.ts`.
- Each flight includes `flightId`, `airline`, `departureCity`, `arrivalCity`, `basePrice` (₹2000–₹3000) and more.
- API returns 10 flights by default from the database. Sorting supported: price, duration, departure time.

2) Dynamic Pricing Engine
- Rule: If the same user attempts booking the same flight 3 times within 5 minutes, increase price by 10%.
- Price resets to `basePrice` after 10 minutes.
- Implemented in `src/services/pricingEngine.ts` and consumed in booking flow and surge info endpoint.

3) Wallet System
- Default wallet balance: ₹50,000.
- Deducts final price on successful booking; responds with helpful error if insufficient balance.

4) Ticket PDF Generation
- Generates PDF after each successful booking. Includes:
  - Passenger name, Airline & Flight ID, Route (Departure → Arrival)
  - Final price paid, Booking date/time, Unique PNR
- File path: `backend/public/tickets/<PNR>.pdf` (auto‑regenerated if missing).

5) Booking History Page
- Frontend page `/bookings` displays all user bookings with details, amount paid, dates, PNR, and a download button.

Bonus Enhancements Included
- Sorting & filtering flights (by query params).
- Surge indicator on UI when price > base.
- Responsive UI using TailwindCSS.
- JWT authentication (login/register/profile).
- Dockerized setup.

## Tech Stack
- Frontend: Next.js 14, React 18, TailwindCSS, Redux Toolkit, Axios
- Backend: Node.js, Express, TypeScript, Mongoose, Zod, PDFKit, jsonwebtoken, bcryptjs
- Database: MongoDB

## Prerequisites
- Node.js 18+
- MongoDB (local) or Docker Desktop
- Windows PowerShell or a Unix‑like shell

## Environment Variables
Backend (`backend/.env`; copy from `.env.example`):
```
MONGODB_URI=mongodb://localhost:27017/flight-booking
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```
Frontend (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Local Setup (Windows PowerShell)
Install dependencies:
```
cd "./flight-booking-system/backend"
npm install
cd "../frontend"
npm install
```
Seed flights:
```
cd "../backend"
npm run seed
```
Run backend and frontend (two terminals):
```
# Terminal 1
cd "./flight-booking-system/backend"
npm run build
npm run dev

# Terminal 2
cd "./flight-booking-system/frontend"
npm run dev
```
Open: http://localhost:3000

## Docker Setup
Start all services (MongoDB + Backend + Frontend):
```
cd "./flight-booking-system"
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Key Endpoints (Backend)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`
- Flights: `GET /api/flights/search?departureCity=&arrivalCity=&limit=&sort=price|duration|departure`
- Flight details: `GET /api/flights/:flightId`
- Surge info: `GET /api/flights/:flightId/surge-pricing` (auth)
- Bookings: `POST /api/bookings/book` (auth), `GET /api/bookings/history` (auth),
  `GET /api/bookings/:pnr`, `GET /api/bookings/:pnr/download-ticket`, `POST /api/bookings/:pnr/cancel` (auth)

## App Flow
1) Register/Login → JWT stored in localStorage
2) Search flights → Results pulled from MongoDB (10 by default)
3) View flight → See surge and price
4) Book flight → Wallet charged, seat decremented, PDF generated
5) Confirmation → Download ticket or go to Bookings
6) Bookings page → History, download, or cancel booking

## Implementation Notes
- Surge pricing counters are stored per flight with timestamps; pricing recalculated per user attempt.
- Wallet balance is persisted on the user document and returned in responses where relevant.
- PDFs are generated with PDFKit and saved to `backend/public/tickets`.
- Input validation uses Zod; errors are unified via a central error handler.

## Submission Checklist
- GitHub repository (this project)
- README with setup and run instructions (this file)
- Optional: short demo video, live deployment link

## Evaluation Criteria Mapping
- Code quality & structure: TypeScript, layered architecture, clear modules
- UI/UX: Tailwind layouts, responsive pages, simple flows
- Database: MongoDB with Mongoose models and indexes
- Dynamic pricing: Implemented with windows and reset logic
- Wallet & validations: Enforced during booking and cancellation
- PDF generation: Implemented with robust ticket details
- Error handling: Centralized and validation‑aware
- README clarity: This document

## Troubleshooting
- If `npm install` fails with a version error, ensure Node 18+, clear cache, and reinstall:
```
npm cache clean --force
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
```
- If PDFs are missing, the download route will regenerate automatically.
- On case‑sensitive systems (Docker/Linux), ensure imports match file casing (e.g., `models/User`).

---
Build something exceptional. ✈️
