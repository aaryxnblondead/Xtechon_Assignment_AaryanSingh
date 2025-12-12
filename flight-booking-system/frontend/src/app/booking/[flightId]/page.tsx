"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { bookingAPI, flightAPI } from '@/services/api';
import { createBooking } from '@/store/slices/bookingSlice';
import type { RootState, AppDispatch } from '@/store';
import SurgeIndicator from '@/components/SurgeIndicator';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const flightId = params?.flightId as string;
  const wallet = useSelector((state: RootState) => state.auth.user?.walletBalance ?? 0);
  
  const [flight, setFlight] = useState<any>(null);
  const [surge, setSurge] = useState<any>(null);
  const [passengerName, setPassengerName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const finalPrice = surge?.currentPrice ?? flight?.currentPrice ?? 0;
  const walletSufficient = wallet >= finalPrice;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!walletSufficient) {
      setError('Insufficient wallet balance');
      return;
    }
    setSubmitting(true);
    try {
      const result = await dispatch(createBooking({ flightId, passengerName })).unwrap();
      router.push(`/confirmation/${result.booking.pnr}`);
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || 'Booking failed');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading flight details...</div>;
  if (error && !flight) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!flight) return <div className="text-center py-8 text-gray-500">Flight not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold text-xl flex items-center gap-2">
              {flight.airline} • {flight.flightId}
              {surge?.isSurged && <SurgeIndicator surged={true} />}
            </div>
            <div className="text-gray-600 mt-1">{flight.departureCity} → {flight.arrivalCity}</div>
            <div className="text-sm text-gray-500 mt-1">
              Departs: {new Date(flight.departureTime).toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-gray-500">
              Arrives: {new Date(flight.arrivalTime).toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-gray-500">Duration: {flight.duration} mins</div>
            <div className="text-sm text-gray-500">Seats Available: {flight.seatsAvailable}/{flight.totalSeats}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <h3 className="font-semibold mb-2">Cost Breakdown</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price:</span>
              <span>₹{flight.basePrice.toFixed(2)}</span>
            </div>
            {surge?.isSurged && (
              <div className="flex justify-between text-orange-600">
                <span>Surge ({surge.surgePercentage}%):</span>
                <span>+₹{(finalPrice - flight.basePrice).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>₹{finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="font-semibold text-lg">Passenger Details</h2>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Full Name</label>
          <input 
            value={passengerName} 
            onChange={(e) => setPassengerName(e.target.value)} 
            className="w-full border rounded px-3 py-2" 
            placeholder="Enter passenger name" 
            required
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Your Wallet Balance:</span>
            <span className={`font-semibold ${walletSufficient ? 'text-green-600' : 'text-red-600'}`}>
              ₹{wallet.toFixed(2)}
            </span>
          </div>
          {!walletSufficient && (
            <div className="text-red-600 text-sm mt-2">
              Insufficient balance. Please add ₹{(finalPrice - wallet).toFixed(2)} to your wallet.
            </div>
          )}
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded">{error}</div>}
        
        <button 
          className="w-full bg-green-600 text-white rounded py-3 hover:bg-green-700 disabled:bg-gray-400 font-semibold"
          disabled={!walletSufficient || submitting}
        >
          {submitting ? 'Processing...' : `Confirm Booking - ₹${finalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
