"use client";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchFlights } from '@/store/slices/flightSlice';
import { RootState } from '@/store';
import SearchBar from '@/components/SearchBar';
import FlightCard from '@/components/FlightCard';

export default function FlightsPage() {
  const dispatch = useDispatch<any>();
  const { items, loading } = useSelector((s: RootState) => s.flights);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // initial fetch (optional)
    dispatch(searchFlights({ limit: 10 }));
  }, [dispatch]);

  const onSearch = (params: any) => {
    dispatch(searchFlights(params));
    setSearched(true);
  };

  return (
    <div className="space-y-4">
      <SearchBar onSearch={onSearch} />
      {loading && <div>Loading flights...</div>}
      {!loading && items.length === 0 && searched && <div>No flights found.</div>}
      <div className="space-y-3">
        {items.map((f: any) => (
          <FlightCard key={f.flightId} flight={f} />
        ))}
      </div>
    </div>
  );
}
