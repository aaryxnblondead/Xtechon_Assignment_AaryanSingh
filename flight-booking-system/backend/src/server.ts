import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import flightRoutes from './routes/flights';
import bookingRoutes from './routes/bookings';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Server running', timestamp: new Date() });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`\n    🚀 Flight Booking Backend Started\n    ⚡ Port: ${PORT}\n    🌍 Frontend: ${process.env.FRONTEND_URL}\n    📊 Database: ${process.env.MONGODB_URI}\n  `);
});
