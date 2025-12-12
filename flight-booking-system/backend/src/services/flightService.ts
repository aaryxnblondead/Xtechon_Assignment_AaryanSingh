import Flight, { IFlight } from '../models/Flight';

const SURGE_PRICING_THRESHOLD = 3;
const SURGE_PRICING_WINDOW = 5 * 60 * 1000; // 5 minutes
const SURGE_PRICE_INCREASE = 0.1; // 10%
const PRICE_RESET_WINDOW = 10 * 60 * 1000; // 10 minutes

export class FlightService {
  async searchFlights(params: {
    departureCity?: string;
    arrivalCity?: string;
    limit?: number;
  }) {
    try {
      const filter: any = {};

      if (params.departureCity) {
        filter.departureCity = new RegExp(params.departureCity, 'i');
      }
      if (params.arrivalCity) {
        filter.arrivalCity = new RegExp(params.arrivalCity, 'i');
      }

      const flights = await Flight.find(filter).limit(params.limit || 10);
      return flights;
    } catch (error) {
      throw new Error(`Failed to search flights: ${(error as Error).message}`);
    }
  }

  async getFlightById(flightId: string) {
    try {
      const flight = await Flight.findOne({ flightId });
      if (!flight) {
        throw new Error('Flight not found');
      }
      return flight;
    } catch (error) {
      throw error;
    }
  }

  async calculateDynamicPrice(flight: IFlight, userId: string): Promise<number> {
    try {
      // Clean old booking attempts outside PRICE_RESET_WINDOW
      const cutoffTime = new Date(Date.now() - PRICE_RESET_WINDOW);
      flight.bookingAttempts = flight.bookingAttempts.filter(
        (attempt) => new Date(attempt.timestamp) > cutoffTime
      );

      // Count attempts in surge pricing window for this user
      const recentAttempts = flight.bookingAttempts.filter((attempt) => {
        const isWithinWindow = new Date(attempt.timestamp) > new Date(Date.now() - SURGE_PRICING_WINDOW);
        const isSameUser = attempt.userId === userId;
        return isWithinWindow && isSameUser;
      });

      let price = flight.basePrice;

      if (recentAttempts.length >= SURGE_PRICING_THRESHOLD) {
        price = Math.round(flight.basePrice * (1 + SURGE_PRICE_INCREASE));
      }

      return price;
    } catch (error) {
      throw new Error(`Failed to calculate dynamic price: ${(error as Error).message}`);
    }
  }

  async recordBookingAttempt(flightId: string, userId: string) {
    try {
      const flight = await Flight.findOne({ flightId });
      if (!flight) throw new Error('Flight not found');

      flight.bookingAttempts.push({
        timestamp: new Date(),
        userId,
      });

      await flight.save();
    } catch (error) {
      throw error;
    }
  }

  async updateFlightPrice(flightId: string, userId: string) {
    try {
      const flight = await Flight.findOne({ flightId });
      if (!flight) throw new Error('Flight not found');

      const dynamicPrice = await this.calculateDynamicPrice(flight, userId);
      flight.currentPrice = dynamicPrice;

      await flight.save();
      return dynamicPrice;
    } catch (error) {
      throw error;
    }
  }

  async decrementSeats(flightId: string) {
    try {
      const flight = await Flight.findOne({ flightId });
      if (!flight) throw new Error('Flight not found');
      if (flight.seatsAvailable <= 0) throw new Error('No seats available');

      flight.seatsAvailable -= 1;
      await flight.save();
      return flight.seatsAvailable;
    } catch (error) {
      throw error;
    }
  }

  async incrementSeats(flightId: string) {
    try {
      const flight = await Flight.findOne({ flightId });
      if (!flight) throw new Error('Flight not found');

      if (flight.seatsAvailable < flight.totalSeats) {
        flight.seatsAvailable += 1;
      }
      await flight.save();
      return flight.seatsAvailable;
    } catch (error) {
      throw error;
    }
  }
}
