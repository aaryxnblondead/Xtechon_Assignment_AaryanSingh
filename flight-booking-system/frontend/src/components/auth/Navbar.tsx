"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useWalletStore } from '@/store/wallet';
import { getWalletBalance } from '@/services/api';
import { IndianRupee, LogOut, Plane } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Login from './Login';
import Register from './Register';

export default function Navbar() {
  const { isAuthenticated, user, token, logout } = useAuthStore();
  const { balance, setBalance } = useWalletStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (isAuthenticated && token) {
      getWalletBalance(token)
        .then(setBalance)
        .catch(console.error);
    }
  }, [isAuthenticated, token, setBalance]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
  };

  return (
    <>
      <nav className="bg-white shadow-md p-4 flex justify-between items-center w-full mb-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <Plane />
          <span>FlightBook</span>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Welcome, {user?.name}</span>
                <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <IndianRupee size={16} />
                  <span className="font-bold">{balance.toLocaleString()}</span>
                </div>
              </div>
              <Link href="/history" className="text-blue-600 hover:underline">Booking History</Link>
              <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:underline">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Login / Register
            </button>
          )}
        </div>
      </nav>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
            <div className="flex justify-center mb-4 border-b">
              <button onClick={() => setAuthMode('login')} className={`px-4 py-2 ${authMode === 'login' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>Login</button>
              <button onClick={() => setAuthMode('register')} className={`px-4 py-2 ${authMode === 'register' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>Register</button>
            </div>
            {authMode === 'login' ? <Login onSuccess={() => setShowAuthModal(false)} /> : <Register onSuccess={() => setShowAuthModal(false)} />}
            <button onClick={() => setShowAuthModal(false)} className="mt-4 text-center w-full text-gray-500">Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
