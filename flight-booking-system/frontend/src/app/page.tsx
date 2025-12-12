"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/flights');
  }, [router]);

  return (
    <div className="text-center space-y-4 py-12">
      <h1 className="text-3xl font-bold">Welcome to Flight Booking</h1>
      <p className="text-gray-600">Redirecting to flights...</p>
      <div className="space-x-3">
        <Link href="/flights" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Search Flights
        </Link>
        <Link href="/login" className="px-4 py-2 border rounded hover:bg-gray-50">
          Login
        </Link>
      </div>
    </div>
  );
}
