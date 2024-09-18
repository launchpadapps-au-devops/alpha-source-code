import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPolicy, postPolicy } from './privacyPolicyAPI'; // Import API functions

// Async thunk for fetching policy
export const getPolicyThunk = createAsyncThunk(
  'policy/getPolicy',
  async (type: string, thunkAPI) => {
    try {
      const response = await fetchPolicy(type);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating policy
export const postPolicyThunk = createAsyncThunk(
  'policy/postPolicy',
  async (policy: { type: string; content: { heading: string; body: string }[] }, thunkAPI) => {
    try {
      const response = await postPolicy(policy);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Define the state interface
interface PolicyState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PolicyState = {
  data: null,
  loading: false,
  error: null,
};

// Create the slice
const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle GET policy thunk
    builder.addCase(getPolicyThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPolicyThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getPolicyThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle POST policy thunk
    builder.addCase(postPolicyThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(postPolicyThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(postPolicyThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default policySlice.reducer;
