import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class PDFGenerator {
  async generateTicketPDF(booking: any, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 40 });

        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(outputPath);
        doc.on('error', reject);
        stream.on('error', reject);
        doc.pipe(stream);

        doc.fillColor('#1f2937').rect(0, 0, doc.page.width, 60).fill();
        doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold');
        doc.text('✈️  FLIGHT TICKET', 40, 15);
        doc.fillColor('#000000');

        doc.fontSize(11).font('Helvetica-Bold').text('PNR: ' + booking.pnr, 40, 80);
        doc.fontSize(10).font('Helvetica').text('Booking ID: ' + booking._id, 40, 100);
        doc.fontSize(10).text('Status: ' + booking.status.toUpperCase(), 40, 115);
        doc.moveTo(40, 135).lineTo(doc.page.width - 40, 135).stroke();

        doc.fontSize(12).font('Helvetica-Bold').text('PASSENGER DETAILS', 40, 155);
        doc.fontSize(10).font('Helvetica').text('Name: ' + booking.passengerName, 40, 180);

        doc.fontSize(12).font('Helvetica-Bold').text('FLIGHT INFORMATION', 40, 220);
        doc.fontSize(10).font('Helvetica');
        doc.text('Airline: ' + booking.flightDetails.airline, 40, 245);
        doc.text('Flight: ' + booking.flightDetails.flightId, 40, 265);
        const departCity = booking.flightDetails.departureCity;
        const arriveCity = booking.flightDetails.arrivalCity;
        doc.text('Route: ' + departCity + ' → ' + arriveCity, 40, 285);
        const depTime = new Date(booking.flightDetails.departureTime);
        doc.text('Departure: ' + depTime.toLocaleString('en-IN'), 40, 305);

        doc.moveTo(40, 330).lineTo(doc.page.width - 40, 330).stroke();

        doc.fontSize(12).font('Helvetica-Bold').text('PAYMENT DETAILS', 40, 350);
        doc.fontSize(11).font('Helvetica');
        doc.text('Final Price: ₹' + booking.finalPrice, 40, 375);
        doc.text('Booking Date: ' + new Date(booking.bookingDate).toLocaleString('en-IN'), 40, 395);

        doc.fontSize(9).font('Helvetica').fillColor('#666666');
        doc.text('Thank you for booking with Flight Booking System!', 40, doc.page.height - 80, { align: 'center' });
        doc.text('Please keep this ticket safe for your reference.', 40, doc.page.height - 60, { align: 'center' });
        doc.text('For support, contact: support@flightbooking.com', 40, doc.page.height - 40, { align: 'center' });

        doc.end();
        stream.on('finish', () => resolve(outputPath));
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const pdfGenerator = new PDFGenerator();
