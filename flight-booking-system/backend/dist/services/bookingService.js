"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const User_1 = __importDefault(require("../models/User"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class BookingService {
    async createBooking(data) {
        try {
            const pnr = this.generatePNR();
            const booking = new Booking_1.default({
                userId: data.userId,
                flightId: data.flightId,
                passengerName: data.passengerName,
                pnr,
                finalPrice: data.finalPrice,
                flightDetails: data.flightDetails,
            });
            await booking.save();
            return booking;
        }
        catch (error) {
            throw new Error(`Failed to create booking: ${error.message}`);
        }
    }
    async generateTicketPDF(booking, outputPath) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
                // Ensure directory exists
                const dir = path_1.default.dirname(outputPath);
                if (!fs_1.default.existsSync(dir)) {
                    fs_1.default.mkdirSync(dir, { recursive: true });
                }
                const stream = fs_1.default.createWriteStream(outputPath);
                doc.on('error', reject);
                stream.on('error', reject);
                doc.pipe(stream);
                // Header
                doc.fontSize(24).font('Helvetica-Bold').text('FLIGHT TICKET', { align: 'center' });
                doc.moveDown(0.3);
                doc.fontSize(10).text('_'.repeat(80), { align: 'center' });
                // Booking Details Section
                doc.moveDown(0.8);
                doc.fontSize(12).font('Helvetica-Bold').text('BOOKING DETAILS', 50);
                doc.moveDown(0.3);
                doc.fontSize(10).font('Helvetica');
                doc.text(`PNR: ${booking.pnr}`, 50);
                doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleString('en-IN')}`, 50);
                doc.text(`Status: ${booking.status.toUpperCase()}`, 50);
                // Passenger Info Section
                doc.moveDown(0.8);
                doc.fontSize(12).font('Helvetica-Bold').text('PASSENGER INFORMATION', 50);
                doc.moveDown(0.3);
                doc.fontSize(10).font('Helvetica');
                doc.text(`Name: ${booking.passengerName}`, 50);
                // Flight Details Section
                doc.moveDown(0.8);
                doc.fontSize(12).font('Helvetica-Bold').text('FLIGHT INFORMATION', 50);
                doc.moveDown(0.3);
                doc.fontSize(10).font('Helvetica');
                doc.text(`Airline: ${booking.flightDetails.airline}`, 50);
                doc.text(`Flight ID: ${booking.flightDetails.flightId}`, 50);
                doc.text(`Route: ${booking.flightDetails.departureCity} → ${booking.flightDetails.arrivalCity}`, 50);
                doc.text(`Departure: ${new Date(booking.flightDetails.departureTime).toLocaleString('en-IN')}`, 50);
                // Price Details Section
                doc.moveDown(0.8);
                doc.fontSize(12).font('Helvetica-Bold').text('PRICE DETAILS', 50);
                doc.moveDown(0.3);
                doc.fontSize(11).font('Helvetica-Bold');
                doc.text(`Final Price: ₹${booking.finalPrice}`, 50);
                // Footer
                doc.moveDown(2);
                doc.fontSize(9).font('Helvetica').text('Thank you for booking with Flight Booking System!', {
                    align: 'center',
                });
                doc.text('Please keep this ticket safe for your reference.', { align: 'center' });
                doc.end();
                stream.on('finish', () => resolve(outputPath));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async getUserBookings(userId) {
        try {
            return await Booking_1.default.find({ userId }).sort({ createdAt: -1 });
        }
        catch (error) {
            throw new Error(`Failed to fetch bookings: ${error.message}`);
        }
    }
    async getBookingByPNR(pnr) {
        try {
            const booking = await Booking_1.default.findOne({ pnr });
            if (!booking) {
                throw new Error('Booking not found');
            }
            return booking;
        }
        catch (error) {
            throw error;
        }
    }
    async cancelBooking(pnr, userId) {
        try {
            const booking = await Booking_1.default.findOne({ pnr, userId });
            if (!booking) {
                throw new Error('Booking not found');
            }
            booking.status = 'cancelled';
            await booking.save();
            // Refund wallet
            const user = await User_1.default.findById(userId);
            if (user) {
                user.walletBalance += booking.finalPrice;
                await user.save();
            }
            return booking;
        }
        catch (error) {
            throw error;
        }
    }
    generatePNR() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let pnr = '';
        for (let i = 0; i < 6; i++) {
            pnr += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pnr;
    }
}
exports.BookingService = BookingService;
//# sourceMappingURL=bookingService.js.map