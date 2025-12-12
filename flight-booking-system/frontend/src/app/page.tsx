import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Flight Booking</h1>
      <p className="text-gray-600">Search, book, and manage your flights.</p>
      <div className="space-x-3">
        <Link href="/flights" className="px-4 py-2 bg-blue-600 text-white rounded">Search Flights</Link>
        <Link href="/login" className="px-4 py-2 border rounded">Login</Link>
      </div>
    </div>
  );
}
