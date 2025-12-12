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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
        <div className="mb-4">
          <p><strong>Flight:</strong> {flight.airline} ({flight.flightId})</p>
          <p><strong>Route:</strong> {flight.departureCity} to {flight.arrivalCity}</p>
          <p><strong>Price:</strong> ₹{flight.currentPrice.toLocaleString()}</p>
          <p><strong>Your Balance:</strong> ₹{balance.toLocaleString()}</p>
        </div>
        <input
          type="text"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
          placeholder="Passenger Name"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-600">Cancel</button>
          <button onClick={handleBooking} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300">
            {loading ? 'Booking...' : 'Confirm & Book'}
          </button>
        </div>
      </div>
    </div>
  );
}
