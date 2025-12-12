'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/store/slices/authSlice';
import flightReducer from '@/store/slices/flightSlice';
import bookingReducer from '@/store/slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flight: flightReducer,
    booking: bookingReducer,
  },
  middleware: (getDefault) => getDefault(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}