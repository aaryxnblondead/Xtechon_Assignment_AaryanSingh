"use client";
import { useState } from 'react';
import { ArrowsRightLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar({ onSearch }: { onSearch: (params: any) => void }) {
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');

  const swap = () => {
    const d = departureCity; setDepartureCity(arrivalCity); setArrivalCity(d);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ departureCity, arrivalCity });
  };

  return (
    <form onSubmit={submit} className="card p-4 md:p-5">
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-200">
            <span className="text-gray-400">CGK</span>
            <input value={departureCity} onChange={(e) => setDepartureCity(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Mumbai" />
          </div>
        </div>

        <button type="button" onClick={swap} className="self-center md:self-end h-10 w-10 rounded-lg border bg-white hover:bg-gray-50 grid place-items-center">
          <ArrowsRightLeftIcon className="h-5 w-5 text-gray-600" />
        </button>

        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-200">
            <span className="text-gray-400">ZRH</span>
            <input value={arrivalCity} onChange={(e) => setArrivalCity(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Delhi" />
          </div>
        </div>

        <button type="submit" className="btn-primary px-5 py-2.5 flex items-center justify-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5" />
          Search Flights
        </button>
      </div>
    </form>
  );
}
