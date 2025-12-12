"use client";
import Link from 'next/link';
import PriceTag from './PriceTag';
import SurgeIndicator from './SurgeIndicator';
import { Flight } from '@/types';

export default function FlightCard({ flight }: { flight: Flight }) {
  const depart = new Date(flight.departureTime);
  const arrive = new Date(flight.arrivalTime);
  return (
    <div className="card p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-primary-600 text-white grid place-items-center font-semibold">{flight.airline?.[0] || 'F'}</div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-semibold text-lg">{flight.airline} • {flight.flightId}</div>
            <SurgeIndicator surged={!!flight.isSurged} />
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{(flight as any).class || 'Economy'} Class</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">Direct</span>
          </div>
          <div className="text-sm text-gray-600">{flight.departureCity} → {flight.arrivalCity}</div>
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-3">
            <span>{depart.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="h-px w-12 bg-gray-300" />
            <span>{flight.duration} mins</span>
            <span className="h-px w-12 bg-gray-300" />
            <span>{arrive.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="text-xs text-gray-400">Departs {depart.toLocaleDateString('en-IN')}</div>
        </div>
      </div>
      <div className="flex items-center gap-4 md:pl-6 md:border-l">
        <PriceTag base={flight.basePrice} current={flight.currentPrice} />
        <Link href={`/booking/${flight.flightId}`} className="btn-primary px-4 py-2.5">Select Flight</Link>
      </div>
    </div>
  );
}
