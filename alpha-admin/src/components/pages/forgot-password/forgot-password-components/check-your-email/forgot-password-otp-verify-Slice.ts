import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { forgotPasswordOtpVerify } from './forgot-password-otp-verify-API';

// Define the ForgotPasswordUser interface based on actual API response
export interface ForgotPasswordUser {
    email: string;
    accessToken: string;
    // Remove or mark these fields as optional if they are not present in the API response
    accessTokenExpiresAt?: string;
    // refreshToken?: string;
    // refreshTokenExpiresAt?: string;
    // role?: {
    //     id: number;
    //     name: string;
    //     description: string;
    //     createdAt: string;
    //     updatedAt: string;
    // };
}

// Define the state interface
export interface ForgotAuthState {
    isForgotPassword: boolean;
    user: ForgotPasswordUser | null;
    loading: boolean;
    error: string | null;
    message: string | null; // Store success or error messages
}

// Initial state
const initialState: ForgotAuthState = {
    isForgotPassword: false,
    user: null,
    loading: false,
    error: null,
    message: null,
};

// Define the request interface
interface ForgotPasswordRequest {
    email: string;
    otp: number;
}

// Async thunk to handle OTP verification
export const forgotPasswordOtpVerifyThunk = createAsyncThunk(
    'auth/forgotPassword',
    async (data: ForgotPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await forgotPasswordOtpVerify(data);
            return response.data; // Ensure the correct data is returned
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Redux slice for forgot password OTP verification
export const forgotOtpVerifyAuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Handle pending state
        builder.addCase(forgotPasswordOtpVerifyThunk.pending, (state) => {
            state.loading = true;
        });
        // Handle fulfilled state with correct data structure
        builder.addCase(forgotPasswordOtpVerifyThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.isForgotPassword = true;
            state.user = {
                email: action.payload.user.email,
                accessToken: action.payload.accessToken,
                // Use optional chaining or default values if fields might not be present
                // accessTokenExpiresAt: action.payload.accessTokenExpiresAt ?? '',
                // refreshToken: action.payload.refreshToken ?? '',
                // refreshTokenExpiresAt: action.payload.refreshTokenExpiresAt ?? '',
                // role: action.payload.role ?? { id: 0, name: '', description: '', createdAt: '', updatedAt: '' },
            };
            // state.message = action.payload.message ?? 'OTP verification successful'; // Default message if missing
        });
        // Handle rejected state with error message
        builder.addCase(forgotPasswordOtpVerifyThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

// Export actions and the reducer
export const { setLoading } = forgotOtpVerifyAuthSlice.actions;
export default forgotOtpVerifyAuthSlice.reducer;
