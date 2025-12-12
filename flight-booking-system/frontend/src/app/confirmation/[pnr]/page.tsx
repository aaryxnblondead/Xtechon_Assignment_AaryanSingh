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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await bookingAPI.getByPNR(pnr);
        setBooking(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Failed to load booking');
      }
    };
    if (pnr) load();
  }, [pnr]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!booking) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Booking Confirmed</h1>
      <div className="bg-white p-4 rounded shadow">
        <div className="font-semibold">PNR: {booking.pnr}</div>
        <div className="text-sm text-gray-600">{booking.flightDetails.airline} • {booking.flightDetails.flightId}</div>
        <div className="text-sm">Passenger: {booking.passengerName}</div>
        <div className="text-sm">Amount: ₹{booking.finalPrice}</div>
        <div className="text-sm">Departure: {new Date(booking.flightDetails.departureTime).toLocaleString('en-IN')}</div>
      </div>
      <div className="flex gap-3">
        <a href={bookingAPI.downloadTicket(booking.pnr)} className="px-4 py-2 bg-blue-600 text-white rounded" target="_blank">Download Ticket</a>
        <Link href="/bookings" className="px-4 py-2 border rounded">View My Bookings</Link>
      </div>
    </div>
  );
}
