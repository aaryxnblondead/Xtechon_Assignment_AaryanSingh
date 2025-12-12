"use client";
import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (params: any) => void }) {
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ departureCity, arrivalCity });
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-md shadow flex gap-3 items-end">
      <div className="flex-1">
        <label className="block text-sm mb-1">From</label>
        <input value={departureCity} onChange={(e) => setDepartureCity(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Mumbai" />
      </div>
      <div className="flex-1">
        <label className="block text-sm mb-1">To</label>
        <input value={arrivalCity} onChange={(e) => setArrivalCity(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Delhi" />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
    </form>
  );
}
