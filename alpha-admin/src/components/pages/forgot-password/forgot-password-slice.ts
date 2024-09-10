// forgot-password-slice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { requestOTP, verifyOTP, updatePassword } from './forgot-password-API';

// Initial state
interface PasswordResetState {
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  isVerified: boolean;
  message: string;
  accessToken: string | null; // Add accessToken to the state
}

const initialState: PasswordResetState = {
  loading: false,
  error: null,
  otpSent: false,
  isVerified: false,
  message: '',
  accessToken: null, // Initialize accessToken as null
};

// Thunks
export const sendOTPThunk = createAsyncThunk(
  'passwordReset/sendOTP',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await requestOTP(email);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

export const verifyOTPThunk = createAsyncThunk(
  'passwordReset/verifyOTP',
  async ({ email, otp }: { email: string; otp: number }, { rejectWithValue }) => {
    try {
      const response = await verifyOTP(email, otp);
      return response.data; // Return the entire data, including the accessToken
    } catch (error: any) {
      return rejectWithValue(error.message || 'OTP verification failed');
    }
  }
);

export const updatePasswordThunk = createAsyncThunk(
    'passwordReset/updatePassword',
    async ({ password, accessToken }: { password: string; accessToken: string }, { rejectWithValue }) => {
      try {
        const response = await updatePassword(password, accessToken);
        return response.message;
      } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to update password');
      }
    }
  );

// Slice
const passwordResetSlice = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.otpSent = false;
      state.isVerified = false;
      state.message = '';
      state.accessToken = null; // Reset accessToken
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTPThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTPThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.message = action.payload;
      })
      .addCase(sendOTPThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOTPThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTPThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isVerified = true;
        state.message = 'Login successful';
        state.accessToken = action.payload.accessToken; // Store accessToken in state
      })
      .addCase(verifyOTPThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(updatePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState } = passwordResetSlice.actions;
export default passwordResetSlice.reducer;
