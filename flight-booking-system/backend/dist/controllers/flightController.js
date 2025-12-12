"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSurgePricing = exports.getFlightDetails = exports.searchFlights = void 0;
const flightService_1 = require("../services/flightService");
const flightService = new flightService_1.FlightService();
const searchFlights = async (req, res) => {
    try {
        const { departureCity, arrivalCity, limit } = req.query;
        const flights = await flightService.searchFlights({
            departureCity: departureCity,
            arrivalCity: arrivalCity,
            limit: limit ? parseInt(limit) : 10,
        });
        res.json({
            count: flights.length,
            flights,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.searchFlights = searchFlights;
const getFlightDetails = async (req, res) => {
    try {
        const { flightId } = req.params;
        const flight = await flightService.getFlightById(flightId);
        res.json(flight);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getFlightDetails = getFlightDetails;
const checkSurgePricing = async (req, res) => {
    try {
        const { flightId } = req.params;
        const flight = await flightService.getFlightById(flightId);
        const dynamicPrice = await flightService.calculateDynamicPrice(flight, req.userId);
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.checkSurgePricing = checkSurgePricing;
//# sourceMappingURL=flightController.js.map