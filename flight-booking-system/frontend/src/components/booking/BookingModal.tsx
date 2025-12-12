"use client";

import { useState } from 'react';
import { Flight } from '@/types';
import { useWalletStore } from '@/store/wallet';
import { useAuthStore } from '@/store/auth';
import { bookFlight } from '@/services/api';
import toast from 'react-hot-toast';

interface BookingModalProps {
  flight: Flight;
  onClose: () => void;
}

export default function BookingModal({ flight, onClose }: BookingModalProps) {
  const { balance, deduct } = useWalletStore();
  const [passengerName, setPassengerName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!passengerName) {
      toast.error('Please enter passenger name.');
      return;
    }

    if (balance < flight.currentPrice) {
      toast.error(
        `Insufficient wallet balance. Required: ₹${flight.currentPrice}, Available: ₹${balance}`,
        { duration: 5000 }
      );
      return;
    }

    setLoading(true);
    try {
      const token = useAuthStore.getState().token; 
      if (!token) {
        toast.error('You must be logged in to book a flight.');
        setLoading(false);
        return;
      }

      const bookingDetails = await bookFlight(flight._id, passengerName, token);
      deduct(flight.currentPrice);
      toast.success(`Booking successful! PNR: ${bookingDetails.booking.pnr}`);
      
      // Trigger PDF download
      window.open(`http://localhost:5000${bookingDetails.booking.ticketDownloadUrl}`);

      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Booking failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Confirm Booking
        </h2>
        <div className="mb-6 space-y-3 text-gray-700">
          <p>
            <strong>Flight:</strong> {flight.airline} ({flight.flightId})
          </p>
          <p>
            <strong>Route:</strong> {flight.departureCity} to{" "}
            {flight.arrivalCity}
          </p>
          <p className="text-xl font-semibold">
            <strong>Price:</strong> ₹{flight.currentPrice.toLocaleString()}
          </p>
          <p
            className={`font-medium ${
              balance < flight.currentPrice ? "text-red-500" : "text-green-600"
            }`}
          >
            <strong>Your Balance:</strong> ₹{balance.toLocaleString()}
          </p>
        </div>
        <input
          type="text"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
          placeholder="Passenger Name"
          className="w-full p-3 border-2 border-gray-200 rounded-lg mb-6 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-gray-700 font-medium px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
          >
            {loading ? "Booking..." : "Confirm & Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
