import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingAPI } from '@/services/api';
import { updateWallet } from './authSlice';

export const createBooking = createAsyncThunk('booking/create', async (data: any, { dispatch }) => {
  const res = await bookingAPI.book(data);
  try {
    const w = await bookingAPI.getWallet();
    if (w.data?.walletBalance !== undefined) {
      dispatch(updateWallet(w.data.walletBalance));
    }
  } catch {}
  return res.data;
});

export const loadHistory = createAsyncThunk('booking/history', async () => {
  const res = await bookingAPI.getHistory();
  return res.data;
});

export const cancelBooking = createAsyncThunk('booking/cancel', async (pnr: string, { dispatch }) => {
  const res = await bookingAPI.cancel(pnr);
  try {
    const w = await bookingAPI.getWallet();
    if (w.data?.walletBalance !== undefined) {
      dispatch(updateWallet(w.data.walletBalance));
    }
  } catch {}
  return res.data;
});

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    creating: false,
    lastBooking: null as any,
    history: [] as any[],
    loadingHistory: false,
    error: null as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.creating = false;
        state.lastBooking = action.payload.booking;
      })
      .addCase(createBooking.rejected, (state, action: any) => {
        state.creating = false;
        state.error = action.error?.message || 'Failed to book flight';
      })
      .addCase(loadHistory.pending, (state) => {
        state.loadingHistory = true;
      })
      .addCase(loadHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.history = action.payload.bookings || [];
      })
      .addCase(loadHistory.rejected, (state) => {
        state.loadingHistory = false;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const pnr = action.meta.arg;
        state.history = state.history.map((b) => (b.pnr === pnr ? { ...b, status: 'cancelled' } : b));
      });
  },
});

export default bookingSlice.reducer;
