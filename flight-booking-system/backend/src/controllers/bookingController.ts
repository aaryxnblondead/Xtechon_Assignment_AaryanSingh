import { Request, Response } from 'express';
import Booking from '../models/Booking';
import User from '../models/user';
import Flight from '../models/Flight';
import { pricingEngine } from '../services/pricingEngine';
import { pdfGenerator } from '../services/pdfGenerator';
import { HTTP_STATUS } from '../utils/constants';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger';

const generatePNR = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  return pnr;
};

export const bookFlight = async (req: Request, res: Response) => {
  try {
    const { flightId, passengerName } = req.body;
    const userId = req.userId!;

    const flight = await Flight.findOne({ flightId });
    if (!flight) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Flight not found' });
    if (flight.seatsAvailable <= 0) return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'No seats available' });

    await pricingEngine.recordBookingAttempt(flightId, userId);

    const user = await User.findById(userId);
    if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });

    const finalPrice = await pricingEngine.calculateDynamicPrice(flight, userId);
    flight.currentPrice = finalPrice;
    await flight.save();

    if (user.walletBalance < finalPrice) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Insufficient wallet balance',
        required: finalPrice,
        available: user.walletBalance,
        shortage: finalPrice - user.walletBalance,
      });
    }

    user.walletBalance -= finalPrice;
    await user.save();

    flight.seatsAvailable -= 1;
    await flight.save();

    const pnr = generatePNR();
    const booking = new Booking({
      userId,
      flightId,
      passengerName,
      pnr,
      finalPrice,
      flightDetails: {
        airline: flight.airline,
        flightId: flight.flightId,
        departureCity: flight.departureCity,
        arrivalCity: flight.arrivalCity,
        departureTime: flight.departureTime,
      },
    });
    await booking.save();

    const pdfDir = path.join(process.cwd(), 'public', 'tickets');
    const pdfPath = path.join(pdfDir, `${pnr}.pdf`);

    try {
      await pdfGenerator.generateTicketPDF(booking, pdfPath);
      logger.info(`📄 PDF ticket generated: ${pnr}`);
    } catch (pdfError) {
      logger.error('PDF generation error (non-blocking):', pdfError);
    }

    logger.info(`✅ Booking confirmed: ${pnr}`);

    res.status(HTTP_STATUS.CREATED).json({
      message: 'Booking successful',
      booking: {
        _id: booking._id,
        pnr: booking.pnr,
        passengerName: booking.passengerName,
        finalPrice: booking.finalPrice,
        bookingDate: booking.bookingDate,
        status: booking.status,
        flightDetails: booking.flightDetails,
        ticketDownloadUrl: `/api/bookings/${booking.pnr}/download-ticket`,
      },
      updatedWalletBalance: user.walletBalance,
    });
  } catch (error) {
    logger.error('Booking error:', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: (error as Error).message });
  }
};

export const getBookingHistory = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.userId! }).sort({ createdAt: -1 });
    res.json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: (error as Error).message });
  }
};

export const getBookingByPNR = async (req: Request, res: Response) => {
  try {
    const { pnr } = req.params;
    const booking = await Booking.findOne({ pnr });
    if (!booking) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: (error as Error).message });
  }
};

export const downloadTicket = async (req: Request, res: Response) => {
  try {
    const { pnr } = req.params;
    const booking = await Booking.findOne({ pnr });
    if (!booking) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Booking not found' });

    const pdfPath = path.join(process.cwd(), 'public', 'tickets', `${pnr}.pdf`);
    if (!fs.existsSync(pdfPath)) {
      await pdfGenerator.generateTicketPDF(booking, pdfPath);
    }
    res.download(pdfPath, `ticket-${pnr}.pdf`);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: (error as Error).message });
  }
};

export const getWalletBalance = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId!);
    if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
    res.json({ walletBalance: user.walletBalance });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: (error as Error).message });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { pnr } = req.params;
    const userId = req.userId!;

    const booking = await Booking.findOne({ pnr, userId });
    if (!booking) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Booking already cancelled' });

    booking.status = 'cancelled';
    await booking.save();

    const user = await User.findById(userId);
    if (user) {
      user.walletBalance += booking.finalPrice;
      await user.save();
    }

    const flight = await Flight.findOne({ flightId: booking.flightId });
    if (flight && flight.seatsAvailable < flight.totalSeats) {
      flight.seatsAvailable += 1;
      await flight.save();
    }

    logger.info(`✅ Booking cancelled: ${pnr}`);
    res.json({ message: 'Booking cancelled successfully', booking, refundAmount: booking.finalPrice });
  } catch (error) {
    logger.error('Cancellation error:', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: (error as Error).message });
  }
};
