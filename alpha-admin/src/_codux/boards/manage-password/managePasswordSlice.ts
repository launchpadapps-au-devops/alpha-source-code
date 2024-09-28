import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { matchPassword } from './managePasswordAPI';

// Async Thunk to handle the POST request
export const matchUserPassword = createAsyncThunk(
  'auth/matchPassword',
  async ({ email, password }: { email: any; password: string }, thunkAPI) => {
    try {
      const response = await matchPassword(email, password);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

interface PasswordMatchState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: PasswordMatchState = {
  loading: false,
  success: false,
  error: null,
};

const passwordMatchSlice = createSlice({
  name: 'passwordMatch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(matchUserPassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(matchUserPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(matchUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export default passwordMatchSlice.reducer;
