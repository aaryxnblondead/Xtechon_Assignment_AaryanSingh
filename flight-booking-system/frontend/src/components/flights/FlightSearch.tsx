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
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={departureCity}
            onChange={(e) => setDepartureCity(e.target.value)}
            placeholder="Departure City"
            className="p-2 border rounded"
          />
          <input
            type="text"
            value={arrivalCity}
            onChange={(e) => setArrivalCity(e.target.value)}
            placeholder="Arrival City"
            className="p-2 border rounded"
          />
          <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300">
            {loading ? 'Searching...' : 'Search Flights'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {flights.map((flight) => (
          <div key={flight._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Plane className="text-blue-500" /> {flight.airline} <span className="text-gray-500 text-sm">({flight.flightId})</span>
              </div>
              <div className="flex items-center gap-4 my-2">
                <div className="text-center">
                  <p className="font-bold">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-sm text-gray-600">{flight.departureCity}</p>
                </div>
                <ArrowRight className="text-gray-400" />
                <div className="text-center">
                  <p className="font-bold">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-sm text-gray-600">{flight.arrivalCity}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1"><Calendar size={16} /> {new Date(flight.departureTime).toLocaleDateString()}</div>
                <div className="flex items-center gap-1"><Clock size={16} /> {flight.duration} mins</div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold flex items-center"><IndianRupee size={20} />{flight.currentPrice.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{flight.seatsAvailable} seats left</p>
              <button onClick={() => setSelectedFlight(flight)} className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
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
