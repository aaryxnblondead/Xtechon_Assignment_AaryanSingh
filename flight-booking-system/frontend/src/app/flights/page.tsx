"use client";
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchFlights } from '@/store/slices/flightSlice';
import { RootState } from '@/store';
import SearchBar from '@/components/SearchBar';
import FlightCard from '@/components/FlightCard';
import type { AppDispatch } from '@/store';
import type { Flight } from '@/types';
import PriceRangeSlider from '@/components/PriceRangeSlider';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FlightsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((s: RootState) => s.flight);

  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'duration'>('price');
  const [filterAirline, setFilterAirline] = useState<string>('all');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [minSeats, setMinSeats] = useState<number>(0);
  const [priceBounds, setPriceBounds] = useState<[number, number]>([2000, 3000]);
  const [priceRange, setPriceRange] = useState<[number, number]>([2000, 3000]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    dispatch(searchFlights({ limit: 20 }));
  }, [dispatch]);

  const onSearch = (params: any) => {
    dispatch(searchFlights(params));
    setSearched(true);
  };

  // compute airline set from results
  const airlines = useMemo(() => {
    const set = new Set(items.map((f: Flight) => f.airline));
    return Array.from(set);
  }, [items]);

  // update price bounds from results
  useEffect(() => {
    if (!items.length) return;
    const prices = items.map((f: any) => f.currentPrice ?? f.basePrice ?? 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const newBounds: [number, number] = [Math.floor(min), Math.ceil(max)];
    setPriceBounds(newBounds);
    setPriceRange((prev) => {
      const isDefault = prev[0] === 2000 && prev[1] === 3000;
      return isDefault ? newBounds : prev;
    });
  }, [items]);

  const toggleAirline = (name: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const resetFilters = () => {
    setSortBy('price');
    setFilterAirline('all');
    setSelectedAirlines([]);
    setMinSeats(0);
    setPriceRange(priceBounds);
  };

  const filteredAndSorted = useMemo(() => {
    let filtered: Flight[] = [...items];
    if (filterAirline !== 'all') {
      filtered = filtered.filter((f) => f.airline === filterAirline);
    }
    if (selectedAirlines.length > 0) {
      filtered = filtered.filter((f) => selectedAirlines.includes(f.airline));
    }
    if (minSeats > 0) {
      filtered = filtered.filter((f) => f.seatsAvailable >= minSeats);
    }
    // price filter
    filtered = filtered.filter((f: any) => {
      const p = f.currentPrice ?? f.basePrice ?? 0;
      return p >= priceRange[0] && p <= priceRange[1];
    });

    filtered.sort((a: Flight, b: Flight) => {
      if (sortBy === 'price') return a.currentPrice - b.currentPrice;
      if (sortBy === 'departure')
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      if (sortBy === 'duration') return a.duration - b.duration;
      return 0;
    });
    return filtered;
  }, [items, sortBy, filterAirline, selectedAirlines, minSeats, priceRange]);

  return (
    <div className="space-y-5">
      <SearchBar onSearch={onSearch} />

      {/* Mobile Filters Button */}
      <div className="flex lg:hidden">
        <button onClick={() => setShowFilters(true)} className="btn-outline px-3 py-2 flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="card p-4 md:p-5 space-y-5">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="price">Price (Low to High)</option>
                <option value="departure">Departure Time</option>
                <option value="duration">Duration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Airline</label>
              <select value={filterAirline} onChange={(e) => setFilterAirline(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="all">All Airlines</option>
                {airlines.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {airlines.length > 0 && (
              <div>
                <div className="block text-xs text-gray-600 mb-1">Airlines</div>
                <div className="flex flex-wrap gap-2">
                  {airlines.map((a) => {
                    const active = selectedAirlines.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAirline(a)}
                        className={`px-3 py-1.5 rounded-full text-xs border ${active ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-600 mb-1">Min Seats</label>
              <input type="number" value={minSeats} onChange={(e) => setMinSeats(+e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" min={0} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs text-gray-600">Price Range</label>
                <span className="text-xs text-gray-500">₹{priceRange[0].toFixed(0)} - ₹{priceRange[1].toFixed(0)}</span>
              </div>
              <PriceRangeSlider
                min={priceBounds[0]}
                max={priceBounds[1]}
                value={priceRange}
                step={50}
                onChange={setPriceRange}
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button onClick={resetFilters} className="btn-outline px-3 py-2 w-full">Reset</button>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-8 xl:col-span-9 space-y-3">
          {loading && <div className="text-center py-8 text-gray-500">Loading flights...</div>}
          {!loading && filteredAndSorted.length === 0 && searched && <div className="text-center py-8 text-gray-500">No flights found.</div>}
          {filteredAndSorted.map((f: Flight) => (
            <FlightCard key={f.flightId} flight={f} />
          ))}
        </section>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-card p-5 space-y-5 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="h-9 w-9 grid place-items-center rounded-lg border">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="price">Price (Low to High)</option>
                  <option value="departure">Departure Time</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Airline</label>
                <select value={filterAirline} onChange={(e) => setFilterAirline(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="all">All Airlines</option>
                  {airlines.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              {airlines.length > 0 && (
                <div>
                  <div className="block text-xs text-gray-600 mb-1">Airlines</div>
                  <div className="flex flex-wrap gap-2">
                    {airlines.map((a) => {
                      const active = selectedAirlines.includes(a);
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => toggleAirline(a)}
                          className={`px-3 py-1.5 rounded-full text-xs border ${active ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min Seats</label>
                <input type="number" value={minSeats} onChange={(e) => setMinSeats(+e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" min={0} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs text-gray-600">Price Range</label>
                  <span className="text-xs text-gray-500">₹{priceRange[0].toFixed(0)} - ₹{priceRange[1].toFixed(0)}</span>
                </div>
                <PriceRangeSlider
                  min={priceBounds[0]}
                  max={priceBounds[1]}
                  value={priceRange}
                  step={50}
                  onChange={setPriceRange}
                />
              </div>
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button onClick={resetFilters} className="btn-outline px-3 py-2">Reset</button>
                <button onClick={() => setShowFilters(false)} className="btn-primary px-3 py-2">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
