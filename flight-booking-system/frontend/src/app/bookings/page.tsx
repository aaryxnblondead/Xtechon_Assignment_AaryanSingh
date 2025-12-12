"use client";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadHistory, cancelBooking } from '@/store/slices/bookingSlice';
import type { RootState, AppDispatch } from '@/store';
import Link from 'next/link';
import { bookingAPI } from '@/services/api';
import type { Booking } from '@/types';

export default function BookingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { history, loadingHistory } = useSelector((s: RootState) => s.booking);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    dispatch(loadHistory());
  }, [dispatch]);

  const handleCancel = async (pnr: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(pnr);
    try {
      await dispatch(cancelBooking(pnr)).unwrap();
    } catch (err) {
      alert('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Bookings</h1>
        <Link href="/flights" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Book New Flight
        </Link>
      </div>

      {loadingHistory && <div className="text-center py-8 text-gray-500">Loading your bookings...</div>}
      
      {!loadingHistory && history.length === 0 && (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
          <Link href="/flights" className="text-blue-600 hover:underline font-medium">
            Search for flights →
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {history.map((b: Booking) => (
          <div key={b._id} className="bg-white p-5 rounded shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono font-semibold text-lg">{b.pnr}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    b.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {b.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="font-medium">
                    {b.flightDetails.airline} • {b.flightDetails.flightId}
                  </div>
                  <div className="text-sm text-gray-600">
                    {b.flightDetails.departureCity} → {b.flightDetails.arrivalCity}
                  </div>
                  <div className="text-sm text-gray-500">
                    Passenger: {b.passengerName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Departure: {new Date(b.flightDetails.departureTime).toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-gray-500">
                    Booked on: {new Date(b.bookingDate).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <div className="text-xs text-gray-600">Amount Paid</div>
                  <div className="text-xl font-bold">₹{b.finalPrice.toFixed(2)}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  {b.status === 'confirmed' && (
                    <>
                      <a 
                        href={bookingAPI.downloadTicket(b.pnr)} 
                        className="px-3 py-2 border rounded text-sm hover:bg-gray-50" 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📄 Download
                      </a>
                      <button 
                        onClick={() => handleCancel(b.pnr)} 
                        className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:bg-red-300"
                        disabled={cancelling === b.pnr}
                      >
                        {cancelling === b.pnr ? 'Cancelling...' : 'Cancel'}
                      </button>
                    </>
                  )}
                  {b.status === 'cancelled' && (
                    <div className="text-sm text-gray-500 italic">Booking cancelled</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
