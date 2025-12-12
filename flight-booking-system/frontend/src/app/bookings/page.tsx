"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadHistory, cancelBooking } from '@/store/slices/bookingSlice';
import { RootState } from '@/store';
import Link from 'next/link';
import { bookingAPI } from '@/services/api';

export default function BookingsPage() {
  const dispatch = useDispatch<any>();
  const { history, loadingHistory } = useSelector((s: RootState) => s.booking);

  useEffect(() => {
    dispatch(loadHistory());
  }, [dispatch]);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">My Bookings</h1>
      {loadingHistory && <div>Loading...</div>}
      {history.map((b: any) => (
        <div key={b._id} className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <div className="font-semibold">PNR: {b.pnr} • {b.flightDetails.airline} ({b.flightDetails.flightId})</div>
            <div className="text-sm text-gray-600">{b.flightDetails.departureCity} → {b.flightDetails.arrivalCity}</div>
            <div className="text-xs text-gray-500">Departure: {new Date(b.flightDetails.departureTime).toLocaleString('en-IN')}</div>
            <div className="text-xs">Status: {b.status}</div>
          </div>
          <div className="flex items-center gap-2">
            <a href={bookingAPI.downloadTicket(b.pnr)} className="px-3 py-2 border rounded" target="_blank">Download Ticket</a>
            {b.status === 'confirmed' && (
              <button onClick={() => dispatch(cancelBooking(b.pnr))} className="px-3 py-2 bg-red-600 text-white rounded">Cancel</button>
            )}
          </div>
        </div>
      ))}
      {history.length === 0 && !loadingHistory && (
        <div className="text-gray-600">No bookings yet. <Link href="/flights" className="underline">Find flights</Link></div>
      )}
    </div>
  );
}
