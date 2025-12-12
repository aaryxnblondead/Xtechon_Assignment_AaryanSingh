"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { getBookingHistory } from '@/services/api';
import { Booking } from '@/types';
import { Plane, Calendar, IndianRupee, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingHistoryPage() {
  const { token, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      getBookingHistory(token)
        .then(setBookings)
        .catch(() => toast.error('Failed to fetch booking history.'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  if (loading) {
    return <div className="text-center">Loading booking history...</div>;
  }

  if (!isAuthenticated) {
    return <div className="text-center text-red-500">Please log in to view your booking history.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Plane className="text-blue-500" /> {booking.flightDetails.airline} <span className="text-gray-500 text-sm">({booking.flightDetails.flightId})</span>
                  </div>
                  <p className="text-gray-600">{booking.flightDetails.departureCity} to {booking.flightDetails.arrivalCity}</p>
                  <p className="text-sm text-gray-500">Passenger: {booking.passengerName}</p>
                  <p className={`text-sm font-bold ${booking.status === 'confirmed' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {booking.status.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">PNR: {booking.pnr}</p>
                  <div className="flex items-center gap-1 text-gray-600"><Calendar size={16} /> {new Date(booking.bookingDate).toLocaleDateString()}</div>
                  <div className="flex items-center gap-1 font-semibold"><IndianRupee size={16} /> {booking.finalPrice.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-end">
                <a
                  href={`http://localhost:5000${booking.ticketDownloadUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                >
                  <Download size={16} />
                  Re-download Ticket
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
