import axios from 'axios';
import { Flight } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const searchFlights = async (params: { departureCity?: string; arrivalCity?: string }): Promise<Flight[]> => {
  try {
    const response = await api.get('/flights/search', { params });
    return response.data.flights;
  } catch (error) {
    console.error('Failed to search flights:', error);
    throw error;
  }
};

export const getFlightDetails = async (flightId: string): Promise<Flight> => {
  try {
    const response = await api.get(`/flights/${flightId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get flight details:', error);
    throw error;
  }
};

export const bookFlight = async (flightId: string, passengerName: string, token: string) => {
  try {
    const response = await api.post(
      '/bookings/book',
      { flightId, passengerName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to book flight:', error);
    throw error;
  }
};

export const getBookingHistory = async (token: string) => {
  try {
    const response = await api.get('/bookings/history', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.bookings;
  } catch (error) {
    console.error('Failed to get booking history:', error);
    throw error;
  }
};

export const getWalletBalance = async (token: string) => {
  try {
    const response = await api.get('/bookings/wallet/balance', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.walletBalance;
  } catch (error) {
    console.error('Failed to get wallet balance:', error);
    throw error;
  }
};
