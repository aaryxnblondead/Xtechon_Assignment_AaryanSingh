"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { bookingAPI } from '@/services/api';
import Link from 'next/link';

export default function ConfirmationPage() {
  const params = useParams();
  const pnr = params?.pnr as string;
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await bookingAPI.getByPNR(pnr);
        setBooking(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    if (pnr) load();
  }, [pnr]);

  if (loading) return <div className="text-center py-8 text-gray-500">Loading booking details...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!booking) return <div className="text-center py-8 text-gray-500">Booking not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-semibold text-green-800">Booking Confirmed!</h1>
        </div>
        <p className="text-green-700">Your flight has been successfully booked.</p>
      </div>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-3">Booking Details</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">PNR:</span>
              <div className="font-mono font-semibold text-lg">{booking.pnr}</div>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <div className="font-semibold text-green-600 capitalize">{booking.status}</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Flight Information</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Airline & Flight:</span>
              <span className="font-medium">{booking.flightDetails.airline} • {booking.flightDetails.flightId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span className="font-medium">{booking.flightDetails.departureCity} → {booking.flightDetails.arrivalCity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Departure:</span>
              <span className="font-medium">{new Date(booking.flightDetails.departureTime).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Passenger Information</h3>
          <div className="text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{booking.passengerName}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount Paid:</span>
            <span className="text-xl font-bold text-green-600">₹{booking.finalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <a 
          href={bookingAPI.downloadTicket(booking.pnr)} 
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded text-center hover:bg-blue-700 font-medium" 
          target="_blank"
          rel="noopener noreferrer"
        >
          📄 Download Ticket (PDF)
        </a>
        <Link 
          href="/bookings" 
          className="flex-1 px-4 py-3 border rounded text-center hover:bg-gray-50 font-medium"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
}
