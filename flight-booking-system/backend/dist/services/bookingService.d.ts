export declare class BookingService {
    createBooking(data: {
        userId: string;
        flightId: string;
        passengerName: string;
        finalPrice: number;
        flightDetails: any;
    }): Promise<import("mongoose").Document<unknown, {}, import("../models/Booking").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Booking").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    generateTicketPDF(booking: any, outputPath: string): Promise<string>;
    getUserBookings(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/Booking").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Booking").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getBookingByPNR(pnr: string): Promise<import("mongoose").Document<unknown, {}, import("../models/Booking").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Booking").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    cancelBooking(pnr: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../models/Booking").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Booking").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private generatePNR;
}
//# sourceMappingURL=bookingService.d.ts.map