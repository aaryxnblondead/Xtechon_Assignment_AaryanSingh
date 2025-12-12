import Flight, { IFlight } from '../models/Flight';
import { SURGE_PRICING } from '../utils/constants';

export class PricingEngine {
  async calculateDynamicPrice(flight: IFlight, userId: string): Promise<number> {
    try {
      const cutoffTime = new Date(Date.now() - SURGE_PRICING.RESET_WINDOW);
      flight.bookingAttempts = flight.bookingAttempts.filter(
        (attempt) => new Date(attempt.timestamp) > cutoffTime
      );

      const recentAttempts = flight.bookingAttempts.filter((attempt) => {
        const isWithinWindow = new Date(attempt.timestamp) > new Date(Date.now() - SURGE_PRICING.WINDOW);
        const isSameUser = attempt.userId === userId;
        return isWithinWindow && isSameUser;
      });

      let price = flight.basePrice;

      if (recentAttempts.length >= SURGE_PRICING.THRESHOLD) {
        price = Math.round(flight.basePrice * (1 + SURGE_PRICING.INCREASE));
      }

      return price;
    } catch (error) {
      throw new Error(`Pricing calculation failed: ${(error as Error).message}`);
    }
  }

  async recordBookingAttempt(flightId: string, userId: string): Promise<void> {
    try {
      const flight = await Flight.findOne({ flightId });
      if (!flight) throw new Error('Flight not found');

      flight.bookingAttempts.push({ timestamp: new Date(), userId });
      await flight.save();
    } catch (error) {
      throw error;
    }
  }

  async getSurgePricingInfo(flight: IFlight, userId: string) {
    const dynamicPrice = await this.calculateDynamicPrice(flight, userId);
    const isSurged = dynamicPrice > flight.basePrice;
    const surgePercentage = isSurged ? Math.round(((dynamicPrice - flight.basePrice) / flight.basePrice) * 100) : 0;

    return {
      basePrice: flight.basePrice,
      currentPrice: dynamicPrice,
      isSurged,
      surgePercentage,
      surgeDuration: SURGE_PRICING.WINDOW / 60000,
    };
  }
}

export const pricingEngine = new PricingEngine();
