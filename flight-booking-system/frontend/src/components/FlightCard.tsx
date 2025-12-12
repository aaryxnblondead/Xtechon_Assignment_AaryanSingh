"use client";
import Link from 'next/link';
import PriceTag from './PriceTag';
import SurgeIndicator from './SurgeIndicator';
import { Flight } from '@/types';

export default function FlightCard({ flight }: { flight: Flight }) {
  return (
    <div className="bg-white p-4 rounded-md shadow flex items-center justify-between">
      <div>
        <div className="font-semibold">{flight.airline} • {flight.flightId} <SurgeIndicator surged={!!flight.isSurged} /></div>
        <div className="text-sm text-gray-600">
          {flight.departureCity} → {flight.arrivalCity}
        </div>
        <div className="text-xs text-gray-500">
          Departs {new Date(flight.departureTime).toLocaleString('en-IN')} • {flight.duration} mins
        </div>
      </div>
      <div className="flex items-center gap-4">
        <PriceTag base={flight.basePrice} current={flight.currentPrice} />
        <Link href={`/booking/${flight.flightId}`} className="px-3 py-2 bg-green-600 text-white rounded">View/Book</Link>
      </div>
    </div>
  );
}
