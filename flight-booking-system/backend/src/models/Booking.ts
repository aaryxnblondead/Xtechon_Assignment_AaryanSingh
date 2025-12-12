import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: string;
  flightId: string;
  passengerName: string;
  pnr: string;
  finalPrice: number;
  bookingDate: Date;
  status: 'confirmed' | 'cancelled';
  pdfPath?: string;
  flightDetails: {
    airline: string;
    flightId: string;
    departureCity: string;
    arrivalCity: string;
    departureTime: Date;
  };
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    flightId: {
      type: String,
      required: true,
    },
    passengerName: {
      type: String,
      required: true,
    },
    pnr: {
      type: String,
      required: true,
      unique: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    pdfPath: String,
    flightDetails: {
      airline: String,
      flightId: String,
      departureCity: String,
      arrivalCity: String,
      departureTime: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
