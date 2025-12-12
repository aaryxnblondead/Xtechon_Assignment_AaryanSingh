"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { bookingAPI, flightAPI } from '@/services/api';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const flightId = params?.flightId as string;
  const [flight, setFlight] = useState<any>(null);
  const [surge, setSurge] = useState<any>(null);
  const [passengerName, setPassengerName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await flightAPI.getDetails(flightId);
        setFlight(res.data);
        try {
          const s = await flightAPI.checkSurge(flightId);
          setSurge(s.data);
        } catch {}
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Failed to load flight');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [flightId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await bookingAPI.book({ flightId, passengerName });
      setBooking(res.data.booking);
      router.push(`/confirmation/${res.data.booking.pnr}`);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to book');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!flight) return <div>Flight not found</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="font-semibold text-lg">{flight.airline} • {flight.flightId}</div>
        <div className="text-sm text-gray-600">{flight.departureCity} → {flight.arrivalCity}</div>
        <div className="text-xs text-gray-500">Departs {new Date(flight.departureTime).toLocaleString('en-IN')}</div>
        <div className="mt-2">
          <div>Base Price: ₹{flight.basePrice}</div>
          <div>Current Price: ₹{surge?.currentPrice ?? flight.currentPrice}</div>
          {surge?.isSurged && <div className="text-xs text-orange-600">Surge +{surge?.surgePercentage}% active</div>}
        </div>
      </div>

      <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold">Passenger Details</h2>
        <input value={passengerName} onChange={(e) => setPassengerName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Passenger Name" />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Confirm Booking</button>
      </form>
    </div>
  );
}
