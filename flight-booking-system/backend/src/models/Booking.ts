import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: string;
  flightId: string;
  passengerName: string;
  pnr: string;
  finalPrice: number;
  bookingDate: Date;
  status: 'confirmed' | 'cancelled';
  flightDetails: {
    airline: string;
    flightId: string;
    departureCity: string;
    arrivalCity: string;
    departureTime: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  userId: { type: String, required: true, index: true },
  flightId: { type: String, required: true },
  passengerName: { type: String, required: true, trim: true },
  pnr: { type: String, required: true, unique: true, index: true },
  finalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  flightDetails: { airline: String, flightId: String, departureCity: String, arrivalCity: String, departureTime: Date },
}, { timestamps: true });

bookingSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
