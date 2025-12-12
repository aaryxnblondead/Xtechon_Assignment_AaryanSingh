"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '@/store/slices/authSlice';
import type { RootState, AppDispatch } from '@/store';

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token && typeof window !== 'undefined') {
      dispatch(fetchProfile()).catch(() => {
        // Token invalid, clear it
        localStorage.removeItem('token');
      });
    }
  }, [dispatch, token]);

  return null;
}
