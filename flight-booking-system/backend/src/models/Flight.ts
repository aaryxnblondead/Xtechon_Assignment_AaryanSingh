import mongoose, { Schema, Document } from 'mongoose';

export interface IFlight extends Document {
  flightId: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  basePrice: number;
  currentPrice: number;
  departureTime: Date;
  arrivalTime: Date;
  duration: number;
  seatsAvailable: number;
  totalSeats: number;
  bookingAttempts: Array<{
    timestamp: Date;
    userId: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const flightSchema = new Schema<IFlight>(
  {
    flightId: {
      type: String,
      required: true,
      unique: true,
    },
    airline: {
      type: String,
      required: [true, 'Airline is required'],
    },
    departureCity: {
      type: String,
      required: [true, 'Departure city is required'],
    },
    arrivalCity: {
      type: String,
      required: [true, 'Arrival city is required'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: 2000,
      max: 3000,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    duration: Number,
    seatsAvailable: {
      type: Number,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 180,
    },
    bookingAttempts: [
      {
        timestamp: { type: Date, default: Date.now },
        userId: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IFlight>('Flight', flightSchema);
