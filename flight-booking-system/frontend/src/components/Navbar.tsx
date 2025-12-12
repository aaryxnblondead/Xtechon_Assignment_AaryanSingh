"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/store/slices/authSlice';
import type { RootState, AppDispatch } from '@/store';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const wallet = user?.walletBalance ?? 0;
  const name = user?.name ?? 'Guest';

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/80 bg-white/90 border-b shadow-soft">
      <div className="container-page h-16 flex items-center justify-between">
        <Link href="/flights" className="flex items-center gap-2 font-semibold text-lg">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">✈️</span>
          <span>FlyFast</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/flights" className="text-sm text-gray-700 hover:text-primary-700">Flights</Link>
          <Link href="/bookings" className="text-sm text-gray-700 hover:text-primary-700">My Bookings</Link>
          <div className="px-3 py-1 rounded-full bg-blue-50 text-primary-700 text-sm border border-blue-100">Wallet: ₹{wallet.toFixed(0)}</div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{name}</span>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-primary-700 hover:underline">Login</Link>
              <Link href="/register" className="text-sm text-primary-700 hover:underline">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
