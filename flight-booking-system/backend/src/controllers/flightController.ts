import { Request, Response } from 'express';
import Flight from '../models/Flight';
import { pricingEngine } from '../services/pricingEngine';
import { HTTP_STATUS } from '../utils/constants';

export const searchFlights = async (req: Request, res: Response) => {
  try {
    const { departureCity, arrivalCity, limit = 10, sort = 'price' } = req.query;
    const filter: any = {};
    if (departureCity) filter.departureCity = new RegExp(departureCity as string, 'i');
    if (arrivalCity) filter.arrivalCity = new RegExp(arrivalCity as string, 'i');

    const pageLimit = Math.min(parseInt(limit as string) || 10, 100);
    let query = Flight.find(filter).limit(pageLimit);
    if (sort === 'price') query = query.sort({ currentPrice: 1 });
    else if (sort === 'duration') query = query.sort({ duration: 1 });
    else if (sort === 'departure') query = query.sort({ departureTime: 1 });

    let flights = await query;

    if (flights.length < pageLimit) {
      const excludeIds = flights.map((f) => f._id);
      let fillerQuery = Flight.find({ _id: { $nin: excludeIds } }).limit(pageLimit - flights.length);
      if (sort === 'price') fillerQuery = fillerQuery.sort({ currentPrice: 1 });
      else if (sort === 'duration') fillerQuery = fillerQuery.sort({ duration: 1 });
      else if (sort === 'departure') fillerQuery = fillerQuery.sort({ departureTime: 1 });
      const filler = await fillerQuery;
      flights = [...flights, ...filler];
    }

    res.json({
      count: flights.length,
      flights: flights.map((f) => ({ ...f.toObject(), isSurged: f.currentPrice > f.basePrice })),
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: (error as Error).message });
  }
};

export const getFlightDetails = async (req: Request, res: Response) => {
  try {
    const { flightId } = req.params;
    const flight = await Flight.findOne({ flightId });
    if (!flight) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Flight not found' });
    // Reset price to base if surge window has elapsed
    try {
      const dynamicPrice = await pricingEngine.calculateDynamicPrice(flight, req.userId || '');
      if (dynamicPrice === flight.basePrice && flight.currentPrice !== flight.basePrice) {
        flight.currentPrice = flight.basePrice;
        await flight.save();
      }
    } catch {}
    res.json({ ...flight.toObject(), isSurged: flight.currentPrice > flight.basePrice });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: (error as Error).message });
  }
};

export const checkSurgePricing = async (req: Request, res: Response) => {
  try {
    const { flightId } = req.params;
    const userId = req.userId!;
    const flight = await Flight.findOne({ flightId });
    if (!flight) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Flight not found' });
    const surgePricingInfo = await pricingEngine.getSurgePricingInfo(flight, userId);
    // Persist reset to base if not surged
    if (!surgePricingInfo.isSurged && flight.currentPrice !== flight.basePrice) {
      flight.currentPrice = flight.basePrice;
      await flight.save();
    }
    res.json({ flightId, ...surgePricingInfo });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: (error as Error).message });
  }
};
