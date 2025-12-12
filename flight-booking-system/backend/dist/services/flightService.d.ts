import { IFlight } from '../models/Flight';
export declare class FlightService {
    searchFlights(params: {
        departureCity?: string;
        arrivalCity?: string;
        limit?: number;
    }): Promise<(import("mongoose").Document<unknown, {}, IFlight, {}, import("mongoose").DefaultSchemaOptions> & IFlight & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getFlightById(flightId: string): Promise<import("mongoose").Document<unknown, {}, IFlight, {}, import("mongoose").DefaultSchemaOptions> & IFlight & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    calculateDynamicPrice(flight: IFlight, userId: string): Promise<number>;
    recordBookingAttempt(flightId: string, userId: string): Promise<void>;
    updateFlightPrice(flightId: string, userId: string): Promise<number>;
    decrementSeats(flightId: string): Promise<number>;
    incrementSeats(flightId: string): Promise<number>;
}
//# sourceMappingURL=flightService.d.ts.map