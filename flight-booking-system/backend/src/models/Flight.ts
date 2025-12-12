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
  bookingAttempts: Array<{ timestamp: Date; userId: string }>;
  createdAt: Date;
  updatedAt: Date;
}

const flightSchema = new Schema<IFlight>({
  flightId: { type: String, required: true, unique: true, index: true },
  airline: { type: String, required: [true, 'Airline is required'] },
  departureCity: { type: String, required: [true, 'Departure city is required'], index: true },
  arrivalCity: { type: String, required: [true, 'Arrival city is required'], index: true },
  basePrice: { type: Number, required: [true, 'Base price is required'], min: 2000, max: 3000 },
  currentPrice: { type: Number, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true, min: 0 },
  totalSeats: { type: Number, required: true, default: 180 },
  bookingAttempts: [ { timestamp: { type: Date, default: Date.now }, userId: String } ],
}, { timestamps: true });

flightSchema.index({ departureCity: 1, arrivalCity: 1 });

export default mongoose.model<IFlight>('Flight', flightSchema);
