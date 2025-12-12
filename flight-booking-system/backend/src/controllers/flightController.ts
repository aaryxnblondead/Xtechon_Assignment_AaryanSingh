import { Request, Response } from 'express';
import { FlightService } from '../services/flightService';

const flightService = new FlightService();

export const searchFlights = async (req: Request, res: Response) => {
  try {
    const { departureCity, arrivalCity, limit } = req.query;

    const flights = await flightService.searchFlights({
      departureCity: departureCity as string,
      arrivalCity: arrivalCity as string,
      limit: limit ? parseInt(limit as string) : 10,
    });

    res.json({
      count: flights.length,
      flights,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getFlightDetails = async (req: Request, res: Response) => {
  try {
    const { flightId } = req.params;
    const flight = await flightService.getFlightById(flightId);

    res.json(flight);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const checkSurgePricing = async (req: Request, res: Response) => {
  try {
    const { flightId } = req.params;
    const flight = await flightService.getFlightById(flightId);

    const dynamicPrice = await flightService.calculateDynamicPrice(flight, req.userId!);
    const isSurged = dynamicPrice > flight.basePrice;
    const surgePercentage = isSurged ? Math.round(((dynamicPrice - flight.basePrice) / flight.basePrice) * 100) : 0;

    res.json({
      flightId,
      basePrice: flight.basePrice,
      currentPrice: dynamicPrice,
      isSurged,
      surgePercentage,
      message: isSurged ? `Price surged by ${surgePercentage}% due to high demand` : 'No surge pricing',
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
