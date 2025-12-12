import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, mongoose.DefaultSchemaOptions> & IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IBooking>;
export default _default;
//# sourceMappingURL=Booking.d.ts.map