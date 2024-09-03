import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { forgotPassword } from './forgot-password-API';

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

export const forgotPasswordThunk = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await forgotPassword(email);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const forgotAuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setloading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(forgotPasswordThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(forgotPasswordThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.isForgotPassword = true;
            state.user = action.payload;
        });
        builder.addCase(forgotPasswordThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setloading } = forgotAuthSlice.actions;
export default forgotAuthSlice.reducer;