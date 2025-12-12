import { v4 as uuidv4 } from 'uuid';
import Booking from '../models/Booking';
import User from '../models/User';
import Flight from '../models/Flight';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class BookingService {
  async createBooking(data: {
    userId: string;
    flightId: string;
    passengerName: string;
    finalPrice: number;
    flightDetails: any;
  }) {
    try {
      const pnr = this.generatePNR();

      const booking = new Booking({
        userId: data.userId,
        flightId: data.flightId,
        passengerName: data.passengerName,
        pnr,
        finalPrice: data.finalPrice,
        flightDetails: data.flightDetails,
      });

      await booking.save();
      return booking;
    } catch (error) {
      throw new Error(`Failed to create booking: ${(error as Error).message}`);
    }
  }

  async generateTicketPDF(booking: any, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        
        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(outputPath);

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
        doc.text(
          `Route: ${booking.flightDetails.departureCity} → ${booking.flightDetails.arrivalCity}`,
          50
        );
        doc.text(
          `Departure: ${new Date(booking.flightDetails.departureTime).toLocaleString('en-IN')}`,
          50
        );

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
      } catch (error) {
        reject(error);
      }
    });
  }

  async getUserBookings(userId: string) {
    try {
      return await Booking.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Failed to fetch bookings: ${(error as Error).message}`);
    }
  }

  async getBookingByPNR(pnr: string) {
    try {
      const booking = await Booking.findOne({ pnr });
      if (!booking) {
        throw new Error('Booking not found');
      }
      return booking;
    } catch (error) {
      throw error;
    }
  }

  async cancelBooking(pnr: string, userId: string) {
    try {
      const booking = await Booking.findOne({ pnr, userId });
      if (!booking) {
        throw new Error('Booking not found');
      }

      booking.status = 'cancelled';
      await booking.save();

      // Refund wallet
      const user = await User.findById(userId);
      if (user) {
        user.walletBalance += booking.finalPrice;
        await user.save();
      }

      return booking;
    } catch (error) {
      throw error;
    }
  }

  private generatePNR(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pnr;
  }
}
