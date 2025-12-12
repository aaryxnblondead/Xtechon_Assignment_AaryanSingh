"use client";

import { useState } from 'react';
import { searchFlights } from '@/services/api';
import { Flight } from '@/types';
import { Plane, ArrowRight, Calendar, Clock, IndianRupee } from 'lucide-react';
import BookingModal from '../booking/BookingModal';

export default function FlightSearch() {
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await searchFlights({ departureCity, arrivalCity });
      setFlights(results);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form
        onSubmit={handleSearch}
        className="bg-white p-6 rounded-xl shadow-lg mb-8 transform hover:scale-105 transition-transform duration-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <input
            type="text"
            value={departureCity}
            onChange={(e) => setDepartureCity(e.target.value)}
            placeholder="Departure City"
            className="p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <input
            type="text"
            value={arrivalCity}
            onChange={(e) => setArrivalCity(e.target.value)}
            placeholder="Arrival City"
            className="p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
          >
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {flights.map((flight) => (
          <div
            key={flight._id}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div className="flex-grow">
              <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                <Plane className="text-indigo-500" /> {flight.airline}{" "}
                <span className="text-gray-400 text-base font-medium">
                  ({flight.flightId})
                </span>
              </div>
              <div className="flex items-center gap-4 my-3 text-gray-700">
                <div className="text-center">
                  <p className="font-semibold text-lg">
                    {new Date(flight.departureTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {flight.departureCity}
                  </p>
                </div>
                <ArrowRight className="text-gray-300" />
                <div className="text-center">
                  <p className="font-semibold text-lg">
                    {new Date(flight.arrivalTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {flight.arrivalCity}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-3 mt-3">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />{" "}
                  {new Date(flight.departureTime).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} /> {flight.duration} mins
                </div>
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-2xl font-bold flex items-center justify-end text-gray-800">
                <IndianRupee size={22} />
                {flight.currentPrice.toLocaleString()}
              </p>
              <p className="text-sm text-red-500 font-medium">
                {flight.seatsAvailable} seats left
              </p>
              <button
                onClick={() => setSelectedFlight(flight)}
                className="mt-3 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedFlight && (
        <BookingModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
        />
      )}
    </div>
  );
}
