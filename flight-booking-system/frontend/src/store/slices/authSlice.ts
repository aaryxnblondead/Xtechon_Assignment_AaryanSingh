import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/services/api';

export const register = createAsyncThunk('auth/register', async (data: any) => {
  const response = await authAPI.register(data);
  return response.data;
});

export const login = createAsyncThunk('auth/login', async (data: any) => {
  const response = await authAPI.login(data);
  return response.data;
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async () => {
  const response = await authAPI.getProfile();
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as any,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    loading: false as boolean,
    error: null as any,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') localStorage.removeItem('token');
    },
    updateWallet(state, action) {
      if (state.user) {
        state.user.walletBalance = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') localStorage.setItem('token', action.payload.token);
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, updateWallet } = authSlice.actions;
export default authSlice.reducer;
