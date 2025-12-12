import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const flightAPI = {
  search: (params: any) => api.get('/flights/search', { params }),
  getDetails: (flightId: string) => api.get(`/flights/${flightId}`),
  checkSurge: (flightId: string) => api.get(`/flights/${flightId}/surge-pricing`),
};

export const bookingAPI = {
  book: (data: any) => api.post('/bookings/book', data),
  getHistory: () => api.get('/bookings/history'),
  getWallet: () => api.get('/bookings/wallet/balance'),
  getByPNR: (pnr: string) => api.get(`/bookings/${pnr}`),
  downloadTicket: (pnr: string) => `${API_URL}/bookings/${pnr}/download-ticket`,
  cancel: (pnr: string) => api.post(`/bookings/${pnr}/cancel`),
};

export default api;
