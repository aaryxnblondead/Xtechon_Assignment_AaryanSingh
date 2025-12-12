"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.getWalletBalance = exports.downloadTicket = exports.getBookingHistory = exports.bookFlight = void 0;
const bookingService_1 = require("../services/bookingService");
const flightService_1 = require("../services/flightService");
const User_1 = __importDefault(require("../models/User"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bookingService = new bookingService_1.BookingService();
const flightService = new flightService_1.FlightService();
const bookFlight = async (req, res) => {
    try {
        const { flightId, passengerName } = req.body;
        const userId = req.userId;
        // Validation
        if (!flightId || !passengerName) {
            return res.status(400).json({ error: 'Flight ID and passenger name are required' });
        }
        // Get flight details
        const flight = await flightService.getFlightById(flightId);
        // Validate seat availability
        if (flight.seatsAvailable <= 0) {
            return res.status(400).json({ error: 'No seats available for this flight' });
        }
        // Record booking attempt
        await flightService.recordBookingAttempt(flightId, userId);
        // Get user and check wallet
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Calculate dynamic price
        const finalPrice = await flightService.updateFlightPrice(flightId, userId);
        // Validate wallet balance
        if (user.walletBalance < finalPrice) {
            return res.status(400).json({
                error: 'Insufficient wallet balance',
                required: finalPrice,
                available: user.walletBalance,
                shortage: finalPrice - user.walletBalance,
            });
        }
        // Deduct from wallet
        user.walletBalance -= finalPrice;
        await user.save();
        // Decrement seats
        await flightService.decrementSeats(flightId);
        // Create booking
        const booking = await bookingService.createBooking({
            userId,
            flightId,
            passengerName,
            finalPrice,
            flightDetails: {
                airline: flight.airline,
                flightId: flight.flightId,
                departureCity: flight.departureCity,
                arrivalCity: flight.arrivalCity,
                departureTime: flight.departureTime,
            },
        });
        // Generate PDF
        const pdfDir = path_1.default.join(process.cwd(), 'public', 'tickets');
        const pdfPath = path_1.default.join(pdfDir, `${booking.pnr}.pdf`);
        try {
            await bookingService.generateTicketPDF(booking, pdfPath);
        }
        catch (pdfError) {
            console.error('PDF generation error:', pdfError);
            // Continue even if PDF fails - booking is still valid
        }
        res.status(201).json({
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
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.bookFlight = bookFlight;
const getBookingHistory = async (req, res) => {
    try {
        const bookings = await bookingService.getUserBookings(req.userId);
        res.json({
            count: bookings.length,
            bookings,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBookingHistory = getBookingHistory;
const downloadTicket = async (req, res) => {
    try {
        const { pnr } = req.params;
        const booking = await bookingService.getBookingByPNR(pnr);
        const pdfPath = path_1.default.join(process.cwd(), 'public', 'tickets', `${pnr}.pdf`);
        if (!fs_1.default.existsSync(pdfPath)) {
            // Regenerate if missing
            await bookingService.generateTicketPDF(booking, pdfPath);
        }
        res.download(pdfPath, `ticket-${pnr}.pdf`);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.downloadTicket = downloadTicket;
const getWalletBalance = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            walletBalance: user.walletBalance,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getWalletBalance = getWalletBalance;
const cancelBooking = async (req, res) => {
    try {
        const { pnr } = req.params;
        const userId = req.userId;
        const booking = await bookingService.cancelBooking(pnr, userId);
        // Refund and increment seats
        await flightService.incrementSeats(booking.flightId);
        res.json({
            message: 'Booking cancelled successfully',
            booking,
            refundAmount: booking.finalPrice,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.cancelBooking = cancelBooking;
//# sourceMappingURL=bookingController.js.map