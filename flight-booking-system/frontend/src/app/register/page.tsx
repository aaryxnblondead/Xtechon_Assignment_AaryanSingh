"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { register } from '@/store/slices/authSlice';
import Link from 'next/link';
import type { AppDispatch } from '@/store';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await dispatch(register({ name, email, password })).unwrap();
      router.push('/flights');
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6">Create Account</h1>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full border rounded px-4 py-2" 
            placeholder="Full name" 
            required
          />
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full border rounded px-4 py-2" 
            placeholder="Email" 
            type="email"
            required
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full border rounded px-4 py-2" 
            placeholder="Password (min 6 characters)" 
            minLength={6}
            required
          />
          <button 
            className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700 disabled:bg-green-300"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
