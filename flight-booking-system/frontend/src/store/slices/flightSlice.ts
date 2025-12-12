import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { flightAPI } from '@/services/api';

export const searchFlights = createAsyncThunk('flights/search', async (params: any) => {
  const res = await flightAPI.search(params);
  return res.data;
});

const flightSlice = createSlice({
  name: 'flights',
  initialState: {
    items: [] as any[],
    loading: false,
    error: null as any,
    lastQuery: {} as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.flights || [];
      })
      .addCase(searchFlights.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch flights';
      });
  },
});

export default flightSlice.reducer;
