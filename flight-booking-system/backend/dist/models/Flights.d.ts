import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IFlight, {}, {}, {}, mongoose.Document<unknown, {}, IFlight, {}, mongoose.DefaultSchemaOptions> & IFlight & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IFlight>;
export default _default;
//# sourceMappingURL=Flights.d.ts.map