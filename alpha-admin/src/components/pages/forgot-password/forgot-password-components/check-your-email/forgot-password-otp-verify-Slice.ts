import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { forgotPasswordOtpVerify } from './forgot-password-otp-verify-API';

export interface ForgotPasswordUser {
    user: {
        email: string;
    }
    accessToken: string;
}

export interface ForgotAuthState {
    isForgotPassword: boolean;
    user: ForgotPasswordUser | null;
    loading: boolean;
    error: string | null;
}

const initialState: ForgotAuthState = {
    isForgotPassword: false,
    user: null,
    loading: false,
    error: null,
};

interface ForgotPasswordRequest {
    email: string;
    otp: number;
}

export const forgotPasswordOtpVerifyThunk = createAsyncThunk(
    'auth/forgotPassword',
    async (data: ForgotPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await forgotPasswordOtpVerify(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const forgotOtpVerifyAuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(forgotPasswordOtpVerifyThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(forgotPasswordOtpVerifyThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.isForgotPassword = true;
            state.user = action.payload;
        });
        builder.addCase(forgotPasswordOtpVerifyThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setLoading } = forgotOtpVerifyAuthSlice.actions;
export default forgotOtpVerifyAuthSlice.reducer;
