"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') setToken(localStorage.getItem('token'));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    router.push('/login');
  };

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/flights" className="font-semibold text-lg">✈️ Flight Booking</Link>
        <div className="flex items-center gap-4">
          <Link href="/flights" className="text-sm hover:underline">Flights</Link>
          <Link href="/bookings" className="text-sm hover:underline">My Bookings</Link>
          {token ? (
            <button onClick={logout} className="text-sm text-red-600">Logout</button>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:underline">Login</Link>
              <Link href="/register" className="text-sm hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
